
import React, { Component } from 'react';
import {
  Select,
  Tabs,
  Form,
  Input,
  Button,
} from 'antd';
import PropTypes from 'prop-types';
import { create, all } from 'mathjs';
import { constant } from 'lodash';
import { DRAW_MODES } from './constants';
import testJpg from './test.jpg';

import styles from './index.less';

const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'number',
  precision: 64,
  predictable: false,
  randomSeed: null
};
const math = create(all, config);

class CanvasOperator extends Component {
  constructor() {
    super();
    this.state = {
      canvas: null,
      canvasDom: null,
      mode: null,
      ratio: 1,
      isDraw: false,
      // startPoint: [],
      points: [], // 绘制轨迹,eg:[[x1,y1],[x2,y2]]
    };
  }

  componentDidMount() {
    // 初始化canvas
    const { id } = this.props;
    const backgroundLayer = document.getElementById(`configCanvas-${id}-bk`);
    const backgroundCtx = backgroundLayer?.getContext('2d');
    const canvasDom = document.getElementById(`configCanvas-${id}-op`);
    const canvas = canvasDom?.getContext('2d');
    this.setState({
      canvas,
      canvasDom,
    });
    // 初始化背景图片和canvas宽高
    const img = new Image();
    img.src = testJpg;
    img.onload = () => {
      // 图片按比例缩放，保存缩放比
      const ratio = math.divide(img.width, backgroundLayer.width);
      this.setState({
        ratio
      });
      const wrapperDom = document.getElementById(`configCanvas-${id}-wrapper`);
      const canvasHeight = math.divide(img.height, ratio); // img.height / ratio;
      console.log('canvasHeight', canvasHeight);
      backgroundLayer.height = canvasHeight;
      canvasDom.height = canvasHeight;
      console.log('wrapperDom', wrapperDom);
      wrapperDom.style = { height: canvasHeight, width: backgroundLayer.width };
      // wrapperDom.style.width = backgroundLayer.width;
      // 图片按缩放比例绘制
      backgroundCtx?.drawImage(img, 0, 0, backgroundLayer.width, backgroundLayer.height);
    };
  }


  setDrawMode = (mode) => {
    this.setState((preState) => {
      if (preState.mode === mode) {
        return { mode: null };
      } return { mode };
    });
  }

  onMouseDown = (e) => {
    const { canvas, canvasDom } = this.state;
    const curPoint = this.getLocation(e.clientX, e.clientY);
    if (curPoint) {
      this.setState({
        isDraw: true,
        points: [curPoint],
      });
    }
  }

  // 传入鼠标clientX/clientY,获取canvas中坐标
  getLocation = (x, y) => {
    const {
      isDraw, canvas, canvasDom, points
    } = this.state;
    console.log('canvasDom.getBoundingClientRect', canvasDom.getBoundingClientRect());
    const {
      x: canvasClientX, y: canvasClientY, width, height
    } = canvasDom?.getBoundingClientRect();
    const pointX = math.subtract(x, canvasClientX);
    const pointY = math.subtract(y, canvasClientY);
    const curPoint = [pointX, pointY];
    console.log('curPoint', curPoint);
    // 出界处理
    if (pointX > canvasClientX + width || pointX < 0) {
      return false;
    }
    if (pointY > canvasClientY + height || pointY < 0) {
      return false;
    }
    return curPoint;
  }

  onMouseMove = (e) => {
    const {
      isDraw, canvas, canvasDom, mode
    } = this.state;
    let { points } = this.state;
    if (!isDraw) {
      return;
    }
    // console.log('e.clientX', e.clientX);
    // console.log('e.clientY', e.clientY);
    const curPoint = this.getLocation(e.clientX, e.clientY);
    if (!curPoint) {
      return;
    }
    points = [...points, curPoint];
    this.setState({ points });
    switch (mode) {
      case DRAW_MODES.RECT: {
        const left = points[0][0];
        const top = points[0][1];
        const prewidth = points.length > 1 && points[points.length - 2][0] - left;
        const preheight = points.length > 1 && points[points.length - 2][1] - top;
        const width = points[points.length - 1][0] - left;
        const height = points[points.length - 1][1] - top;
        canvas.beginPath();
        canvas.lineWidth = '6';
        canvas.strokeStyle = 'red';
        // canvas.clearRect(left, top, prewidth, preheight);
        canvas.clearRect(0, 0, canvasDom.width, canvasDom.height);
        canvas.strokeRect(left, top, width, height);
        break;
      }
      default:
        break;
    }

    // switch (active) {
    //     case 'pen':
    //         canvas.strokeStyle = color
    //         canvas.lineJoin = "round";
    //         canvas.lineWidth = 5;
    //         canvas.beginPath();
    //         arr.length > 1 && canvas.moveTo(arr[arr.length - 2][0], arr[arr.length - 2][1]);
    //         canvas.lineTo(arr[arr.length - 1][0], arr[arr.length - 1][1]);
    //         canvas.closePath();
    //         canvas.stroke();  //描边
    //         return

    //     default:
    //         return
    // }
  }

  onMouseUp = () => {
    this.setState({
      isDraw: false,
    });
  }

  render() {
    const { id, width } = this.props;
    const { mode } = this.state;
    return (
      <div className={styles.canvasOperator}>
        <div className={styles.optButtonWrapper}>
          <div
            className={`${styles.optButton} ${mode === DRAW_MODES.RECT ? styles['optButton-selected'] : ''}`}
            onClick={() => this.setDrawMode(DRAW_MODES.RECT)}
          >
            矩形
          </div>
          <div
            className={`${styles.optButton} ${mode === DRAW_MODES.MUTILPLE ? styles['optButton-selected'] : ''}`}
            onClick={() => this.setDrawMode(DRAW_MODES.MUTILPLE)}
          >
            多边形
          </div>
        </div>
        <div id={`configCanvas-${id}-wrapper`} className={styles.canvasWrapper}>
          <canvas
            id={`configCanvas-${id}-bk`}
            className={`${styles.canvasLayer} ${styles['canvasLayer-bk']}`}
            width={width}
          >
            您的浏览器不支持canvas
          </canvas>
          <canvas
            id={`configCanvas-${id}-op`}
            className={`${styles.canvasLayer} ${styles['canvasLayer-op']}`}
            width={width}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
          />
        </div>
      </div>
    );
  }
}

CanvasOperator.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

export default CanvasOperator;
