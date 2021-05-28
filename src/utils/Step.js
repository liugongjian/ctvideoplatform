// 监控查询粒度
const getStep = (param, base = 86400 * 1000) => {
  // end有可能等于start
  if (param.end >= param.start) {
    // 最小粒度 1天
    const interval = param.end - param.start;
    const maxNum = Math.ceil(interval / base);
    // 暂时限定最多展示60个
    return {
      ...param,
      step: maxNum <= 60 ? 'D' : 'M'
    };
  }
  return param;
};
export default getStep;
