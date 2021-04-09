import math from 'Utils/math';
import {
  DIRECTION_OPTIONS, // 人流方向
} from 'Views/cameraDetail/constants';

export const getRectPropFromPoints = (startPoint, endPoint) => {
  const left = startPoint[0];
  const top = startPoint[1];
  const width = endPoint[0] - left;
  const height = endPoint[1] - top;
  return {
    left, top, width, height
  };
};

/**
 * 已知直线上的偏移长度，求对应x轴偏移量
 * @param {*} offsetZ 直线上的偏移长度
 * @param {*} k 直线斜率
 */
const getOffsetX = (offsetZ, k) => {
  const powK = math.pow(k, 2);
  return math.divide(offsetZ, math.sqrt(1 + powK));
};

/**
 * 已知直线起止点，求中垂线起止点
 * @param {Array} start 原直线起点
 * @param {Array} end 原直线止点
 * @param {Number} length 中垂线长度
 * @param {Number} direction 0为左上是起点/右下是终点，1则相反
 * @returns {Array} [startPoint, endPoint] 中垂线起止点
 */
export const getVerticalLinePoints = (start, end, length, direction) => {
  // 中垂线求法
  // 设两点的坐标分别为A（x1,y1）,B（x2,y2）.中垂线L的方程为y=kx+b,则：
  // A,B两点间的中点坐标为C （ (x1+x2)/2,(y1+y2)/2 ）
  // A,B两点所在直线的斜率k'=(y1-y2)/(x1-x2)
  // 所以中垂线L的斜率k=-1/k'=-(x1-x2)/(y1-y2)
  // 因为中垂线经过点C,将C点的坐标和斜率k'代入方程式y=kx+b,得：
  // (y1+y2)/2 =-(x1-x2)/(y1-y2)*(x1+x2)/2+b 解得：
  // b=(y1+y2)/2+(x1-x2)/(y1-y2)*(x1+x2)/2
  // 将斜率k和b分别代入方程式L,可得：
  // y=-(x1-x2)/(y1-y2)x+(y1+y2)/2+(x1-x2)/(y1-y2)*(x1+x2)/2
  // 求中点
  const midPoint = [
    math.divide(start[0] + end[0], 2),
    math.divide(start[1] + end[1], 2)
  ];
  // 如果是水平线，立刻返回结果。
  if (start[1] - end[1] === 0) {
    const verticalLen = math.divide(length, 2);
    const startPoint = [midPoint[0], midPoint[1] - verticalLen];
    const endPoint = [midPoint[0], midPoint[1] + verticalLen];
    if (direction === DIRECTION_OPTIONS.REVERSAL.value) {
      return [endPoint, startPoint];
    }
    return [startPoint, endPoint];
  }
  // 中垂线斜率
  const verticalK = -1 * math.divide(start[0] - end[0], start[1] - end[1]);
  console.log('verticalK', verticalK);
  // 统一长度为100
  const verticalLen = math.divide(length, 2);
  const offsetX = getOffsetX(verticalLen, verticalK); // 中垂线起止点距离中点的偏移量
  // 中垂线方程 y=-(x1-x2)/(y1-y2)x+(y1+y2)/2+(x1-x2)/(y1-y2)*(x1+x2)/2
  const C = math.divide(start[1] + end[1], 2)
                  + math.divide(start[0] - end[0], start[1] - end[1])
                  * math.divide(start[0] + end[0], 2);
  // 中垂线方程
  const getVeticalY = x => (verticalK * x + C);
  const startPoint = [midPoint[0] - offsetX, getVeticalY(midPoint[0] - offsetX)];
  const endPoint = [midPoint[0] + offsetX, getVeticalY(midPoint[0] + offsetX)];
  if (direction === DIRECTION_OPTIONS.REVERSAL.value) {
    return [endPoint, startPoint];
  }
  return [startPoint, endPoint];
};
// /**
//  * 获取直线箭头数据(终点是箭头)
//  * @param {Array} start [x,y]直线起点
//  * @param {*} end [x,y]直线终点
//  * @param {number} angle 箭头夹角 默认30度
//  * @param {number} length 箭头头部的长度（斜线）
//  */
// export const getLineArrow = (start, end, angle, length) => {
//   const k = math.divide(end[1] - start[1], end[0], start[0]);
//   const p1 = []

// };

/**
 *
 * @param {*} ctx
 * @param {*} fromX
 * @param {*} fromY
 * @param {*} toX
 * @param {*} toY
 * @param {*} theta 箭头角度
 * @param {*} headlen 箭头长度
 */
export const drawArrow = (ctx, fromX, fromY, toX, toY, theta, headlen) => {
  theta = typeof (theta) !== 'undefined' ? theta : 30;
  headlen = typeof (headlen) !== 'undefined' ? headlen : 10;

  // 计算各角度和对应的P2,P3坐标
  const angle = math.atan2(fromY - toY, fromX - toX) * 180 / math.pi;
  const angle1 = (angle + theta) * math.pi / 180;
  const angle2 = (angle - theta) * math.pi / 180;
  const topX = headlen * math.cos(angle1);
  const topY = headlen * math.sin(angle1);
  const botX = headlen * math.cos(angle2);
  const botY = headlen * math.sin(angle2);

  // ctx.beginPath();

  let arrowX = fromX - topX;
  let arrowY = fromY - topY;

  ctx.moveTo(arrowX, arrowY);
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  arrowX = toX + topX;
  arrowY = toY + topY;
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(arrowX, arrowY);
  console.log('toX, toY', toX, toY);
  ctx.lineTo(toX, toY);
  arrowX = toX + botX;
  arrowY = toY + botY;
  console.log('arrowX, arrowY', arrowX, arrowY);
  ctx.lineTo(arrowX, arrowY);

  ctx.stroke();
};
