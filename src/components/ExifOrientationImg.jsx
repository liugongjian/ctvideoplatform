import React, { Component } from 'react';
// import EXIF from 'exif-js';
// import exif2css from 'exif2css';
import EXIF from 'Utils/exif';
import exif2css from 'Utils/exif2css';

const snakeToCamelCaseKeys = obj => Object.keys(obj)
  .map(k => ({
    [k.replace(/(-\w)/g, m => m[1].toUpperCase())]: obj[k]
  }))
  .reduce((a, b) => ({ ...a, ...b }), {});


class ExifOrientationImg extends Component {
  state = {
    orientation: null,
    showImg: false
  };

  onImageLoaded = (...args) => {
    const [event, ...otherArgs] = args;
    const imageElement = event.target;
    const { onLoad } = this.props;
    // console.log('onLoad---------->', onLoad);
    // Fix for an issue affecting exif-js: see https://github.com/exif-js/exif-js/issues/95
    const windowImage = window.Image;
    window.Image = null;

    // Do the actual EXIF operations
    if (
      !EXIF.getData(imageElement, () => {
        this.setState({
          orientation: EXIF.getTag(imageElement, 'Orientation'),
          // 组件需要获取img信息之后旋转，所以在判断是否旋转之前，图片先隐藏，判断之后再展示
          showImg: true
        });
        onLoad && onLoad(event, ...otherArgs);
      })
    ) {
      onLoad && onLoad(event, ...otherArgs);
    }

    // Re-establish the reference
    window.Image = windowImage;
  };

  render() {
    const {
      src, alt, style = {}, onLoad, ...imgProps
    } = this.props;
    const { orientation, showImg } = this.state;
    return (
      <img
        crossOrigin="anonymous"
        onLoad={this.onImageLoaded}
        src={src}
        alt={alt}
        style={{
          opacity: showImg ? '1' : '0',
          ...(orientation ? snakeToCamelCaseKeys(exif2css(orientation)) : {}),
          ...style
        }}
        {...imgProps}
      />
    );
  }
}

export default ExifOrientationImg;
