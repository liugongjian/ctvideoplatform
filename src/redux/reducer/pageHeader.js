import apiClient from '@/Common/ApiClient';
import { urlPrefix } from 'Constants/Dictionary';

const GET_MENU_LIST = 'CLIENT_HEAD/GET_MENU_LIST';
const GET_MENU_LIST_SUCCESS = 'CLIENT_HEAD/GET_MENU_LIST_SUCCESS';
const GET_MENU_LIST_FAIL = 'CLIENT_HEAD/GET_MENU_LIST_FAIL';

const defaultState = {
  pageHeaderRoute: [{
    path: '/',
    title: '控制台',
  }],
  menuList: [],
  menuLoading: false,
};

const headerReducer = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_MENU_LIST:
      return {
        ...state,
        menuLoading: true
      };
    case GET_MENU_LIST_SUCCESS:
      return {
        ...state,
        menuLoading: false,
        menuList: action.data,
      };
    case GET_MENU_LIST_FAIL:
      return {
        ...state,
        menuLoading: false,
        error: action.error
      };
    case 'SET_PAGE_HEADER': {
      return {
        ...state,
        pageHeaderRoute: payload, // [ getCurHeader(state, payload) ],
      };
    }
    case 'PUSH_PAGE_HEADER': {
      return {
        ...state,
        pageHeaderRoute: [
          ...state.pageHeaderRoute,
          payload // getCurHeader(state, payload)
        ]
      };
    }
    default: {
      return state;
    }
  }
};

export function setPageHeader(data) {
  return {
    type: 'SET_PAGE_HEADER',
    payload: data,
  };
}

export function pushPageHeader(data) {
  return {
    type: 'PUSH_PAGE_HEADER',
    payload: data,
  };
}

export function getMenuList() {
  return {
    type: [GET_MENU_LIST, GET_MENU_LIST_SUCCESS, GET_MENU_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/menu/list`)
  };
}
export default headerReducer;
