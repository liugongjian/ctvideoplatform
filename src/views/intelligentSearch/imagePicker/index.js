import React, { Component } from 'react';
import {
  Tabs,
  Input,
  Select,
  message,
  Spin,
  Icon,
  Upload,
} from 'antd';
import { bindActionCreators } from 'redux';
import {
  saveImages, addImage, delImage, updateImage
} from 'Redux/reducer/intelligentSearch';
import EIcon from 'Components/Icon';
import Cropper from 'react-cropper';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  SEARCH_TYPES_FACE,
  SEARCH_TYPES_PLATE,
} from '../constants';

import styles from './imagePicker.less';


const mapStateToProps = state => ({
  faceImages: state.intelligentSearch.faceImages,
  plateImages: state.intelligentSearch.plateImages,
  nextImageId: state.intelligentSearch.nextImageId,
  nextPlateImageId: state.intelligentSearch.nextPlateImageId,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    // saveImages, addImage, delImage
  },
  dispatch
);

class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropImgLoading: false,
      //   imageUrl: undefined,
      afterCrop: undefined,
      afterCropSrc: undefined,
    };
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData = (props) => {
    const {
      curImage, onImageChange, faceImages, plateImages, imageType
    } = props;
    const images = imageType === SEARCH_TYPES_PLATE ? plateImages : faceImages;
    if (images.length > 0) {
      // 如果当前没有选中图片，或选中图片已经被删
      if (!curImage || !images.find(item => item.id === curImage.id)) {
        onImageChange(images[0]);
      }
    } else {
      onImageChange(null);
    }
  }

  onCropReady = () => {
    // 重复的base64不会重新加载。。。
    this.setState({
      cropImgLoading: false,
    });
  }

  onCrop = () => {
    const {
      cropImgLoading
    } = this.state;
    console.log('cropImgLoading', cropImgLoading);
    // 初始化中的crop结果扔掉
    if (cropImgLoading) {
      return;
    }
    const {
      nextImageId, faceImages, curImage, onImageChange, imageType
    } = this.props;
    const imageElement = this.cropperRef?.current;
    const cropper = imageElement?.cropper;
    const cropperCanvas = cropper?.getCroppedCanvas();
    if (cropperCanvas) {
      cropperCanvas.toBlob((blobObj) => {
        const imgBase64 = cropperCanvas.toDataURL('image/png');
        updateImage({ base64: imgBase64, file: blobObj, id: curImage.id }, imageType);
      }, 'image/jpeg', 0.95);
    }
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
   this.getBase64(file, (imageUrl) => {
     const {
       imageType, curImage
     } = this.props;
     addImage({ base64: imageUrl }, imageType);
     // 如果重复上传同一图片，cropper不会重复加载，onready不执行，导致一直loading
     if (imageUrl === curImage.base64) {
       this.setState({
         cropImgLoading: false,
       });
     }
     const {
       nextImageId, nextPlateImageId, faceImages, plateImages, onImageChange,
     } = this.props;
     switch (imageType) {
       case SEARCH_TYPES_PLATE:
         onImageChange(plateImages[nextPlateImageId - 1]);
         break;
       case SEARCH_TYPES_FACE:
         onImageChange(faceImages[nextImageId - 1]);
         break;
       default:
         break;
     }
   });
   return false;
 }

 onImageSelect = (curImage) => {
   const {
     onImageChange
   } = this.props;
   onImageChange(curImage);
   this.setState({
     cropImgLoading: true,
   });
 }

 handleDelete = (e, id) => {
   if (e && e.stopPropagation) {
     e.stopPropagation(); // ie678 不适用
   } else {
     window.event.cancelBubble = true; // 适用于 ie 678
   }
   delImage(id, this.props.imageType);
   const {
     faceImages, curImage, onImageChange
   } = this.props;
 }

 render() {
   const { cropImgLoading, } = this.state;
   const {
     faceImages, plateImages, curImage, imageType
   } = this.props;
   this.cropperRef = React.createRef();
   const uploadButton = (
     <div>
       <Icon type="plus" />
       {/* type={this.state.uploadLoading ? 'loading' : 'plus'} */}
       <div className="ant-upload-text">请上传图片</div>
     </div>
   );
   const images = imageType === SEARCH_TYPES_PLATE ? plateImages : faceImages;

   const renderImgList = () => {
     if (!images.length) {
       return null;
     }
     return (
       <div className={styles.imgList}>
         {
           images.map(item => (
             <span
               onClick={() => this.onImageSelect(item)}
               className={`${styles['imgList-item']} ${item.id === curImage?.id ? styles['imgList-item-selected'] : ''}`}
               key={item.id}
             >
               <img src={item.base64} value={item} alt="图片" />
               <div className={styles['imgList-item-operatorWrapper']} onClick={e => this.handleDelete(e, item.id)}>
                 <a>
                   {/* <Icon type="anticon-delete" /> */}
                   <EIcon type="myicon-delete" />
                 </a>
               </div>
             </span>
           ))
         }
         {
           images.length < 10
             ? (
               <span key="imgList-plus" className={`${styles['imgList-item']} ${styles['imgList-item-plus']}`}>
                 <Upload
                   listType="picture-card"
                   //  className="avatar-uploader"
                   beforeUpload={this.beforeUpload}
                   showUploadList={false}
                 >
                   <Icon type="plus" />
                 </Upload>
               </span>
             ) : ''
         }

       </div>
     );
   };

   return (
     <React.Fragment>
       <div className={styles.imgWrapper}>
         {curImage
           ? (
             <Spin spinning={cropImgLoading}>
               <Cropper
                 src={curImage.base64}
                 style={{ height: 340, width: '100%' }}
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
       {
         renderImgList()
       }
     </React.Fragment>
   );
 }
}

ImagePicker.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagePicker);
