import React, { Component } from 'react';

const LicenseProvinces = [
  '京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙',
  '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '渝',
  '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新'
];

const ALARM_DETAIL_TYPE = {
  PERSON: '行人',
  CAR: '机动车',
  NONVEHICLE: '非机动车',
  OTHER: '其他',
};

const LABEL_PERSON = {
  WHITE: '白名单', BLACK: '黑名单', OTHER: '陌生人'
};
const LABEL_CAR = {
  WHITE: '白名单', BLACK: '黑名单', OTHER: '其他'
};


const LABEL_VALUES = [
  { label: '白名单', value: 'WHITE' },
  { label: '黑名单', value: 'BLACK' },
  { label: '其他', value: 'OTHER' },
];

const ALARM_TARGET_VALUES = [
  { label: '人员', value: 0 },
  { label: '机动车', value: 1 },
  { label: '非机动车', value: 2 },
];

// 更多筛选项(全为Select)
const MORE_FILTER = {
  FACE_LIBRARY: {
    key: 'labelFace',
    name: '人脸底库',
    selection: LABEL_VALUES,
    mutiple: false,
  },
  PLATE_LIBRARY: {
    key: 'labelPlate',
    name: '车牌底库',
    selection: LABEL_VALUES,
    mutiple: false,
  },
  ALARM_TARGET: {
    key: 'resultLabels',
    name: '告警目标',
    selection: ALARM_TARGET_VALUES,
    mutiple: true,
  }
};

// 去掉告警详情，算法名修改
const AlgoConfigs = {
  // // 移动侦测
  // carPersonCheck: {
  //   // alarmDetail: '视频区域内出现{type}',
  //   hasLabel: true,
  // },
  // // 人员布控
  // faceRecognize: {
  //   alarmDetail: null,
  // },

  // // 车辆布控
  // plateRecognize: {
  //   alarmDetail: null,
  //   carImport: true,
  // },
  // // 电子围栏
  // areaAlarm: {
  //   // alarmDetail: '电子围栏内出现{type}',
  //   hasLabel: true,
  // },
  // // 安全帽识别
  // safetyHat: {
  //   alarmDetail: null,
  // },

  // // 口罩识别
  // maskDetect: {
  //   alarmDetail: null,
  // },

  // 人员布控
  faceRecognizeDS: {
    moreFilter: [MORE_FILTER.FACE_LIBRARY]
  },
  // 车辆布控
  carMonitorDS: {
    carImport: true,
    moreFilter: [MORE_FILTER.PLATE_LIBRARY]
  },
  // 电子围栏
  areaAlarmDS: {
    // alarmDetail: '电子围栏内出现{type}',
    hasLabel: true,
    moreFilter: [MORE_FILTER.ALARM_TARGET]
  },
  // 安全帽识别
  helmetDetectDS: {
  },
  // 口罩检测
  maskDetectDS: {
  }
};

const Tag = ({
  title,
  type
}) => (
  <span
    className={`AlarmCardTag ${`AlarmCardTag-${type}`}`}
  >
    {title}
  </span>
);

export {
  LicenseProvinces,
  AlgoConfigs,
  ALARM_DETAIL_TYPE,
  LABEL_PERSON,
  LABEL_CAR,
  Tag,
};
