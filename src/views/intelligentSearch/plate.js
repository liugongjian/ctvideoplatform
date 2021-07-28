import React, { Component } from 'react';
import {
  Input, Select, Upload, Icon, message, Button, Radio, Dropdown, Menu,
  Spin, Form, Slider, DatePicker, Cascader
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import math from 'Utils/math';
import moment from 'moment';
import {
  searchPlate, saveImages, addImage, delImage
} from 'Redux/reducer/intelligentSearch';
import {
  getDeviceTree
} from 'Redux/reducer/alarms';
import NODATA_IMG from 'Assets/nodata.png';
import CarRes from './results/carRes';
import ImagePicker from './imagePicker';
import styles from './plate.less';
import {
  SEARCH_PLATE_ORIGIN_TYPE,
  SEARCH_TYPES_PLATE,
  TIME_TO_STRING_FORMAT
} from './constants';
import {
  getTypeFromUrl, dataURLtoFile
} from './utils';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
const mapStateToProps = state => ({
  faceImages: state.intelligentSearch.faceImages,
  plateImages: state.intelligentSearch.plateImages,
  nextImageId: state.intelligentSearch.nextImageId,
  nextPlateImageId: state.intelligentSearch.nextPlateImageId,
  userinfo: state.login?.userinfo,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  { searchPlate, getDeviceTree },
  dispatch
);
const licenseNoReg = /^[0-9a-zA-Z]+$/;
const dateFormat = 'YYYY-MM-DD';
class IntelligentSearch extends Component {
  constructor() {
    super();
    this.state = {
      curImage: null,
      resData: undefined,
      resLoading: false,
      filterType: 0,
      pageSize: 10,
      total: 0,
      current: 1,
      searchParam: null,
      devicesLoading: false,
      deviceList: null,
      deviceTree: null
      // searchType: SEARCH_TYPES_PLATE,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    this.setState({ devicesLoading: true });
    this.props.getDeviceTree().then((res) => {
      const tree = this.dataToTree(res);
      this.setState({
        devicesLoading: false,
        deviceList: res,
        deviceTree: tree
      });
    }).catch((err) => {
      this.setState({
        devicesLoading: false,
      });
    });
  }

  dataToTree = (data) => {
    // 下面的forEach写法会改变原数组，所以深度拷贝一次
    const copy = JSON.parse(JSON.stringify(data));
    const map = {};
    copy.forEach((item) => {
      item.label = item.name;
      // if (item.type == 0) {
      //   item.label = item.name;
      // } else {
      //   item.label = (
      //     <span>
      //       <EIcon type="myicon-monitorIcon" />
      //       {item.name}
      //     </span>
      //   );
      // }
      item.value = item.id;
      map[item.id] = item;
    });
    const val = [];
    copy.forEach((item) => {
      const parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        val.push(item);
      }
    });
    // 子节点为区域，不是设备，不可选
    // const setAreaNodeDisabled = (tree) => {
    //   tree.forEach((item) => {
    //     if (item.children) {
    //       setAreaNodeDisabled(item.children);
    //     } else {
    //       item.disabled = item.type == 0;
    //     }
    //   });
    // };
    // setAreaNodeDisabled(val);
    return val;
  };


 handleSearch = () => {
   const {
     curImage, filterType
   } = this.state;
   const { plateImages, form: { getFieldValue, validateFields } } = this.props;
   if (!curImage && !getFieldValue('lisenceNo')) {
     message.warn('请上传图片或输入车牌号!');
     return;
   }


   this.setState({ resLoading: true });
   const formData = new FormData();
   const [startTime, endTime] = getFieldValue('timerange');
   const device = getFieldValue('device') || null;
   const searchParam = {
     startTime: startTime.startOf('day').format(TIME_TO_STRING_FORMAT),
     endTime: endTime.endOf('day').format(TIME_TO_STRING_FORMAT),
     deviceId: device && device[device.length - 1],
     searchType: filterType,
   };
   if (!filterType) {
     searchParam.label = getFieldValue('label') || null;
   }
   //   else {
   //    searchParam.tenantId = this.props.userinfo?.tenantId;
   //  }
   getFieldValue('lisenceNo') && (searchParam.licenseNo = getFieldValue('lisenceNo'));
   if (curImage) {
     const chosenImage = plateImages.find(item => item.id === curImage.id);
     const file = chosenImage.file || dataURLtoFile(chosenImage.base64, 'cropped.jpeg');
     formData.append('file', file, 'cropped.jpeg');
     this.handleSearchApi(formData, this.props.searchPlate, searchParam);
   } else if (getFieldValue('lisenceNo')) {
     this.setState({
       resData: {
         detail: [{
           box: [], confidence: 1, plate_type: '', platelicense: getFieldValue('lisenceNo')
         }]
       },
       searchParam,
       resLoading: false
     });
   }
 }

 handleSearchApi = (data, searchFunc, searchParam) => {
   searchFunc(data).then((res) => {
     const nextState = {
       resData: res,
       resLoading: false,
       searchParam: searchParam || null,
     };
     this.setState(nextState);
   }).catch((err) => {
     this.setState({
       resData: undefined,
       resLoading: false,
     });
     console.log(err);
   });
 }

 switchPlateOrigin = (e) => {
   e.preventDefault();
   this.setState({
     filterType: parseInt(e.target.value, 0),
   });
 }

 onPageChange = (current, pageSize) => {
   this.setState({
     current,
     pageSize,
   }, this.handleSearch);
 }

 onReUpload = () => { this.setState({ imageUrl: undefined, resData: undefined }); }

 onImageChange = (curImage) => {
   // 选择图片
   this.setState({
     curImage,
   });
 }

 render() {
   const {
     imageUrl, resData, resLoading, curImage, filterType, total, current, pageSize, searchParam
   } = this.state;
   const {
     getFieldDecorator, getFieldValue, validateFields, getFieldError
   } = this.props.form;
   const formItemLayout = {
     labelCol: {
       xs: { span: 24 },
       sm: { span: 6 },
     },
     wrapperCol: {
       xs: { span: 24 },
       sm: { span: 18 },
     },
   };

   //  const marks = {
   //    0: '100%',
   //    100: '0',
   //  };

   const renderRes = resData => <CarRes key={JSON.stringify(resData)} data={resData} searchParam={searchParam} />;

   const renderForm = () => (
     <React.Fragment>
       <div className={styles.filterType}>
         <ButtonGroup size="large" className={styles.btnGroup} onClick={this.switchPlateOrigin}>
           {
             SEARCH_PLATE_ORIGIN_TYPE.map((item, idx) => (
               <Button
                 key={idx}
                 value={idx}
                 className={`${styles['btnGroup-btn']} ${idx === filterType - 0 ? styles['btnGroup-btn-selected'] : ''}`}
                 //  disabled={idx > 0}
               >
                 {item}
               </Button>
             ))
           }
         </ButtonGroup>
       </div>
       <Form {...formItemLayout}>
         <Form.Item label="车牌号">
           {getFieldDecorator('lisenceNo', {
             rules: [
               //  {
               //    validator: (rule, val, callback) => {
               //      //  const licenseNo = getFieldValue('licenseNo');
               //      if (val.length > 7) {
               //        callback('车牌号不能超过8位！');
               //      }
               //      if (!licenseNoReg.test(val)) {
               //        callback('车牌号除省份外仅允许输入数字或字母！');
               //      }
               //      callback();
               //    }
               //  }
             ],
           })(<Input />)}
         </Form.Item>
         <Form.Item label="时间范围">
           {getFieldDecorator('timerange', {
             rules: [
             ],
             initialValue: [moment().subtract('days', 7).startOf('day'), moment().endOf('day')]
           })(
             <RangePicker
               style={{ width: '100%' }}
               //  showTime={{ format: 'HH:mm' }}
               format={dateFormat}
               placeholder={['开始时间', '结束时间']}
               //  onChange={this.onTimeChange}
               //  value={[startTime, endTime]}
               //  onOk={this.onTimeChange}
               allowClear={false}
             />
           )}
         </Form.Item>
         <Form.Item label="设备">
           {getFieldDecorator('device', {
             rules: [
             ],
           })(
             <Cascader
               changeOnSelect
               placeholder="请选择设备"
               popupClassName={styles.cameraCascader}
               options={this.state.deviceTree}
               allowClear={false}
             />
           )}
         </Form.Item>
         { !this.state.filterType ? (
           <Form.Item label="布控标签">
             {getFieldDecorator('label', {
               rules: [
               ],
             })(
               <Select>
                 <Option value="WHITE">白名单</Option>
                 <Option value="BLACK">黑名单</Option>
                 <Option value="OTHER">其他</Option>
               </Select>
             )}
           </Form.Item>
         ) : null }
       </Form>
     </React.Fragment>
   );
   return (
     <div className={styles.intelligentSearch}>
       <div className={styles['intelligentSearch-contentWrapper']}>
         <div className={styles['intelligentSearch-contentWrapper-leftPart']}>
           {/* <div className={styles.subTitle}>{SEARCH_TYPES[searchType]}</div> */}
           <div className={`${styles.searchWrapper} ${styles.scrollbar}`}>
             <div className={styles.searchContent}>
               <ImagePicker
                 imageType={SEARCH_TYPES_PLATE}
                 curImage={curImage}
                 onImageChange={this.onImageChange}
               />
               <div className={styles.filterWrapper}>
                 {
                   renderForm()
                 }
               </div>
             </div>
             <div className={styles.btnWrapper}>
               <Button type="primary" className={styles.searchBtn} onClick={this.handleSearch}>
                 <span className={styles.searchBtnText}>
                   检 索
                 </span>
               </Button>
               {
                 imageUrl ? (
                   <div className={styles.reUpload}>
                     <a href="javascript:void(0);" onClick={this.onReUpload}>
                       <span className={styles['reUpload-text']}>重新上传</span>
                       <Icon type="undo" className={styles['reUpload-icon']} />
                     </a>
                   </div>
                 ) : null
               }
             </div>
           </div>
         </div>
         <div className={styles['intelligentSearch-contentWrapper-rightPart']}>
           <div className={styles.subTitle}>检索结果</div>
           <Spin spinning={resLoading}>
             {
               resData ? renderRes(resData) : (
                 <div className={styles.nodataWrapper}>
                   <img src={NODATA_IMG} alt="" />
                 </div>
               )
             }
           </Spin>
         </div>
       </div>
     </div>
   );
 }
}

IntelligentSearch.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(IntelligentSearch));
