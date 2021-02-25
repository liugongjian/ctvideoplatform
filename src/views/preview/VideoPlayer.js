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
      console.log('props', props);
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


    initVideo(src) {
      const { videoId } = this.state;
      const { height = '400px', width = '300px' } = this.props;
      this.player = videojs(videoId, {
        height,
        width,
        controls: true,
        preload: 'auto',
        fluid: true,
        autoplay: 'any',
        sources: [
          {
            src,
            type: 'application/x-mpegURL'
          }
        ]
      });
    //   this.player.src({ src });
    }

    render() {
      const { videoId } = this.state;
      return (
        <div className={styles.videoWrap}>
          <video className={`${styles.videojs} video-js`} id={videoId} />
        </div>
      );
    }
}

export default VideoPlayer;
