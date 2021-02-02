
const TRIGGER_ORIGIN = {
  CAR: 'CAR',
  PEOPLE: 'PEOPLE',
};

// 触发规则选项
// 0->all
// 1->black
// 2->陌生车辆或者人
const ALGO_CONFIG_TRIGGER_RULE = {
  ALL: {
    value: 0,
    title: {
      [TRIGGER_ORIGIN.CAR]: '监控区域出现任何机动车均触发告警（全量告警）',
      [TRIGGER_ORIGIN.PEOPLE]: '监控区域出现任何人员均触发告警（全量告警）',
    }
  },
  BLACK: {
    value: 1,
    title: {
      [TRIGGER_ORIGIN.CAR]: '监控区域出现黑名单机动车触发告警（黑名单告警）',
      [TRIGGER_ORIGIN.PEOPLE]: '监控区域出现黑名单人员触发告警（黑名单告警）',
    }
  },
  STRANGER: {
    value: 2,
    title: {
      [TRIGGER_ORIGIN.CAR]: '监控区域出现车牌库外的机动车触发告警（陌生车辆告警）',
      [TRIGGER_ORIGIN.PEOPLE]: '监控区域出现人脸库外人员触发告警（陌生人告警）',
    }
  },
};

// 触发时间
const ALGO_CONFIG_TRIGGER_TIME_TYPE = {
  ALL_TIME: {
    value: 0,
    label: '全时段触发'
  },
  BY_SEL: {
    value: 1,
    label: '部分时段触发'
  },
};

// 1:触发规则，2:触发时间 3:触发区域
const ALGO_CONFIG_TYPE = {
  RULE: 1,
  TIME: 2,
  AREA: 3,
};

export {
  TRIGGER_ORIGIN,
  ALGO_CONFIG_TRIGGER_RULE,
  ALGO_CONFIG_TRIGGER_TIME_TYPE,
  ALGO_CONFIG_TYPE
};
