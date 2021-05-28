import React, { Component } from 'react';
import {
  Tabs,
  Input,
  Select,
  Upload, Icon, message
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Cropper from 'react-cropper';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class SearchStep1 extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      imageUrl: undefined
    };
  }

  componentDidMount() {
  }

  onSearch = (e) => {
  }

  cropHandle = (cropper) => {
    // 裁剪后的file信息
    console.log(cropper.getCroppedCanvas().toDataURL());
  }

  onCrop = () => {
    // 去抖
    if (this.cropTimeout) {
      clearTimeout(this.cropTimeout);
    }
    const imageElement = this.cropperRef?.current;
    const cropper = imageElement?.cropper;
    this.cropTimeout = setTimeout(() => {
      this.cropHandle(cropper);
    }, 300);
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  //   handleChange = (info) => {
  //     if (info.file.status === 'uploading') {
  //       this.setState({ loading: true });
  //       return;
  //     }
  //     console.log('1111', info.file);
  //     if (info.file.status === 'done') {
  //       // Get this url from response in real world.
  //       this.getBase64(info.file.originFileObj, imageUrl => this.setState({
  //         imageUrl,
  //         loading: false,
  //       }),);
  //     }
  //   };

 beforeUpload = (file) => {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) {
     message.error('请上传JPG/PNG类型的图片!');
   }
   const isLt2M = file.size / 1024 / 1024 < 2;
   if (!isLt2M) {
     message.error('请上传小于2MB的图片!');
   }
   this.getBase64(file, imageUrl => this.setState({
     imageUrl,
     loading: false,
   }),);
   return false;
 }

 render() {
   this.cropperRef = React.createRef();
   const uploadButton = (
     <div>
       <Icon type={this.state.loading ? 'loading' : 'plus'} />
       <div className="ant-upload-text">上传</div>
     </div>
   );
   const { imageUrl } = this.state;
   return (
     <div className={styles.imgSearch}>
       {imageUrl
         ? (
           <Cropper
             src={imageUrl}
             // "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg"
             style={{ width: 300, heiht: 300 }}
             // Cropper.js options
             initialAspectRatio={16 / 9}
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

       {/* <Cropper
         src="https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg"
         style={{ width: 300, height: 300 }}
         // Cropper.js options
         initialAspectRatio={16 / 9}
         guides={false}
         crop={this.onCrop}
         ref={this.cropperRef}
       /> */}
     </div>
   );
 }
}

SearchStep1.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchStep1);
