/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import flvjs from 'flv.js';
import {
  format, set, addMinutes, addHours, addSeconds
} from 'date-fns';
import TimeRange from './slider';

import styles from './videoPlayer.less';

const step = 1000 * 60 * 1;
const now = new Date();
const getTodayAtSpecificHour = (hour = 12) => set(now, {
  hours: hour, minutes: 0, seconds: 0, milliseconds: 0
});

const selectedInterval = [
  getTodayAtSpecificHour(0),
  // getTodayAtSpecificHour(14)
];

const timelineInterval = [
  getTodayAtSpecificHour(0),
  getTodayAtSpecificHour(1)
];

const disabledIntervals = [
  // { start: getTodayAtSpecificHour(16), end: getTodayAtSpecificHour(17) },
  // { start: getTodayAtSpecificHour(7), end: getTodayAtSpecificHour(12) },
  // { start: getTodayAtSpecificHour(20), end: getTodayAtSpecificHour(24) }
];

class FlvPlayer extends Component {
    state={
      videoId: `custom-video${+new Date()}`,
      error: false,
      selectedInterval
    }

    componentDidMount() {
      const { src } = this.props;
      const tsrc = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
      // this.initVideo(src);
      this.initVideo(tsrc);
    }

    componentWillReceiveProps(props) {
      try {
        const { src } = props;
        if (!src || src === this.props.src) return;
        const tsrc = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
        // this.initVideo(src);
        this.initVideo(tsrc);
      } catch (error) {
        console.log(error);
      }
    }

    componentWillUnmount() {
      // 销毁播放器
      if (this.player) {
        this.player.pause();
        this.player.unload();
        this.player.detachMediaElement();
        this.player.destroy();
        this.player = null;
      }
    }

    initVideo = (src) => {
      const self = this;
      if (flvjs.isSupported() && src) {
        this.player = flvjs.createPlayer({
          type: 'mp4',
          isLive: true,
          url: src,
          hasAudio: false // 视频中的音频格式不是AAC，flvjs会报错，所以暂时把声音关掉
        });
        this.player.attachMediaElement(this.videoNode);
        this.videoNode.ontimeupdate = (e) => {
          self.setState({ selectedInterval: [addSeconds(getTodayAtSpecificHour(0), Math.floor(e.target.currentTime))] });
        };
        this.player.load();
        this.player.pause();
        this.player.play();
        // this.drawLine();
        this.player.on(flvjs.Events.MEDIA_INFO, (info) => {
          console.log('MEDIA_INFO', info);
          self.drawLine();
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

    onChangeCallback = (selectedInterval) => {
      // this.player.currentTime = selectedInterval[0];
      // this.player.load();
      // this.player.play();
      // selectedInterval
      // this.video = addHours();
      console.log('se', selectedInterval);
      console.log('this.state.selectedInterval', this.state.selectedInterval);
      // this.setState({ selectedInterval });
    }

    onSlideStart = (param) => {
      this.player.pause();
    };

    onSlideEnd = (param) => {
      // console.log(this.state.selectedInterval);
      this.player.play();
      console.log('onSlideEnd', new Date(parseInt(param, 10)));
      // 这里需要设置视频到相应的位置
      // this.setState({ selectedInterval: [new Date(parseInt(param, 10))] });
    };

    errorHandler = (param) => {
      // console.log('param', param);
      this.setState({ error: param.error });
    };

    render() {
      const {
        videoId, canvasLineStyle, canvasWidth, canvasHeight, selectedInterval, error
      } = this.state;
      return (
        <div className={styles.videoWrap}>
          <video className={`${styles.videojs} video-js`} id={videoId} ref={node => this.videoNode = node} controls />
          <div className={styles.canvasLine} style={canvasLineStyle}>
            <canvas width={canvasWidth} height={canvasHeight} id="pointToPoint" />
          </div>
          <div className={styles.videoSlider}>
            {/* <Slider marks={marks} included={false} defaultValue={37} /> */}
            <TimeRange
              error={error}
              step={step}
              ticksNumber={60}
              selectedInterval={selectedInterval}
              timelineInterval={timelineInterval}
              // onUpdateCallback={this.errorHandler}
              // onChangeCallback={this.onChangeCallback}
              onSlideStart={this.onSlideStart}
              onSlideEnd={this.onSlideEnd}
              disabledIntervals={disabledIntervals}
            />
          </div>
        </div>
      );
    }
}

export default FlvPlayer;
