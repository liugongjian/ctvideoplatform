import apiClient from 'Common/ApiClient';
import { urlPrefix } from 'Constants/Dictionary';
import { devApi } from 'Constants/Dictionary';

const LOGIN_DATA = 'LOGIN_DATA';
const LOGIN_DATA_SUCCESS = 'LOGIN_DATA_SUCCESS';
const LOGIN_DATA_FAIL = 'LOGIN_DATA_FAIL';

const LOGOUT = 'LOGOUT';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'LOGOUT_FAIL';


const initialState = {
  loginInfo: {},
  logout: {}
};


export default function login(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_DATA:
      return {
        ...state,
        deptLoading: true
      };
    case LOGIN_DATA_SUCCESS:
      return {
        ...state,
        loginInfo: action.data
      };
    case LOGIN_DATA_FAIL:
      return {
        ...state,
        error: action.error
      };
    case LOGOUT:
      return {
        ...state
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        logout: action.data
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        error: action.error
      };
    default:
      return {
        ...state
      };
  }
}

export function userlogin(params) {
  return {
    type: [LOGIN_DATA, LOGIN_DATA_SUCCESS, LOGIN_DATA_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/login`,
      {
        data: params
        // params
      })
  };
}

export function userlogout() {
  return {
    type: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/logout`)
  };
}
