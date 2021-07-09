import React, { Component } from 'react';
import {
  Input, Select, Upload, Icon, message, Button, Radio, Dropdown, Menu,
  Spin, Form, Slider, DatePicker
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import math from 'Utils/math';
import {
  searchPlate, searchFace, saveImages, addImage, delImage
} from 'Redux/reducer/intelligentSearch';
import NODATA_IMG from 'Assets/nodata.png';
import { resizeDependencies, trueDependencies } from 'mathjs';
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
});
const mapDispatchToProps = dispatch => bindActionCreators(
  { searchPlate, searchFace },
  dispatch
);

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
      // searchType: SEARCH_TYPES_PLATE,
    };
  }

  componentDidMount() {
  }

 handleSearch = () => {
   const {
     curImage
   } = this.state;
   const { faceImages } = this.props;
   if (!curImage) {
     message.warn('请上传图片!');
     return;
   }
   this.setState({ resLoading: true });
   const formData = new FormData();
   //  const file = dataURLtoFile(afterCrop, 'test.jpeg');
   // curImage的数据可能没更新，去images里查找对应id
   const chosenImage = faceImages.find(item => item.id === curImage.id);
   const file = chosenImage.file || dataURLtoFile(chosenImage.base64, 'cropped.jpeg');
   formData.append('file', file, 'cropped.jpeg');
   const {
     form: { validateFields }
   } = this.props;
   validateFields((err, values) => {
     if (!err) {
       console.log('Received values of form: ', values);
       const { name, label, confirm } = values;
       const { current, pageSize } = this.state;
       if (name) formData.append('name', name);
       if (label || label === 0) formData.append('label', label);
       if (typeof confirm === 'number') {
         const threshold = (100 - confirm) / 100;
         formData.append('threshold', threshold);
       }
       formData.append('pageNo', current - 1);
       formData.append('pageSize', pageSize);
       this.handleSearchApi(formData, this.props.searchFace);
     }
   });
 }

 handleSearchApi = (data, searchFunc) => {
   const searchType = getTypeFromUrl(this.props);
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
     resData, resLoading, curImage, filterType, total, current, pageSize
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
               {getFieldDecorator('device', {
                 rules: [
                 ],
               })(
                 <Select>
                   <Option value="1">设备1</Option>
                   <Option value="2">设备2</Option>
                   <Option value="3">设备3</Option>
                 </Select>
               )}
             </Form.Item>
             <Form.Item label="时间范围">
               {getFieldDecorator('timeRange', {
                 rules: [
                 ],
               })(
                 <RangePicker
                   style={{ width: '100%' }}
                   showTime={{ format: 'HH:mm' }}
                   format="MM-DD HH:mm"
                   placeholder={['开始时间', '结束时间']}
                   //  onChange={this.onTimeChange}
                   //  value={[startTime, endTime]}
                   //  onOk={this.onTimeChange}
                   allowClear={false}
                 />
               )}
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
