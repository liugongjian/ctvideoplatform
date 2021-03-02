import { urlPrefix } from 'Constants/Dictionary';

const GET_AREALIST = 'GET_AREALIST';
const GET_AREALIST_SUCCESS = 'GET_AREALIST_SUCCESS';
const GET_AREALIST_FAIL = 'GET_AREALIST_FAIL';

const GET_HISTORYTOP = 'GET_HISTORYTOP';
const GET_HISTORYTOP_SUCCESS = 'GET_HISTORYTOP_SUCCESS';
const GET_HISTORYTOP_FAIL = 'GET_HISTORYTOP_FAIL';

const GET_VIDEOSRC = 'GET_VIDEOSRC';
const GET_VIDEOSRC_SUCCESS = 'GET_VIDEOSRC_SUCCESS';
const GET_VIDEOSRC_FAIL = 'GET_VIDEOSRC_FAIL';

const initialState = {
  areatList: [],
  loading: false,
  historyTop: [],
  videoUrl: {}
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
    case GET_VIDEOSRC:
      return {
        ...state,
        loading: true
      };
    case GET_VIDEOSRC_SUCCESS:
      return {
        ...state,
        videoUrl: action.data,
        loading: false
      };
    case GET_VIDEOSRC_FAIL:
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

export function getVideoSrc(id) {
  return {
    type: [GET_VIDEOSRC, GET_VIDEOSRC_SUCCESS, GET_VIDEOSRC_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/device/stream/${id}`)
  };
}
