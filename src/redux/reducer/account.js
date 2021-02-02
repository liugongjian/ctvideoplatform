import { urlPrefix } from 'Constants/Dictionary';

const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';

const initialState = {
  account: [],
  accountLoading: false,
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
    default:
      return state;
  }
}

export function getAccountList(params) {
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/user/list/`)
  };
}
