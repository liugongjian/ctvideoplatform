import React, { Component } from 'react';
import {
  Tabs,
  Input,
  Select
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

  render() {
    this.cropperRef = React.createRef();
    return (
      <div className={styles.imgSearch}>
        <Cropper
          src="https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg"
          style={{ height: 300, width: 300 }}
          // Cropper.js options
          initialAspectRatio={16 / 9}
          guides={false}
          crop={this.onCrop}
          ref={this.cropperRef}
        />
      </div>
    );
  }
}

SearchStep1.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchStep1);
