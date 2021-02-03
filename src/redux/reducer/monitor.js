import apiClient from '@/Common/ApiClient';
import { urlPrefix } from 'Constants/Dictionary';

const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';

const RENAME_AREA = 'RENAME_AREA';
const RENAME_AREA_SUCCESS = 'RENAME_AREA_SUCCESS';
const RENAME_AREA_FAIL = 'RENAME_AREA_FAIL';

const ADD_AREA = 'ADD_AREA';
const ADD_AREA_SUCCESS = 'ADD_AREA_SUCCESS';
const ADD_AREA_FAIL = 'ADD_AREA_FAIL';

const DEL_AREA = 'DEL_AREA';
const DEL_AREA_SUCCESS = 'DEL_AREA_SUCCESS';
const DEL_AREA_FAIL = 'DEL_AREA_FAIL';

const MOVE_AREA = 'MOVE_AREA';
const MOVE_AREA_SUCCESS = 'MOVE_AREA_SUCCESS';
const MOVE_AREA_FAIL = 'MOVE_AREA_FAIL';

const GET_DEVICE = 'GET_DEVICE';
const GET_DEVICE_SUCCESS = 'GET_DEVICE_SUCCESS';
const GET_DEVICE_FAIL = 'GET_DEVICE_FAIL';

const initialState = {
  areaList: [],
  areaListLoading: false,
  renameArea: {},
  addArea: {},
  deviceList: []
};

export default function monitor(state = initialState, action = {}) {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        areaListLoading: true
      };
    case GET_LIST_SUCCESS:
      return {
        ...state,
        areaList: action.data,
        areaListLoading: false,
      };
    case GET_LIST_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    case RENAME_AREA:
      return {
        ...state,
        areaListLoading: true
      };
    case RENAME_AREA_SUCCESS:
      return {
        ...state,
        areaListLoading: false,
        renameArea: action.data
      };
    case RENAME_AREA_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    case ADD_AREA:
      return {
        ...state,
        areaListLoading: true,
      };
    case ADD_AREA_SUCCESS:
      return {
        ...state,
        areaListLoading: false,
        addArea: action.data
      };
    case ADD_AREA_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    case DEL_AREA:
      return {
        ...state,
        areaListLoading: true,
      };
    case DEL_AREA_SUCCESS:
      return {
        ...state,
        areaListLoading: false,
        // addArea: action.data
      };
    case DEL_AREA_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    case MOVE_AREA:
      return {
        ...state,
        areaListLoading: true,
      };
    case MOVE_AREA_SUCCESS:
      return {
        ...state,
        areaListLoading: false,
        // addArea: action.data
      };
    case MOVE_AREA_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    case GET_DEVICE:
      return {
        ...state,
        areaListLoading: true
      };
    case GET_DEVICE_SUCCESS:
      return {
        ...state,
        areaListLoading: false,
        deviceList: action.data
      };
    case GET_DEVICE_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function getList(pid, keyword) {
  if (keyword) {
    return {
      type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
      promise: apiClient => apiClient.get(`${urlPrefix}/area/list/${pid}/?keyword=${keyword}`)
    };
  }
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/area/list/${pid}/`)
  };
}

export function renameArea(id, name) {
  return {
    type: [RENAME_AREA, RENAME_AREA_SUCCESS, RENAME_AREA_FAIL],
    promise: apiClient => apiClient.put(`${urlPrefix}/area/rename/${id}`, {
      data: {
        name
      }
    })
  };
}

export function addChild(id, name) {
  return {
    type: [RENAME_AREA, RENAME_AREA_SUCCESS, RENAME_AREA_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/area/child/${id}`, {
      data: {
        name
      }
    })
  };
}

export function delArea(id) {
  return {
    type: [DEL_AREA, DEL_AREA_SUCCESS, DEL_AREA_FAIL],
    promise: apiClient => apiClient.del(`${urlPrefix}/area/remove/${id}`)
  };
}

export function upArea(id) {
  return {
    type: [MOVE_AREA, MOVE_AREA_SUCCESS, MOVE_AREA_FAIL],
    promise: apiClient => apiClient.put(`${urlPrefix}/area/up/${id}`)
  };
}

export function downArea(id) {
  return {
    type: [MOVE_AREA, MOVE_AREA_SUCCESS, MOVE_AREA_FAIL],
    promise: apiClient => apiClient.put(`${urlPrefix}/area/down/${id}`)
  };
}

export function getDeiviceList(data) {
  return {
    type: [GET_DEVICE, GET_DEVICE_SUCCESS, GET_DEVICE_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/device/query`, {
      data
    })
  };
}
