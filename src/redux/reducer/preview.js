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

const GET_PEOPLEAREA = 'GET_PEOPLEAREA';
const GET_PEOPLEAREA_SUCCESS = 'GET_PEOPLEAREA_SUCCESS';
const GET_PEOPLEAREA_FAIL = 'GET_PEOPLEAREA_FAIL';

const GET_PEOPLELINE = 'GET_PEOPLELINE';
const GET_PEOPLELINE_SUCCESS = 'GET_PEOPLELINE_SUCCESS';
const GET_PEOPLELINE_FAIL = 'GET_PEOPLELINE_FAIL';

const GET_CURRENTTRAFFIC = 'GET_CURRENTTRAFFIC';
const GET_CURRENTTRAFFIC_SUCCESS = 'GET_CURRENTTRAFFIC_SUCCESS';
const GET_CURRENTTRAFFIC_FAIL = 'GET_CURRENTTRAFFIC_FAIL';

const initialState = {
  areatList: [],
  loading: false,
  historyTop: [],
  videoUrl: {},
  areaInfo: {},
  peopleLine: {},
  currentTraffic: {}
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
    case GET_PEOPLEAREA:
      return {
        ...state,
        loading: true
      };
    case GET_PEOPLEAREA_SUCCESS:
      return {
        ...state,
        loading: false,
        areaInfo: action.data
      };
    case GET_PEOPLEAREA_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case GET_PEOPLELINE:
      return {
        ...state,
        loading: true
      };
    case GET_PEOPLELINE_SUCCESS:
      return {
        ...state,
        loading: false,
        peopleLine: action.data
      };
    case GET_PEOPLELINE_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case GET_CURRENTTRAFFIC:
      return {
        ...state,
        loading: true
      };
    case GET_CURRENTTRAFFIC_SUCCESS:
      return {
        ...state,
        loading: false,
        currentTraffic: action.data
      };
    case GET_CURRENTTRAFFIC_FAIL:
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

export function getAreaInfo(did, aid) {
  return {
    type: [GET_PEOPLEAREA, GET_PEOPLEAREA_SUCCESS, GET_PEOPLEAREA_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/task/area/${did}/${aid}`)
  };
}

export function getPeopleLIne(id, aid, type) {
  return {
    type: [GET_PEOPLEAREA, GET_PEOPLEAREA_SUCCESS, GET_PEOPLEAREA_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/task/result/statistic/traffic/${id}/${aid}?type=${type}`)
  };
}

export function getCurrentTraffic(id, type) {
  return {
    type: [GET_CURRENTTRAFFIC, GET_CURRENTTRAFFIC_SUCCESS, GET_CURRENTTRAFFIC_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/task/result/currday/traffic/${id}/${type}`)
  };
}
