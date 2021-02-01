import apiClient from './ApiClient';

const clientApi = apiClient;

const reduxPromise = ({ dispatch }) => next => (action) => {
  const { promise, type, id } = action;
  let mPromise = promise;
  if (typeof promise === 'function') {
    mPromise = promise(clientApi);
  }
  if (mPromise && typeof mPromise.then === 'function') {
    if (type instanceof Array) {
      switch (type.length) {
        case 1:
          throw new Error('单个事件请使用string');
        case 2:
          type.push(type[1]);
          break;
        default:
          break;
      }
      dispatch({ type: type[0], id });
      return mPromise.then((data) => {
        if (data.code === 0) {
          dispatch({ type: type[1], data: data.data, id, });
          // return Promise.resolve(data.data);
          return data.data;
        }
        return Promise.reject(data.message);
      }).catch((error) => {
        dispatch({ type: type[2], error, id });
      });
    }

    // type为string的单个异步请求
    return mPromise.then((data) => {
      if (data.code === 0) {
        dispatch({ type, data: data.data, id, });
        return data.data;
      }
      return Promise.reject(data.message);
    }).catch((error) => {
      dispatch({ type, error, id });
      return Promise.reject(error);
    });
  }

  // 非异步action
  if (type instanceof Array) {
    throw new Error('非异步action不能支持数组');
  }
  return next(action);
};

export default reduxPromise;
