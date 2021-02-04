import { urlPrefix } from 'Constants/Dictionary';
import { message } from 'antd';

const lixueping = '/lixueping';

const GET_LIST = 'CAMERA_DETAIL/GET_LIST';
const GET_LIST_SUCCESS = 'CAMERA_DETAIL/GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'CAMERA_DETAIL/GET_LIST_FAIL';

const GET_BASIC = 'CAMERA_DETAIL/GET_BASIC';
const GET_BASIC_SUCCESS = 'CAMERA_DETAIL/GET_BASIC_SUCCESS';
const GET_BASIC_FAIL = 'CAMERA_DETAIL/GET_BASIC_FAIL';

const GET_ALGO_CONFIG_LIST = 'CAMERA_DETAIL/GET_ALGO_CONFIG_LIST';
const GET_ALGO_CONFIG_LIST_SUCCESS = 'CAMERA_DETAIL/GET_ALGO_CONFIG_LIST_SUCCESS';
const GET_ALGO_CONFIG_LIST_FAIL = 'CAMERA_DETAIL/GET_ALGO_CONFIG_LIST_FAIL';

const PUT_DATA_SUCCESS = 'CAMERA_DETAIL/PUT_DATA_SUCCESS';


const DO_NOTHING = 'CAMERA_DETAIL/DO_NOTHING';

const initialState = {
  areaList: [],
  areaTree: [],
  areaMap: {},
  areaListLoading: false,
  basicConfig: {},
  basicConfigLoading: false,
  algoList: [],
  algoListLoading: false,
};


const dataToTree = (data) => {
  // 下面的forEach写法会改变原数组，所以深度拷贝一次
  const copy = JSON.parse(JSON.stringify(data));
  const map = {};
  copy.forEach((item) => {
    // item.defaultName = item.name;
    item.label = item.name;
    item.value = item.id;
    map[item.id] = item;
  });
  const val = [];
  copy.forEach((item) => {
    const parent = map[item.pid];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      val.push(item);
    }
  });
  return val;
};

export default function cameraDetail(state = initialState, action = {}) {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        areaListLoading: true,
        areaTree: [],
      };
    case GET_LIST_SUCCESS:
      return {
        ...state,
        areaList: action.data,
        areaTree: dataToTree(action.data),
        areaListLoading: false,
      };
    case GET_LIST_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    case GET_ALGO_CONFIG_LIST:
      return {
        ...state,
        algoListLoading: true,
        algoList: [],
      };
    case GET_ALGO_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        algoList: action.data,
        algoListLoading: false,
      };
    case GET_ALGO_CONFIG_LIST_FAIL:
      return {
        ...state,
        algoListLoading: false,
        algoList: [],
        error: action.error
      };
    case GET_BASIC:
      return {
        ...state,
        basicConfig: {},
        basicConfigLoading: true,
      };
    case GET_BASIC_SUCCESS:
      return {
        ...state,
        basicConfig: action.data,
        basicConfigLoading: false,
      };
    case GET_BASIC_FAIL:
      return {
        ...state,
        basicConfigLoading: false,
        basicConfig: {},
        error: action.error
      };
    case PUT_DATA_SUCCESS:
      message.success('修改成功');
      return {
        ...state
      };
    case DO_NOTHING:
      return {
        ...state
      };
    default:
      return state;
  }
}

export function getAreaList(pid) {
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/area/list/${pid}`)
  };
}

export function putBasicConfig(data) {
  return {
    type: PUT_DATA_SUCCESS,
    promise: apiClient => apiClient.put(`${urlPrefix}/device/`, {
      data
    })
  };
}

export function getBasicConfig(id) {
  return {
    type: [GET_BASIC, GET_BASIC_SUCCESS, GET_BASIC_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/device/query/${id}`)
  };
}

export function getAlgoList(id) {
  return {
    type: [GET_ALGO_CONFIG_LIST, GET_ALGO_CONFIG_LIST_SUCCESS, GET_ALGO_CONFIG_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/task/list/${id}`)
  };
}

export function getAlgoAreaImage(id) {
  return {
    type: DO_NOTHING,
    promise: apiClient => apiClient.get(`${urlPrefix}/device/snapshot/${id}`)
  };
}
