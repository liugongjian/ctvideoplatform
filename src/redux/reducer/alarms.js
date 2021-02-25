import React from 'react';
import { urlPrefix } from 'Constants/Dictionary';
import { message } from 'antd';

const lixueping = '/lixueping';

const GET_LIST = 'ALARMS/GET_LIST';
const GET_LIST_SUCCESS = 'ALARMS/GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'ALARMS/GET_LIST_FAIL';
const PUT_DATA_SUCCESS = 'ALARMS/PUT_DATA_SUCCESS';


const DO_NOTHING = 'ALARMS/DO_NOTHING';

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

export default function alarms(state = initialState, action = {}) {
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
        areaListLoading: false,
      };
    case GET_LIST_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };
    case PUT_DATA_SUCCESS:
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

export function getAlgoList() {
  return {
    type: DO_NOTHING,
    promise: apiClient => apiClient.get(`${urlPrefix}/algorithm/list`)
  };
}

export function getDeviceTree() {
  return {
    type: DO_NOTHING,
    promise: apiClient => apiClient.post(`${urlPrefix}/device/tree`, {
      data: {
        keyword: '',
        algorithmIds: []
      }
    })
  };
}
