/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import flvjs from 'flv.js';
import { visibilitychange } from './getBrowserState';
import styles from './videoPlayer.less';

class FlvPlayer extends Component {
    state={
      videoId: `custom-video${+new Date()}`
    }

    componentDidMount() {
      const { src } = this.props;
      this.initVideo(src);
    }

    componentWillReceiveProps(props) {
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
        const {
          visibilityChange
        } = visibilitychange();
        this.player.pause();
        this.player.unload();
        this.player.detachMediaElement();
        this.player.destroy();
        this.player = null;
        window.removeEventListener(visibilityChange, this.keepHandle);
      }
    }

    initVideo = (src) => {
      const self = this;
      if (flvjs.isSupported() && src) {
        this.player = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: src,
          hasAudio: false // 视频中的音频格式不是AAC，flvjs会报错，所以暂时把声音关掉
        });
        this.player.attachMediaElement(this.videoNode);
        this.player.load();
        this.player.pause();
        this.player.play();
        // this.drawLine();
        this.player.on(flvjs.Events.MEDIA_INFO, (info) => {
          console.log('MEDIA_INFO', info);
          self.drawLine();
          self.keepVideo();
        });
        // this.player.on('play', (info) => { console.log('timeupdateInfo', info); });
        // this.player.on(flvjs.Events.SCRIPTDATA_ARRIVED, (info) => {
        //   console.log('SCRIPTDATA_ARRIVED', info);
        // });
        // console.log('testFlv', this.player, 'test', this.player._mediaElement.offsetWidth);
        // console.log('mediaInfo', flvjs.Events.MEDIA_INFO);
        // console.log('getConfig----------------->', flvjs.LoggingControl.getConfig());
        // flvjs.LoggingControl.addLogListener((log) => { console.log('addLog-------->', log); });
      }
    }

    keepVideo = () => {
      // flvjs 当切换chrome浏览器tab时，直播视频会暂停为当前时间，切换回当前tab，视频流继续播放，而不是更新为currentTime
      const self = this;
      const {
        visibilityChange
      } = visibilitychange();
      document.addEventListener(visibilityChange, this.keepHandle, false);
    }

    keepHandle = () => {
      const self = this;
      const {
        hidden, visible, visibilityChange, state
      } = visibilitychange();
      if (document[state] === visible) {
        self.player.currentTime = self.player.buffered.end(0) - 0.5;
      } else if (document[state] === hidden) {
        console.log('do nothing');
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
        const tempWidth = this.player._mediaElement.offsetWidth;
        const tempHeight = parseInt(this.player._mediaElement.offsetWidth / 16 * 9, 10);
        this.setState({
          canvasLineStyle: {
            width: `${tempWidth}px`,
            height: `${tempHeight}px`,
            top: `${(this.player._mediaElement.offsetHeight - tempHeight) / 2}px`
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

    render() {
      const {
        videoId, canvasLineStyle, canvasWidth, canvasHeight
      } = this.state;
      return (
        <div className={styles.videoWrap}>
          <video className={`${styles.videojs} video-js`} id={videoId} ref={node => this.videoNode = node} controls />
          <div className={styles.canvasLine} style={canvasLineStyle}>
            <canvas width={canvasWidth} height={canvasHeight} id="pointToPoint" />
          </div>
        </div>
      );
    }
}

export default FlvPlayer;
