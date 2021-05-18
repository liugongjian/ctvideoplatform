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

const DEL_DEVICE = 'DEL_DEVICE';
const DEL_DEVICE_SUCCESS = 'DEL_DEVICE_SUCCESS';
const DEL_DEVICE_FAIL = 'DEL_DEVICE_FAIL';

const GET_ALGORITHMLIST = 'GET_ALGORITHMLIST';
const GET_ALGORITHMLIST_SUCCESS = 'GET_ALGORITHMLIST_SUCCESS';
const GET_ALGORITHMLIST_FAIL = 'GET_ALGORITHMLIST_FAIL';

const GET_DEVICEPOOL = 'GET_DEVICEPOOL';
const GET_DEVICEPOOL_SUCCESS = 'GET_DEVICEPOOL_SUCCESS';
const GET_DEVICEPOOL_FAIL = 'GET_DEVICEPOOL_FAIL';

const GET_AREANAME = 'GET_AREANAME';
const GET_AREANAME_SUCCESS = 'GET_AREANAME_SUCCESS';
const GET_AREANAME_FAIL = 'GET_AREANAME_FAIL';

const initialState = {
  areaList: [],
  areaListLoading: false,
  renameArea: {},
  addArea: {},
  deviceList: [],
  deleteDevice: {},
  algorithmList: {},
  devicepool: [],
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
        areaListLoading: false,
        areaList: action.data,
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
    case DEL_DEVICE:
      return {
        ...state,
        areaListLoading: true
      };
    case DEL_DEVICE_SUCCESS:
      return {
        ...state,
        areaListLoading: false,
        deleteDevice: action.data
      };
    case DEL_DEVICE_FAIL:
      return {
        ...state,
        error: action.error
      };
    case GET_ALGORITHMLIST:
      return {
        ...state,
        areaListLoading: true
      };
    case GET_ALGORITHMLIST_SUCCESS:
      return {
        ...state,
        algorithmList: action.data,
        areaListLoading: false
      };
    case GET_ALGORITHMLIST_FAIL:
      return {
        ...state,
        error: action.error
      };
    case GET_DEVICEPOOL:
      return {
        ...state,
        areaListLoading: true
      };
    case GET_DEVICEPOOL_SUCCESS:
      return {
        ...state,
        areaListLoading: false,
        devicepool: action.data
      };
    case GET_DEVICEPOOL_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    case GET_AREANAME:
      return {
        ...state,
        areaListLoading: true
      };
    case GET_AREANAME_SUCCESS:
      return {
        ...state,
        areaListLoading: false
      };
    case GET_AREANAME_FAIL:
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
      promise: apiClient => apiClient.get(`${urlPrefix}/area/list/${pid}/?keyword=${encodeURI(keyword)}`)
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

export function delDeviceById(data) {
  return {
    type: [DEL_DEVICE, DEL_DEVICE_SUCCESS, DEL_DEVICE_FAIL],
    promise: apiClient => apiClient.del(`${urlPrefix}/device`, {
      data
    })
  };
}

export function getAlgorithmList() {
  return {
    type: [GET_ALGORITHMLIST, GET_ALGORITHMLIST_SUCCESS, GET_ALGORITHMLIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/algorithm/list`)
  };
}

export function getDevicePoolList(param) {
  return {
    type: [GET_DEVICEPOOL, GET_DEVICEPOOL_SUCCESS, GET_DEVICEPOOL_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/devicepool/query`, {
      data: param
    })
  };
}

export function setDeviceList(data, id) {
  return {
    type: [GET_DEVICEPOOL, GET_DEVICEPOOL_SUCCESS, GET_DEVICEPOOL_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/devicepool/area/${id}`, {
      data
    })
  };
}

export function getAreaName(id) {
  return {
    type: [GET_AREANAME, GET_AREANAME_SUCCESS, GET_AREANAME_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}//area/${id}/path`)
  };
}
