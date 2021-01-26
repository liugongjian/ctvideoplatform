export const getUniqueArrayByKey = (key, arr) => {
  const obj = {};
  return (arr || []).reduce((current, next) => {
    obj[next[key]] ? '' : (obj[next[key]] = true && current.push(next));
    return current;
  }, []);
};
