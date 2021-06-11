import React, { Component } from 'react';
import {
  Input, Select, Upload, Icon, message, Button, Radio, Dropdown, Menu, Spin
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
  dataURLtoFile
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
      loading: false,
      imageUrl: undefined,
      afterCrop: undefined,
      resData: undefined,
      resLoading: false,
      searchType: SEARCH_TYPES_PLATE,
    };
  }

  componentDidMount() {
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
   }
   //  const isLt2M = file.size / 1024 / 1024 < 2;
   //  if (!isLt2M) {
   //    message.error('请上传小于2MB的图片!');
   //  }
   this.getBase64(file, imageUrl => this.setState({
     imageUrl,
     loading: false,
   }),);
   return false;
 }

 handleMenuClick = (item) => {
   console.log('menuClick', item);
   const {
     afterCrop
   } = this.state;
   if (!afterCrop) {
     message.warn('请上传图片!');
     return;
   }
   this.setState({ searchType: item.key, resLoading: true });
   const formData = new FormData();
   //  const file = dataURLtoFile(afterCrop, 'test.jpeg');
   formData.append('file', afterCrop, 'cropped.jpeg');
   let searchFunc = () => {};
   switch (item.key) {
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
   this.cropperRef = React.createRef();
   const uploadButton = (
     <div>
       <Icon type={this.state.loading ? 'loading' : 'plus'} />
       <div className="ant-upload-text">请上传图片</div>
     </div>
   );
   const {
     imageUrl, searchType, resData, resLoading
   } = this.state;

   const searchOptions = (
     <Menu onClick={this.handleMenuClick}>
       {
         SEARCH_TYPES.map(item => (
           <Menu.Item key={item.value}>{item.label}</Menu.Item>
         ))
       }
     </Menu>
   );
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
   return (
     <div className={styles.intelligentSearch}>
       <div className={styles['intelligentSearch-contentWrapper']}>
         <div className={styles['intelligentSearch-contentWrapper-leftPart']}>
           {/* <div className={styles.subTitle}>检索条件</div> */}
           <div className={styles.searchWrapper}>
             <div className={styles.imgWrapper}>
               {imageUrl
                 ? (
                   <Cropper
                     src={imageUrl}
                     style={{ height: 250, width: '100%' }}
                     //  initialAspectRatio={16 / 9}
                     autoCrop
                     full
                     guides={false}
                     crop={this.onCrop}
                     ref={this.cropperRef}
                   />
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
             {/* <div className={styles.filterWrapper}>
               <Radio.Group
                 options={SEARCH_TYPES}
                 onChange={e => this.setState({ searchType: e.target.value })}
                 value={searchType}
               />
             </div> */}
             <div className={styles.btnWrapper}>
               <Dropdown overlay={searchOptions}>
                 <Button type="primary" className={styles.searchBtn}>
                   <span className={styles.searchBtnText}>开始检索</span>
                   <Icon type="down" className={styles.searchBtnIcon} />
                 </Button>
               </Dropdown>
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

export default connect(mapStateToProps, mapDispatchToProps)(IntelligentSearch);
