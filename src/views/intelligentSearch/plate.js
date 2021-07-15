import React, { Component } from 'react';
import {
  Input, Select, Upload, Icon, message, Button, Radio, Dropdown, Menu,
  Spin, Form, Slider, DatePicker
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import math from 'Utils/math';
import {
  searchPlate, saveImages, addImage, delImage
} from 'Redux/reducer/intelligentSearch';
import NODATA_IMG from 'Assets/nodata.png';
import CarRes from './results/carRes';
import ImagePicker from './imagePicker';
import styles from './plate.less';
import {
  SEARCH_PLATE_ORIGIN_TYPE,
  SEARCH_TYPES_PLATE,
} from './constants';
import {
  getTypeFromUrl, dataURLtoFile
} from './utils';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
const mapStateToProps = state => ({
  plateImages: state.intelligentSearch.plateImages,
  nextPlateImageId: state.intelligentSearch.nextPlateImageId,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  { searchPlate },
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
   const { plateImages, getFieldValue } = this.props;
   if (!curImage) {
     message.warn('请上传图片!');
     return;
   }
   this.setState({ resLoading: true });
   const formData = new FormData();
   //  const file = dataURLtoFile(afterCrop, 'test.jpeg');
   // curImage的数据可能没更新，去images里查找对应id
   const chosenImage = plateImages.find(item => item.id === curImage.id);
   const file = chosenImage.file || dataURLtoFile(chosenImage.base64, 'cropped.jpeg');
   formData.append('file', file, 'cropped.jpeg');
   formData.append('lisenceNo', getFieldValue('lisenceNo'));
   this.handleSearchApi(formData, this.props.searchPlate);
 }

 handleSearchApi = (data, searchFunc) => {
   searchFunc(data).then((res) => {
     const nextState = {
       resData: res,
       resLoading: false,
     };
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

 switchPlateOrigin = (e) => {
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

 onReUpload = () => { this.setState({ imageUrl: undefined, resData: undefined }); }

 onImageChange = (curImage) => {
   // 选择图片
   this.setState({
     curImage,
   });
 }

 render() {
   const {
     imageUrl, resData, resLoading, curImage, filterType, total, current, pageSize
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

   const renderRes = resData => <CarRes key={JSON.stringify(resData)} data={resData} />;

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
             ],
           })(<Input />)}
         </Form.Item>
         <Form.Item label="时间区间">
           {getFieldDecorator('timerange', {
             rules: [
             ],
           })(<RangePicker />)}
         </Form.Item>
         <Form.Item label="设备">
           {getFieldDecorator('device', {
             rules: [
             ],
           })(
             <Select>
               <Option value="WHITE">白名单</Option>
               <Option value="BLACK">黑名单</Option>
             </Select>
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
             </Select>
           )}
         </Form.Item>
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
                   识别
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
