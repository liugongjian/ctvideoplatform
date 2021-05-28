/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
// import ExifOrientationImg from 'react-exif-orientation-img';
import { Modal } from 'antd';
import avatar from 'Assets/avatar.png';
import hidden from 'Assets/hidden.png';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CONFIGURABLE_ITEMS } from 'Constants/Dictionary';
import styles from './index.less';
import ExifOrientationImg from '../ExifOrientationImg';


const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);


class PreviewableImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }


  getImg = (src) => {
    const {
      settings,
      source = ''
    } = this.props;
    // console.log(this.props);
    const switches = settings.switches[CONFIGURABLE_ITEMS.CONFIG_IMAGE_SHOWN].value;
    // console.log(switches);
    if (switches && source !== 'upload') {
      return hidden;
    }
    return src;
  }

  handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = avatar;
  };

  showPreview = () => {
    const { disablePreview = false } = this.props;
    if (!disablePreview) {
      this.setState({
        visible: true
      });
    }
  };

  handleCancel = () => this.setState({ visible: false });

  render() {
    const {
      src, alt = '照片', disablePreview = false, cls, name = false
    } = this.props;
    const { visible } = this.state;
    return (
      <>
        <div className={`${styles['table-pic-wp']} ${cls}`} onClick={this.showPreview}>
          <ExifOrientationImg
            src={this.getImg(src)}
            alt={alt}
            className={`${styles['table-pic']} ${
              disablePreview ? '' : styles['table-pic-previewable']
            }`}
            onError={this.handleImgError}
          />
          {/* <img
            src={src}
            alt={alt}
            className={styles['table-pic']}
            onError={this.handleImgError}
          /> */}
          {name ? <span className={styles.photoName}>{name}</span> : null}
        </div>
        <Modal
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}
          width={568} // 修改modal默认宽度，不然动态生成的图片位置会偏移，因为容器设置了padding:24
        >
          <div className={styles['modal-pic-wp']}>
            <ExifOrientationImg
              src={this.getImg(src)}
              alt="预览"
              className={styles['table-pic-preview-img']}
              onError={this.handleImgError}
              onClick={this.handleCancel}
            />
          </div>
          {/* <img
            className={styles['table-pic-preview-img']}
            alt="预览"
            style={{ width: '100%' }}
            src={src}
            onError={this.handleImgError}
            onClick={this.handleCancel}
          /> */}
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewableImage);
