/* eslint-disable no-restricted-syntax */

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
import EIcon from 'Components/Icon';
import { DRAW_MODES } from './constants';
import { getRectPropFromPoints } from './utils';
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
      points: [], // 当前绘制轨迹,eg:[[x1,y1],[x2,y2]]
      // areas: [],
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
    // 取消右键默认菜单
    canvasDom.oncontextmenu = e => false;
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
        return { mode: null, isDraw: false, points: [] };
      } return { mode, isDraw: false, points: [] };
    });
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

  // 绘制已暂存在areas中的区域
  renderBeforeAreas = () => {
    const { canvas } = this.state;
    const { areas } = this.props;
    console.log(areas);
    if (areas.length) {
      for (const area of areas) {
        canvas.beginPath();
        const { points } = area;
        switch (area.type) {
          case DRAW_MODES.RECT: {
            const {
              left, top, width, height
            } = getRectPropFromPoints(points[0], points[1]);
            canvas.strokeRect(left, top, width, height);
            break;
          }
          case DRAW_MODES.POLYGON: {
            canvas.moveTo(points[0][0], points[0][1]);
            for (const point of points) {
              canvas.lineTo(point[0], point[1]);
            }
            canvas.lineTo(points[0][0], points[0][1]);
            canvas.stroke();
            break;
          }
          default: break;
        }
        canvas.closePath();
      }
    }
  }

  closePolygon = () => {
    const {
      canvas, points
    } = this.state;
    const { areas, onAreasChange } = this.props;
    const newArea = {
      type: DRAW_MODES.POLYGON,
      points
    };
    canvas.lineTo(points[0][0], points[0][1]);
    canvas.stroke();
    canvas.closePath();
    this.setState({
      isDraw: false,
      points: [],
      // areas: [...areas, newArea]
    });
    onAreasChange([...areas, newArea]);
  }

  onMouseDown = (e) => {
    const {
      canvas, canvasDom, points, mode, isDraw
    } = this.state;
    const curPoint = this.getLocation(e.clientX, e.clientY);
    if (curPoint) {
      switch (mode) {
        case DRAW_MODES.POLYGON:
          if (!isDraw) {
            this.setState({
              isDraw: true,
            });
          } else if (e.button === 2) {
            // 先保存当前点，再闭合
            this.setState(
              ({ points }) => ({ points: [...points, curPoint] }),
              () => { this.closePolygon(); }
            );
          }
          break;
        default:
          this.setState({
            isDraw: true,
            // points: [...points, curPoint]
          });
      }
    }
  }

  onMouseMove = (e) => {
    const {
      isDraw, canvas, canvasDom, mode,
    } = this.state;
    const { points } = this.state;
    if (!isDraw) {
      return;
    }
    // console.log('e.clientX', e.clientX);
    // console.log('e.clientY', e.clientY);
    const curPoint = this.getLocation(e.clientX, e.clientY);
    if (!curPoint) {
      return;
    }
    if (!points.length) {
      points.push(curPoint);
      this.setState({ points });
    }
    // points = [...points, curPoint];
    // this.setState({ points });
    switch (mode) {
      case DRAW_MODES.RECT: {
        const {
          left, top, width, height
        } = getRectPropFromPoints(points[0], curPoint);
        canvas.beginPath();
        canvas.lineWidth = '3';
        canvas.strokeStyle = 'red';
        // 清除绘图区域
        canvas.clearRect(0, 0, canvasDom.width, canvasDom.height);
        // 绘制已暂存区域
        this.renderBeforeAreas();
        // 绘制起点到当前点的矩形
        canvas.strokeRect(left, top, width, height);
        canvas.closePath();
        break;
      }
      case DRAW_MODES.POLYGON: {
        canvas.beginPath();
        canvas.lineWidth = '3';
        canvas.strokeStyle = 'red';
        // 清除绘图区域
        canvas.clearRect(0, 0, canvasDom.width, canvasDom.height);
        // 绘制已暂存区域
        this.renderBeforeAreas();
        // 开始绘制当前多边形
        canvas.moveTo(points[0][0], points[0][1]);
        // 绘制已暂存折点
        for (const point of points) {
          canvas.lineTo(point[0], point[1]);
        }
        // 绘制当前点
        canvas.lineTo(curPoint[0], curPoint[1]);
        canvas.stroke();
        // canvas.closePath();
        break;
      }
      default:

        break;
    }
  }

  onMouseUp = (e) => {
    console.log('onMouseUp');
    const {
      isDraw, canvas, canvasDom, mode, points
    } = this.state;
    const { areas, onAreasChange } = this.props;
    if (!isDraw) {
      return;
    }
    const curPoint = this.getLocation(e.clientX, e.clientY);
    if (!curPoint || !points.length) {
      return;
    }
    switch (mode) {
      case DRAW_MODES.RECT: {
        const newArea = {
          type: DRAW_MODES.RECT,
          points: [points[0], curPoint]
        };
        // 将区域暂存；清空轨迹；清除作画状态
        this.setState({ points: [], isDraw: false, });
        onAreasChange([...areas, newArea]);
        break;
      }
      case DRAW_MODES.POLYGON: {
        // 记录轨迹
        this.setState({ points: [...points, curPoint] });
        break;
      }
      default:
        this.setState({ points: [] });
        break;
    }
  }

  render() {
    const { id, width } = this.props;
    const { mode } = this.state;
    return (
      <div className={styles.canvasOperator}>
        <div className={styles.optButtonWrapper} style={{ width }}>
          <div
            className={`${styles.optButton} ${mode === DRAW_MODES.RECT ? styles['optButton-selected'] : ''}`}
            onClick={() => this.setDrawMode(DRAW_MODES.RECT)}
          >
            <EIcon type="myicon-rect" />
          </div>
          <div
            className={`${styles.optButton} ${mode === DRAW_MODES.POLYGON ? styles['optButton-selected'] : ''}`}
            onClick={() => this.setDrawMode(DRAW_MODES.POLYGON)}
          >
            <EIcon type="myicon-polygon" />
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
  areas: PropTypes.array.isRequired, // 当前已绘制图案, eg:[{type: 'rect', points:[]]
  onAreasChange: PropTypes.func.isRequired,
};

export default CanvasOperator;
