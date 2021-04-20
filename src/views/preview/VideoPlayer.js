/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-hls';
import 'video.js/dist/video-js.css';
import styles from './videoPlayer.less';

class VideoPlayer extends Component {
    state={
      videoId: `custom-video${+new Date()}`
    }

    componentDidMount() {
      const { src } = this.props;
      this.initVideo(src);
    }

    componentWillReceiveProps(props) {
    //   console.log('props', props);
      try {
        const { src } = props;
        if (!src || src === this.props.src) return;
        this.initVideo(src);
      } catch (error) {
        console.log(error);
      }
    }


    componentWillUnmount() {
      // 销毁播放器
      if (this.player) {
        this.player.dispose();
      }
    }

    drawLine = () => {
      const { pointsInfo = {}, appliedTraffic = false } = this.props;
      if (appliedTraffic) {
        let { area } = pointsInfo;
        area = area === null ? {} : area;
        const { points = [] } = area;
        let { imageWidth, imageHeight } = area;
        // 当返回值为 null 时，解构设置默认值无效，因为null不是严格意义的undefined
        imageWidth = imageWidth || 1920;
        imageHeight = imageHeight || 1080;
        const [a = { x: 1, y: 1 }, b = { x: 1, y: 1 }] = points;
        const tempWidth = this.player.currentWidth();
        const tempHeight = parseInt(this.player.currentWidth() / 16 * 9, 10);
        this.setState({
          canvasLineStyle: {
            width: `${tempWidth}px`,
            height: `${tempHeight}px`,
            top: `${(this.player.currentHeight() - tempHeight) / 2}px`
          },
          canvasWidth: tempWidth,
          canvasHeight: tempHeight
        }, () => {
          // 将接口返回的坐标换算成当前视频尺寸格式的点坐标
          const startPX = tempWidth * a.x / imageWidth;
          const startPY = tempHeight * a.y / imageHeight;
          const endPX = tempWidth * b.x / imageWidth;
          const endPY = tempHeight * b.y / imageHeight;
          const canvas = document.getElementById('pointToPoint');
          const context = canvas.getContext('2d');
          context.moveTo(startPX, startPY);
          context.lineTo(endPX, endPY);
          context.lineWidth = 4;
          context.strokeStyle = 'red';
          context.stroke();
        });
      } else {
        this.setState({
          canvasLineStyle: {
            display: 'none'
          }
        });
      }
    }

    initVideo(src) {
      const { videoId } = this.state;
      const { height = '400px', width = '300px' } = this.props;
      const self = this;
      self.player = videojs(self.videoNode, {
        // height,
        // width,
        controls: true,
        aspectRatio: '16:9',
        preload: 'auto',
        fluid: true,
        autoplay: 'any',
        errorDisplay: false,
        // notSupportedMessage: '视频流离家出走了，请稍后再试',
        techOrder: ['html5'],
        sources: [
          {
            src,
            type: 'application/x-mpegURL'
          }
        ]
      }, function onPlayerReady() {
        this.on('playing', () => {
          self.drawLine();
        });
        this.on('playerresize', () => {
          self.drawLine();
        });
      });
      this.player.src({ src }); // 解决更换src时，videojs不切换视频源的问题
    }

    render() {
      const {
        videoId, canvasLineStyle, canvasWidth, canvasHeight
      } = this.state;
      return (
        <div className={styles.videoWrap}>
          <video className={`${styles.videojs} video-js`} id={videoId} ref={node => this.videoNode = node} data-setup="{}" />
          <div className={styles.canvasLine} style={canvasLineStyle}>
            <canvas width={canvasWidth} height={canvasHeight} id="pointToPoint" />
          </div>
        </div>
      );
    }
}

export default VideoPlayer;
