import { urlPrefix } from 'Constants/Dictionary';

const GET_AREALIST = 'GET_AREALIST';
const GET_AREALIST_SUCCESS = 'GET_AREALIST_SUCCESS';
const GET_AREALIST_FAIL = 'GET_AREALIST_FAIL';

const GET_HISTORYTOP = 'GET_HISTORYTOP';
const GET_HISTORYTOP_SUCCESS = 'GET_HISTORYTOP_SUCCESS';
const GET_HISTORYTOP_FAIL = 'GET_HISTORYTOP_FAIL';

const initialState = {
  areatList: [],
  loading: false,
  historyTop: [],
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
    case GET_HISTORYTOP:
      return {
        ...state,
        loading: true,
      };
    case GET_HISTORYTOP_SUCCESS:
      return {
        ...state,
        loading: false,
        historyTop: action.data
      };
    case GET_HISTORYTOP_FAIL:
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

export function getAreaList(data) {
  return {
    type: [GET_AREALIST, GET_AREALIST_SUCCESS, GET_AREALIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/device/tree/`, {
      data
    })
  };
}

export function getHistoryListTopTen(data) {
  return {
    type: [GET_HISTORYTOP, GET_HISTORYTOP_SUCCESS, GET_HISTORYTOP_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/task/result/query`, {
      data
    })
  };
}
