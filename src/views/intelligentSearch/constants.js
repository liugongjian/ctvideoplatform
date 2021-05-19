const LicenseProvinces = [
  '京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙',
  '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '渝',
  '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新'
];

const AMAP_KEY = 'b431bc4a893c601a4a1da49f34cf39db';

const ALARM_DETAIL_TYPE = {
  PERSON: '行人',
  CAR: '机动车',
  NONVEHICLE: '非机动车',
  OTHER: '其他',
};

const LABEL = {
  WHITE: '白名单', BLACK: '黑名单', OTHER: '其他'
};

const AlgoConfigs = {
  // 移动侦测
  carPersonCheck: {
    alarmDetail: '视频区域内出现{type}',
  },
  // 人员布控
  faceRecognize: {
    alarmDetail: null,
  },
  // 车辆布控
  plateRecognize: {
    alarmDetail: null,
    carImport: true,
  },
  // 电子围栏
  areaAlarm: {
    alarmDetail: '电子围栏内出现{type}',
  },
  // 安全帽识别
  safetyHat: {
    alarmDetail: null,
  },
  // 口罩识别
  maskDetect: {
    alarmDetail: null,
  },
};
export {
  LicenseProvinces,
  AlgoConfigs,
  ALARM_DETAIL_TYPE,
  LABEL,
  AMAP_KEY,
};
