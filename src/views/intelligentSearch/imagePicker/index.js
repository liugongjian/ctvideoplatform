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
  searchPlate, searchFace, saveImages, addImage, delImage
} from 'Redux/reducer/intelligentSearch';
import Cropper from 'react-cropper';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import styles from '../index.less';


const mapStateToProps = state => ({ intelligentSearch: state.intelligentSearch });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    saveImages, addImage, delImage
  },
  dispatch
);

class ImagePicker extends Component {
  constructor() {
    super();
    this.state = {
      cropImgLoading: false,
      imageUrl: undefined,
      afterCrop: undefined,
      afterCropSrc: undefined,
    };
  }

  componentDidMount() {
    // ajax code
    // this.props.getMarkers();
  }

  onCropReady = () => {
    this.setState({
      cropImgLoading: false,
    });
  }

  onCrop = () => {
    const imageElement = this.cropperRef?.current;
    const cropper = imageElement?.cropper;
    const imgBase64 = cropper?.getCroppedCanvas()?.toDataURL('image/png');
    if (imgBase64) {
      this.setState({
        afterCropSrc: imgBase64
      });
    }
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

 render() {
   const { imageUrl, cropImgLoading, } = this.state;
   this.cropperRef = React.createRef();
   const uploadButton = (
     <div>
       <Icon type="plus" />
       {/* type={this.state.uploadLoading ? 'loading' : 'plus'} */}
       <div className="ant-upload-text">请上传图片</div>
     </div>
   );

   const renderImgList = () => {
     const { afterCropSrc } = this.state;
     return (
       <div>
         {/* <img src={afterCropSrc} width={50} height={50} alt="图片" /> */}
       </div>
     );
   };

   return (
     <React.Fragment>
       <div className={styles.imgWrapper}>
         {imageUrl
           ? (
             <Spin spinning={cropImgLoading}>
               <Cropper
                 src={imageUrl}
                 style={{ height: 330, width: '100%' }}
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
       <div className={styles.imgList}>
         {
           renderImgList()
         }
       </div>
     </React.Fragment>
   );
 }
}

ImagePicker.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagePicker);
