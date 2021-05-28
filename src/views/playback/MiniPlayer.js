/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import flvjs from 'flv.js';

import styles from './videoPlayer.less';

class MiniPlayer extends Component {
    state={
      videoId: `custom-video${+new Date()}`,
    }

    componentDidMount() {
      const { src } = this.props;
      // const tsrc = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
      // this.initVideo(src);
      this.initVideo(src);
    }

    componentWillReceiveProps(props) {
      try {
        const { src } = props;
        if (!src || src === this.props.src) return;
        // const tsrc = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
        // this.initVideo(src);
        this.initVideo(src);
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
        this.player.load();
        this.player.pause();
        this.player.play();
        // this.drawLine();
        this.player.on(flvjs.Events.MEDIA_INFO, (info) => {
          console.log('MEDIA_INFO', info);
          self.drawLine();
        });
      }
    }

    render() {
      const {
        videoId,
      } = this.state;
      return (
        <div>
          <video className={`${styles.videojs} video-js`} id={videoId} ref={node => this.videoNode = node} controls />
        </div>
      );
    }
}

export default MiniPlayer;
