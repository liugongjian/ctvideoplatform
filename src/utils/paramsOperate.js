/**
 * @description 把对象拼接成url传输格式
 * @method buildParams
 * @param {Object} obj 需要拼接的对象
 * @param {Boolean} encode 是否需要编码，默认不进行编码
 *
 * @author 胡佳婷
 * @example
 * buildParams({
 *  key1: value1,
 *  key2: value2
 * })
 * return key1=value1&key2=value2
 */
function buildParams(obj, encode = false) {
  if (!obj) {
    return '';
  }
  const params = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key] === undefined ? '' : obj[key];
    if (encode) {
      params.push(`${key}=${encodeURIComponent(value)}`); // 后人请提供使用场景
    } else {
      params.push(`${key}=${value}`);
    }
  }
  const arg = params.join('&');
  return arg;
}

/**
 * @description 把查询参数转化为对象
 * @method buildObj
 * @param {String} str 查询参数
 *
 * @author 胡佳婷
 * @example
 * buildObj("?key1=value1&key2=value2")
 * return
 * {
 *  key1: value1,
 *  key2: value2
 * }
 */
function buildObj(str) {
  if (str === '') {
    return {};
  }
  const search = str.substring(1); // 获取？后面的字符串
  const searchHash = search.split('&');
  const result = {};
  searchHash.map((item) => {
    const pair = item.split('=');
    const key = pair[0];
    const value = pair[1];
    result[key] = value;
  });
  return result;
}

export {
  buildParams,
  buildObj
};
