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
  saveImages, addFaceImage, delFaceImage, updateFaceImage
} from 'Redux/reducer/intelligentSearch';
import EIcon from 'Components/Icon';
import Cropper from 'react-cropper';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import styles from './imagePicker.less';


const mapStateToProps = state => ({
  faceImages: state.intelligentSearch.faceImages,
  nextImageId: state.intelligentSearch.nextImageId,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    // saveImages, addImage, delImage
  },
  dispatch
);

class ImagePicker extends Component {
  constructor() {
    super();
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
      curImage, onImageChange, faceImages
    } = props;
    if (faceImages.length > 0) {
      // 如果当前没有选中图片，或选中图片已经被删
      if (!curImage || !faceImages.find(item => item.id === curImage.id)) {
        onImageChange(faceImages[0]);
      }
    } else {
      onImageChange(null);
    }
  }

  onCropReady = () => {
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
      nextImageId, faceImages, curImage, onImageChange
    } = this.props;
    const imageElement = this.cropperRef?.current;
    const cropper = imageElement?.cropper;
    const cropperCanvas = cropper?.getCroppedCanvas();
    if (cropperCanvas) {
      cropperCanvas.toBlob((blobObj) => {
        const imgBase64 = cropperCanvas.toDataURL('image/png');
        updateFaceImage({ base64: imgBase64, file: blobObj, id: curImage.id });
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
     addFaceImage({ base64: imageUrl });
     const {
       nextImageId, faceImages, curImage, onImageChange
     } = this.props;
     onImageChange(faceImages[nextImageId - 1]);
     //  this.setState({
     //    imageUrl,
     //  });
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
   delFaceImage(id);
   const {
     faceImages, curImage, onImageChange
   } = this.props;
 }

 render() {
   const { cropImgLoading, } = this.state;
   const { faceImages, curImage } = this.props;
   this.cropperRef = React.createRef();
   const uploadButton = (
     <div>
       <Icon type="plus" />
       {/* type={this.state.uploadLoading ? 'loading' : 'plus'} */}
       <div className="ant-upload-text">请上传图片</div>
     </div>
   );

   const renderImgList = () => {
     if (!faceImages.length) {
       return null;
     }
     return (
       <div className={styles.imgList}>
         {
           faceImages.map(item => (
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
           faceImages.length < 10
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
