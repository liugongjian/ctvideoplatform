import { urlPrefix } from 'Constants/Dictionary';

const GET_AREALIST = 'GET_AREALIST';
const GET_AREALIST_SUCCESS = 'GET_AREALIST_SUCCESS';
const GET_AREALIST_FAIL = 'GET_AREALIST_FAIL';


const initialState = {
  areatList: [],
  loading: false
};

export default function preview(state = initialState, action = {}) {
  switch (action.type) {
    case GET_AREALIST:
      return {
        ...state,
        loading: true
      };
    case GET_AREALIST_SUCCESS:
      return {
        ...state,
        loading: false,
        areatList: action.data
      };
    case GET_AREALIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return {
        ...state
      };
  }
}

// type 0 - 区域 1 - 摄像头
// arr是[]  默认全部
export function getAreaList(data) {
  return {
    type: [GET_AREALIST, GET_AREALIST_SUCCESS, GET_AREALIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/device/tree/`, {
      data
    })
  };
}
