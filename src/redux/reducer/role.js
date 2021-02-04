import apiClient from 'Common/ApiClient';
import { urlPrefix } from 'Constants/Dictionary';
import { devApi } from 'Constants/Dictionary';
import { func } from 'prop-types';

const ROLE_LIST = 'ROLE_LIST';
const ROLE_LIST_SUCCESS = 'ROLE_LIST_SUCCESS';
const ROLE_LIST_FAIL = 'ROLE_LIST_FAIL'
const ROLE_DELETE = 'ROLE_DELETE';
const ROLE_ADD = 'ROLE_ADD';


const GET_AREA_LIST = 'GET_AREA_LIST';
const GET_AREA_LIST_SUCCESS = 'GET_AREA_LIST_SUCCESS';
const GET_AREA_LIST_FAIL = 'GET_AREA_LIST_FAIL';

const GET_MENU_LIST = 'GET_MENU_LIST';
const GET_MENU_LIST_SUCCESS = 'GET_MENU_LIST_SUCCESS';
const GET_MENU_LIST_FAIL = 'GET_MENU_LIST_FAIL';

// const roleList = [];
// for (let i = 0; i < 10; i++) {
//     roleList.push({
//         key: i,
//         name: `Edward King ${i}`,
//         age: 32,
//         address: `London, Park Lane no. ${i}`,
//         comment: 'todo'
//     });
// }

const initialState = {
  areaList: [],
  areaListLoading: false,
  menuListLoading: false,
};


export default function role(state = initialState, action = {}) {
  switch (action.type) {
    case ROLE_LIST:
      return {
        ...state,
      };
    case ROLE_LIST_SUCCESS:
     return {
       ...state, 
      };
    case ROLE_LIST_FAIL:
      return{
        ...state,
        error:action.error
      };
    case ROLE_DELETE:
      return{
        ...state,
      };


    case GET_AREA_LIST:
      return {
        ...state,
        areaListLoading: true
      };
    case GET_AREA_LIST_SUCCESS:
      return {
        ...state,
        areaList: action.data,
        areaListLoading: false,
      };
    case GET_AREA_LIST_FAIL:
      return {
        ...state,
        areaListLoading: false,
        error: action.error
      };

    case GET_MENU_LIST:
      return {
        ...state,
        menuListLoading: true
      };
    case GET_MENU_LIST_SUCCESS:
      return {
        ...state,
        menuListLoading: false,
      };
    case GET_MENU_LIST_FAIL:
      return {
        ...state,
        menuListLoading: false,
        error: action.error
      };

    default:
      return {
        ...state
      };
  }
}

export function getRoleList(params) {
  
  return {
    type: [ROLE_LIST,ROLE_LIST_SUCCESS,ROLE_LIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/role/list`,
      {
        data: params
      })
  };
}

export function deleteRoles(params) {
  return {
    type: ROLE_DELETE,
    promise: apiClient => apiClient.del(`${urlPrefix}/role/remove`,
      {
        data: params
      })
  };
}


export function getAreaList(pid, keyword) {
  if (keyword) {
    return {
      type: [GET_AREA_LIST, GET_AREA_LIST_SUCCESS, GET_AREA_LIST_FAIL],
      promise: apiClient => apiClient.get(`${urlPrefix}/area/list/${pid}/?keyword=${keyword}`)
    };
  }
  return {
    type: [GET_AREA_LIST, GET_AREA_LIST_SUCCESS, GET_AREA_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/area/list/${pid}/`)
  };
}

export function getMenuList() {
  return {
    type: [GET_MENU_LIST, GET_MENU_LIST_SUCCESS, GET_MENU_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/menu/list/`)
  };
}

export function addRole(params) {
  return {
    type: ROLE_ADD,
    promise: apiClient => apiClient.post(`${urlPrefix}/role/add`,
      {
        data: params
      })
  };
}