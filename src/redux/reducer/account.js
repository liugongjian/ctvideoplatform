import { urlPrefix } from 'Constants/Dictionary';

const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';
const ROLE_LIST = 'ROLE_LIST';
const ROLE_LIST_SUCCESS = 'ROLE_LIST_SUCCESS';
const ROLE_LIST_FAIL = 'ROLE_LIST_FAIL';
const LOAD_SUCCESS = 'LOAD_SUCCESS';

const initialState = {
  account: [],
  accountLoading: false,
  role: [],
  roleLoading: false,
};
export default function account(state = initialState, action = {}) {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        accountLoading: true
      };
    case GET_LIST_SUCCESS:
      return {
        ...state,
        accountLoading: false,
        account: action.data,
      };
    case GET_LIST_FAIL:
      return {
        ...state,
        accountLoading: false,
      };
    case ROLE_LIST:
      return {
        ...state,
        roleLoading: true
      };
    case ROLE_LIST_SUCCESS:
      return {
        ...state,
        roleLoading: false,
        role: action.data,
      };
    case ROLE_LIST_FAIL:
      return {
        ...state,
        roleLoading: false,
      };
    case LOAD_SUCCESS:
      return {
        ...state
      };
    default:
      return state;
  }
}

export function getAccountList(data) {
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/user/list/`,
      {
        data
      })
  };
}

export function getRoleList(params) {
  return {
    type: [ROLE_LIST, ROLE_LIST_SUCCESS, ROLE_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/role/list/`,
      {
        params
      })
  };
}

export function addAccount(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/user/add/`,
      {
        data
      })
  };
}

export function updateUser(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/user/update/`,
      {
        data
      })
  };
}


export function delAccount(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.del(`${urlPrefix}/user/remove/`,
      {
        data
      })
  };
}

export function stopAccount(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/user/activeusers/`,
      {
        data
      })
  };
}

export function updatePassword(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/user/renewpassword/`,
      {
        data
      })
  };
}
