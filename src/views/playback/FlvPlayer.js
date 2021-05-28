/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import flvjs from 'flv.js';
import {
  format, set, addMinutes, addHours, addSeconds, isWithinInterval, differenceInSeconds
} from 'date-fns';
import { e } from 'mathjs';
import { message } from 'antd';
import TimeRange from './slider';

import styles from './videoPlayer.less';

const step = 1000 * 60 * 1;
const now = new Date();
const getTodayAtSpecificTime = (hour = 12, minute = 0, second = 0) => set(now, {
  hours: hour, minutes: minute, seconds: second, milliseconds: 0
});

// const selectedInterval = [
//   getTodayAtSpecificTime(0),
// ];

// const timelineInterval = [
//   getTodayAtSpecificTime(0),
//   getTodayAtSpecificTime(24)
// ];

// const disabledIntervals = [
//   { start: getTodayAtSpecificTime(16), end: getTodayAtSpecificTime(17) },
//   { start: getTodayAtSpecificTime(7), end: getTodayAtSpecificTime(12) },
//   { start: getTodayAtSpecificTime(20), end: getTodayAtSpecificTime(24) }
// ];

class FlvPlayer extends Component {
    state={
      videoId: `custom-video${+new Date()}`,
      error: false,
      selectedInterval: [],
      timelineInterval: [],
      playableIntervals: [],
      onPlayingIndex: 0,
    }

    componentDidMount() {
      const { lsrc } = this.props;
      // const tsrc = '../../../video/5.mp4';
      // this.initVideo(src);
      this.initVideo(lsrc[0].src);
      this.initVideoSlider(lsrc);
    }

    componentWillReceiveProps(props) {
      try {
        const { lsrc } = props;
        if (!lsrc || lsrc === this.props.lsrc) return;
        // this.initVideo(src);
        this.initVideo(lsrc[0].src);
        this.initVideoSlider(lsrc);
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
          const ct = Math.floor(e.target.currentTime);
          self.setState({ selectedInterval: [addSeconds(this.state.playableIntervals[this.state.onPlayingIndex].start, ct)] });
        };
        // 结束后自动播放下一个视频
        this.videoNode.onended = (e) => {
          self.swithVideo(this.props.lsrc[this.state.onPlayingIndex + 1], 0);
          this.setState({
            onPlayingIndex: this.state.onPlayingIndex + 1,
            selectedInterval: [this.state.playableIntervals[this.state.onPlayingIndex + 1].start]
          });
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

    swithVideo = (lsrc, deviateSeconds, playingIndex) => {
      const self = this;
      this.player.detachMediaElement();
      if (flvjs.isSupported() && lsrc.src) {
        this.player = flvjs.createPlayer({
          type: 'mp4',
          isLive: true,
          url: lsrc.src,
          hasAudio: false // 视频中的音频格式不是AAC，flvjs会报错，所以暂时把声音关掉
        });
        this.player.attachMediaElement(this.videoNode);
        this.player.currentTime = deviateSeconds;
        this.videoNode.ontimeupdate = (e) => {
          const ct = Math.floor(e.target.currentTime);
          self.setState({ selectedInterval: [addSeconds(this.state.playableIntervals[playingIndex].start, ct)] });
        };
        this.videoNode.onended = (e) => {
          self.swithVideo(this.props.lsrc[this.state.onPlayingIndex + 1], 0);
          this.setState({
            onPlayingIndex: this.state.onPlayingIndex + 1,
            selectedInterval: [this.state.playableIntervals[this.state.onPlayingIndex + 1].start]
          });
        };
        this.player.load();
        this.player.play();
      }
    }

    initVideoSlider = () => {
      const { lsrc } = this.props;
      const selectedInterval = [
        getTodayAtSpecificTime(lsrc[0].sttime.hours, lsrc[0].sttime.minutes, lsrc[0].sttime.seconds),
      ];

      const timelineInterval = [
        getTodayAtSpecificTime(0),
        getTodayAtSpecificTime(24)
      ];

      const playableIntervals = lsrc.map((item) => {
        const { sttime, duration } = item;
        const start = getTodayAtSpecificTime(sttime.hours, sttime.minutes, sttime.seconds);
        return {
          start,
          end: addSeconds(addMinutes(addHours(start, duration.hours), duration.minutes), duration.seconds)
        };
      });
      this.setState({ selectedInterval, timelineInterval, playableIntervals });
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

    onSlideStart = (param) => {
      this.player.pause();
    };

    onSlideEnd = (param) => {
      const { lsrc } = this.props;
      // 查找对应视频的index
      const index = this.state.playableIntervals.findIndex(item => isWithinInterval(new Date(param[0]), item));
      console.log('param', param);
      console.log('new Date(param[0])', new Date(param[0]));
      if (index > -1) {
        const deviateSeconds = differenceInSeconds(new Date(param[0]), this.state.playableIntervals[index].start);
        console.log('deviateSeconds', deviateSeconds);
        this.setState({ selectedInterval: [new Date(param[0])], onPlayingIndex: index },
          () => {
            this.swithVideo(lsrc[index], deviateSeconds, index);
          });
      } else {
        message.error('当前时间点无视频');
      }
    };

    onSlideChange = (param) => {
      // console.log('onSlideChange', param);
    }

    errorHandler = (param) => {
      // console.log('param', param);
      this.setState({ error: param.error });
    };

    render() {
      const {
        videoId, canvasLineStyle, canvasWidth, canvasHeight, error, selectedInterval, timelineInterval, playableIntervals
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
              mode={1}
              error={error}
              step={step}
              ticksNumber={24}
              selectedInterval={selectedInterval}
              timelineInterval={timelineInterval}
              // onUpdateCallback={this.errorHandler}
              onChangeCallback={this.onSlideChange}
              onSlideStart={this.onSlideStart}
              onSlideEnd={this.onSlideEnd}
              disabledIntervals={playableIntervals}
            />
          </div>
        </div>
      );
    }
}

export default FlvPlayer;
