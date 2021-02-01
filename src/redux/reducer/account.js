const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';

const initialState = {
    account: [],
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
    debugger
    return {
      type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
      promise: apiClient => apiClient.get('http://rap2api.taobao.org/app/mock/247444/videoplatform/account', { params }),
    };
}
