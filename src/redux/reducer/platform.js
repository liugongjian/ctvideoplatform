import { urlPrefix } from 'Constants/Dictionary';

const GET_TENANTS_LIST = 'GET_TENANTS_LIST';
const GET_TENANTS_LIST_SUCCESS = 'GET_TENANTS_LIST_SUCCESS';
const GET_TENANTS_LIST_FAIL = 'GET_TENANTS_LIST_FAIL';
const GET_STATIS = 'GET_STATIS';

const ACTIVATE_TENANTS = 'ACTIVATE_TENANTS';
const GET_LICENCE_LIST = 'GET_LICENCE_LIST';
const GET_TENANT_DETAIL = 'GET_TENANT_DETAIL';

const initialState = {
};
export default function account(state = initialState, action = {}) {
  switch (action.type) {
    case GET_TENANTS_LIST:
      return {
        ...state
      };
    case GET_TENANTS_LIST_SUCCESS:
      return {
        ...state
      };
    case GET_TENANTS_LIST_FAIL:
      return {
        ...state
      };
    case GET_STATIS:
      return {
        ...state
      };
    case ACTIVATE_TENANTS:
      return {
        ...state
      };
    case GET_LICENCE_LIST:
      return {
        ...state
      };
    default:
      return state;
  }
}

export function getTenantsList(data) {
  return {
    type: [GET_TENANTS_LIST, GET_TENANTS_LIST_SUCCESS, GET_TENANTS_LIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/admin/querytenant`,
      {
        data
      })
  };
}
export function getStatis() {
  return {
    type: GET_STATIS,
    promise: apiClient => apiClient.get(`${urlPrefix}/admin/querystatis`)
  };
}
export function activeTenants(data) {
  return {
    type: ACTIVATE_TENANTS,
    promise: apiClient => apiClient.post(`${urlPrefix}/admin/activetenants`,
      {
        data
      })
  };
}
export function getTenantDetail(tid) {
  return {
    type: GET_TENANT_DETAIL,
    promise: apiClient => apiClient.get(`${urlPrefix}/tenant/${tid}`)
  };
}
export function getLicenceList() {
  return {
    type: GET_LICENCE_LIST,
    promise: apiClient => apiClient.get(`${urlPrefix}/license/get`)
  };
}
