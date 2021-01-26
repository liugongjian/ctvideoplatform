const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';


const initialState = {
  summary: [],
};

export default function dashboard(state = initialState, action = {}) {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        summaryLoading: true
      };
    case GET_LIST_SUCCESS:
      return {
        ...state,
        summaryLoading: false,
        summary: action.data,
      };
    case GET_LIST_FAIL:
      return {
        ...state,
        summaryLoading: false,
      };
    default:
      return state;
  }
}

export function getSummary() {
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.get('/cloud/api/v1/order/analysize/summary')
  };
}
