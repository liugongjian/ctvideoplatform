import { urlPrefix } from 'Constants/Dictionary';

const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';


const initialState = {
  areaList: [],
  areaListLoading: false
};

export default function monitor(state = initialState, action = {}) {
  console.log('reducer', action);
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        areaListLoading: true
      };
    case GET_LIST_SUCCESS:
      return {
        ...state,
        areaListLoading: false,
        areaList: action.data,
      };
    case GET_LIST_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function getList(pid) {
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/area/list/${pid}`).then((res) => { console.log('res', res); return res; })
  };
}
