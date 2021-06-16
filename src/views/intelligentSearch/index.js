import React, { Component } from 'react';
import {
  Input, Select, Upload, Icon, message, Button, Radio, Dropdown, Menu,
  Spin, Form, Slider
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Cropper from 'react-cropper';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import { searchPlate, searchFace } from 'Redux/reducer/intelligentSearch';
import NODATA_IMG from 'Assets/nodata.png';
import { trueDependencies } from 'mathjs';
import PeopleRes from './results/peopleRes';
import CarRes from './results/carRes';
import styles from './index.less';
import {
  SEARCH_TYPES,
  SEARCH_TYPES_FACE,
  SEARCH_TYPES_PLATE,
} from './constants';
import {
  getTypeFromUrl
} from './utils';

const { Search } = Input;
const { Option } = Select;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  { searchPlate, searchFace },
  dispatch
);

class IntelligentSearch extends Component {
  constructor() {
    super();
    this.state = {
      cropImgLoading: false,
      imageUrl: undefined,
      afterCrop: undefined,
      resData: undefined,
      resLoading: false,
      // searchType: SEARCH_TYPES_PLATE,
    };
  }

  componentDidMount() {
  }

  onCropReady = () => {
    this.setState({
      cropImgLoading: false,
    });
  }

  onCrop = () => {
    const imageElement = this.cropperRef?.current;
    const cropper = imageElement?.cropper;
    // const imgBase64 = cropper?.getCroppedCanvas()?.toDataURL('image/png');
    // if (imgBase64) {
    //   this.setState({
    //     afterCrop: imgBase64
    //   });
    // }
    cropper?.getCroppedCanvas()?.toBlob((blobObj) => {
      this.setState({
        afterCrop: blobObj,
      });
    }, 'image/jpeg', 0.95);
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

 beforeUpload = (file) => {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) {
     message.error('请上传JPG/PNG类型的图片!');
     return true;
   }
   //  const isLt2M = file.size / 1024 / 1024 < 2;
   //  if (!isLt2M) {
   //    message.error('请上传小于2MB的图片!');
   //  }
   this.setState({
     cropImgLoading: true,
   });
   this.getBase64(file, imageUrl => this.setState({
     imageUrl,
   }),);
   return false;
 }

 handleMenuClick = () => {
   const searchType = getTypeFromUrl(this.props);
   console.log('menuClick-searchType', searchType);
   const {
     afterCrop
   } = this.state;
   if (!afterCrop) {
     message.warn('请上传图片!');
     return;
   }
   this.setState({ resLoading: true });
   const formData = new FormData();
   //  const file = dataURLtoFile(afterCrop, 'test.jpeg');
   formData.append('file', afterCrop, 'cropped.jpeg');
   let searchFunc = () => {};
   switch (searchType) {
     case SEARCH_TYPES_PLATE:
       searchFunc = this.props.searchPlate;
       break;
     case SEARCH_TYPES_FACE:
       searchFunc = this.props.searchFace;
       break;
     default:
       break;
   }
   searchFunc(formData).then((res) => {
     this.setState({
       resData: res,
       resLoading: false,
     });
     console.log('res', res);
   }).catch((err) => {
     this.setState({
       resData: undefined,
       resLoading: false,
     });
     console.log(err);
   });
 }

 onReUpload = () => { this.setState({ imageUrl: undefined, resData: undefined }); }

 render() {
   const {
     imageUrl, resData, resLoading, cropImgLoading
   } = this.state;
   const { getFieldDecorator } = this.props.form;
   const formItemLayout = {
     labelCol: {
       xs: { span: 24 },
       sm: { span: 8 },
     },
     wrapperCol: {
       xs: { span: 24 },
       sm: { span: 16 },
     },
   };

   //  const marks = {
   //    0: '100%',
   //    100: '0',
   //  };

   this.cropperRef = React.createRef();
   const uploadButton = (
     <div>
       <Icon type="plus" />
       {/* type={this.state.uploadLoading ? 'loading' : 'plus'} */}
       <div className="ant-upload-text">请上传图片</div>
     </div>
   );


   const searchType = getTypeFromUrl(this.props);
   //  const searchOptions = (
   //    <Menu onClick={this.handleMenuClick}>
   //      {
   //        SEARCH_TYPES.map(item => (
   //          <Menu.Item key={item.value}>{item.label}</Menu.Item>
   //        ))
   //      }
   //    </Menu>
   //  );
   const renderRes = (resData) => {
     switch (searchType) {
       case SEARCH_TYPES_PLATE:
         return <CarRes data={resData} />;
       case SEARCH_TYPES_FACE:
         return <PeopleRes data={resData} />;
       default:
         return null;
     }
   };

   const renderForm = () => {
     switch (searchType) {
       case SEARCH_TYPES_FACE:
         return (
           <Form {...formItemLayout}>
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
                   <Select.Option value="white">白名单</Select.Option>
                   <Select.Option value="black">黑名单</Select.Option>
                   <Select.Option value="other">其他</Select.Option>
                 </Select>
               )}
             </Form.Item>
             <Form.Item label="置信度">
               {getFieldDecorator('confirm', {
                 rules: [
                 ],
               })(
                 <Slider
                   step={1}
                   defaultValue={10}
                   tipFormatter={value => (`${100 - value}%`)}
                   reverse
                   //  tooltipVisible
                 />
               )}
             </Form.Item>
           </Form>
         );
       case SEARCH_TYPES_PLATE:
       default:
         return null;
     }
   };
   return (
     <div className={styles.intelligentSearch}>
       <div className={styles['intelligentSearch-contentWrapper']}>
         <div className={styles['intelligentSearch-contentWrapper-leftPart']}>
           <div className={styles.subTitle}>{SEARCH_TYPES[searchType]}</div>
           <div className={styles.searchWrapper}>
             <div className={styles.imgWrapper}>
               {imageUrl
                 ? (
                   <Spin spinning={cropImgLoading}>
                     <Cropper
                       src={imageUrl}
                       style={{ height: 250, width: '100%' }}
                       //  initialAspectRatio={16 / 9}
                       autoCrop
                       autoCropArea={1}
                       ready={this.onCropReady}
                       full
                       guides={false}
                       crop={this.onCrop}
                       ref={this.cropperRef}
                     />
                   </Spin>
                 )
                 : (
                   <Upload
                     listType="picture-card"
                     //  className="avatar-uploader"
                     beforeUpload={this.beforeUpload}
                     showUploadList={false}
                   >
                     { uploadButton}
                   </Upload>
                 )
               }
             </div>
             <div className={styles.filterWrapper}>
               {
                 renderForm()
               }
             </div>
             <div className={styles.btnWrapper}>
               {/* <Dropdown overlay={searchOptions}>
                 <Button type="primary" className={styles.searchBtn}>
                   <span className={styles.searchBtnText}>开始检索</span>
                   <Icon type="down" className={styles.searchBtnIcon} />
                 </Button>
               </Dropdown> */}
               <Button type="primary" className={styles.searchBtn} onClick={this.handleMenuClick}>
                 <span className={styles.searchBtnText}>开始检索</span>
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
