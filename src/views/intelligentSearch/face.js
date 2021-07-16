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
  searchPlate, searchFace, searchFaceFromCapture
} from 'Redux/reducer/intelligentSearch';
import NODATA_IMG from 'Assets/nodata.png';
import { resizeDependencies, trueDependencies } from 'mathjs';
import {
  getDeviceTree
} from 'Redux/reducer/alarms';
import PeopleRes from './results/peopleRes';
import CarRes from './results/carRes';
import ImagePicker from './imagePicker';
import styles from './face.less';
import {
  SEARCH_TYPES,
  SEARCH_TYPES_FACE,
  SEARCH_TYPES_PLATE,
  SEARCH_FACE_ORIGIN_TYPE,
} from './constants';
import {
  getTypeFromUrl, dataURLtoFile
} from './utils';

const { RangePicker } = DatePicker;

const { Search } = Input;
const { Option } = Select;
const ButtonGroup = Button.Group;
const mapStateToProps = state => ({
  faceImages: state.intelligentSearch.faceImages,
  plateImages: state.intelligentSearch.plateImages,
  nextImageId: state.intelligentSearch.nextImageId,
  nextPlateImageId: state.intelligentSearch.nextPlateImageId,
  // userinfo: state.login?.userinfo,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    searchPlate, searchFace, getDeviceTree, searchFaceFromCapture
  },
  dispatch
);

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
class IntelligentSearch extends Component {
  constructor() {
    super();
    this.state = {
      curImage: null,
      resData: undefined,
      resLoading: false,
      filterType: 0,
      pageSize: 15,
      total: 0,
      current: 1,
      deviceTree: [],
      devicesLoading: false,
      // searchType: SEARCH_TYPES_PLATE,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    this.setState({ devicesLoading: true });
    this.props.getDeviceTree().then((res) => {
      console.log('getDeviceTree', res);
      const tree = this.dataToTree(res);
      console.log('DeviceTree', tree);
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
    const setAreaNodeDisabled = (tree) => {
      tree.forEach((item) => {
        if (item.children) {
          setAreaNodeDisabled(item.children);
        } else {
          item.disabled = item.type == 0;
        }
      });
    };
    setAreaNodeDisabled(val);
    return val;
  };

 handleSearch = () => {
   const {
     curImage
   } = this.state;
   const { faceImages } = this.props;


   const formData = new FormData();
   //  const file = dataURLtoFile(afterCrop, 'test.jpeg');
   // curImage的数据可能没更新，去images里查找对应id
   if (curImage) {
     const chosenImage = faceImages.find(item => item.id === curImage.id);
     const file = chosenImage.file || dataURLtoFile(chosenImage.base64, 'cropped.jpeg');
     formData.append('file', file, 'cropped.jpeg');
   }
   const {
     form: { validateFields }
   } = this.props;
   validateFields((err, values) => {
     if (!err) {
       console.log('Received values of form: ', values);
       const {
         name, label, confirm, timeRange, deviceId
       } = values;
       console.log('timeRange', timeRange);
       if (!curImage && !name) {
         message.warn('请上传图片或输入姓名!');
         return;
       }
       const { current, pageSize } = this.state;
       if (name) formData.append('name', name);
       if (label !== undefined) formData.append('label', label);
       if (deviceId !== undefined) {
         formData.append('deviceId', deviceId.pop());
       }
       if (timeRange !== undefined) {
         const [startMoment, endMoment] = timeRange;
         formData.append('startTime', startMoment.startOf('day').format(timeFormat));
         formData.append('endTime', endMoment.endOf('day').format(timeFormat));
       }
       if (typeof confirm === 'number') {
         const threshold = (100 - confirm) / 100;
         formData.append('threshold', threshold);
       }
       formData.append('pageNo', current - 1);
       formData.append('pageSize', pageSize);
       this.setState({ resLoading: true });
       this.handleSearchApi(formData);
     }
   });
 }

 searchFaceFromCapture = () => {
   this.props.searchFaceFromCapture;
 }

 handleSearchApi = (data) => {
   const searchType = getTypeFromUrl(this.props);
   const { filterType } = this.state;
   const { searchFace, searchFaceFromCapture } = this.props;
   let searchFunc = () => {};
   switch (filterType - 0) {
     case 0:
       searchFunc = searchFace;
       break;
     case 1:
       //  if (!this.props.userinfo?.tenantId) {
       //    message.error('请登陆！');
       //    return;
       //  }
       //  data.append('tenantId', this.props.userinfo?.tenantId); // 'ff8081817a194de4017a19ae4fbd005f'
       searchFunc = searchFaceFromCapture;
       break;
     default:
       break;
   }
   searchFunc(data).then((res) => {
     const nextState = {
       resData: res,
       resLoading: false,
     };
     const {
       pageNo,
       pageSize,
       pageTotal,
       recordsTotal,
       list,
     } = res;
     let current = pageNo + 1;
     const maxPage = recordsTotal === 0
       ? 1 : math.ceil(math.divide(recordsTotal, pageSize));
     if (!list?.length && current > maxPage) {
       current = maxPage;
       this.onPageChange(current, pageSize);
       return;
     }
     nextState.pageSize = pageSize;
     nextState.total = recordsTotal;
     nextState.current = pageNo + 1;
     this.setState(nextState);
     console.log('res', res);
   }).catch((err) => {
     this.setState({
       resData: undefined,
       resLoading: false,
     });
     console.log(err);
   });
 }

 switchFaceOrigin = (e) => {
   e.preventDefault();
   console.log('click', e.target.value);
   this.setState({
     filterType: e.target.value,
   });
 }

 onPageChange = (current, pageSize) => {
   this.setState({
     current,
     pageSize,
   }, this.handleSearch);
 }

 onImageChange = (curImage) => {
   // 选择图片
   this.setState({
     curImage,
   });
 }

 render() {
   const {
     resData, resLoading, curImage, filterType, total, current, pageSize,
     deviceTree, devicesLoading,
   } = this.state;
   const { getFieldDecorator } = this.props.form;
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

   const renderRes = (resData) => {
     if (resData?.list?.length > 0) {
       return (
         <PeopleRes
           data={resData}
           pageSize={pageSize}
           total={total}
           current={current}
           handlePageChange={this.onPageChange}
         />
       );
     }
     return (
       <div className={styles.nodataWrapper}>
         <img src={NODATA_IMG} alt="" />
       </div>
     );
   };

   const renderFilters = (filterType) => {
     switch (filterType) {
       case 0:
         return (
           <React.Fragment>
             <Form.Item label="姓名">
               {getFieldDecorator('name', {
                 rules: [
                 ],
               })(<Input />)}
             </Form.Item>
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
             <Form.Item label="置信度">
               {getFieldDecorator('confirm', {
                 initialValue: 70,
                 rules: [
                 ],
               })(
                 <Slider
                   step={1}
                   tipFormatter={value => (`${100 - value}%`)}
                   reverse
                   //  tooltipVisible
                 />
               )}
             </Form.Item>
           </React.Fragment>
         );
       case 1:
         return (
           <React.Fragment>
             <Form.Item label="姓名">
               {getFieldDecorator('name', {
                 rules: [
                 ],
               })(<Input />)}
             </Form.Item>
             <Form.Item label="设备">
               {getFieldDecorator('deviceId', {
                 rules: [
                 ],
               })(
                 <Cascader
                   //  changeOnSelect
                   placeholder="请选择设备"
                   popupClassName={styles.cameraCascader}
                   options={deviceTree}
                   allowClear={false}
                 />
               )}
             </Form.Item>
             <Form.Item label="日期范围">
               {getFieldDecorator('timeRange', {
                 rules: [
                 ],
                 initialValue: [moment().subtract('days', 7).startOf('day'), moment().endOf('day')]
               })(
                 <RangePicker
                   style={{ width: '100%' }}
                   //  showTime={{ format: 'HH:mm' }}
                   format={dateFormat}
                   placeholder={['开始日期', '结束日期']}
                   //  onChange={this.onTimeChange}
                   //  value={[startTime, endTime]}
                   //  onOk={this.onTimeChange}
                   allowClear={false}
                 />
               )}
             </Form.Item>
             <Form.Item label="置信度">
               {getFieldDecorator('confirm', {
                 initialValue: 70,
                 rules: [
                 ],
               })(
                 <Slider
                   step={1}
                   tipFormatter={value => (`${100 - value}%`)}
                   reverse
                   //  tooltipVisible
                 />
               )}
             </Form.Item>
           </React.Fragment>
         );
       default:
         break;
     }
   };

   const renderForm = () => (
     <React.Fragment>
       <div className={styles.filterType}>
         <ButtonGroup size="large" className={styles.btnGroup} onClick={this.switchFaceOrigin}>
           {
             SEARCH_FACE_ORIGIN_TYPE.map((item, idx) => (
               <Button
                 key={idx}
                 value={idx}
                 className={`${styles['btnGroup-btn']} ${idx === filterType - 0 ? styles['btnGroup-btn-selected'] : ''}`}
                 disabled={idx > 1}
               >
                 {item}
               </Button>
             ))
           }
         </ButtonGroup>
       </div>
       <Form {...formItemLayout}>
         {
           renderFilters(filterType - 0)
         }
       </Form>
     </React.Fragment>
   );

   return (
     <div className={styles.intelligentSearch}>
       <div className={styles['intelligentSearch-contentWrapper']}>
         <div className={styles['intelligentSearch-contentWrapper-leftPart']}>
           {/* <div className={styles.subTitle}>{SEARCH_TYPES[searchType]}</div> */}
           <div className={styles.searchWrapper}>
             <div className={styles.searchContent}>
               <ImagePicker
                 key={SEARCH_TYPES_FACE}
                 imageType={SEARCH_TYPES_FACE}
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
               {/* <Dropdown overlay={searchOptions}>
                 <Button type="primary" className={styles.searchBtn}>
                   <span className={styles.searchBtnText}>开始检索</span>
                   <Icon type="down" className={styles.searchBtnIcon} />
                 </Button>
               </Dropdown> */}
               <Button type="primary" className={styles.searchBtn} onClick={this.handleSearch}>
                 <span className={styles.searchBtnText}>
                   检索
                 </span>
               </Button>
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
