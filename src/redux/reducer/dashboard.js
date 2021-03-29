const LOAD = 'DASHBOARD/LOAD';
const LOAD_SUCCESS = 'DASHBOARD/LOAD_SUCCESS';
const LOAD_FAIL = 'DASHBOARD/LOAD_FAIL';

const initialState = {
  summary: [],
  summaryLoading: true,
  monitorApply: [],
  monitorApplyLoading: true,
  monitorResource: [],
  monitorResourceLoading: true
};

export default function dashboard(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        summaryLoading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        summaryLoading: false,
        summary: action.data,
      };
    case LOAD_FAIL:
      return {
        ...state,
        summaryLoading: false,
      };
    default:
      return state;
  }
}

// export function getSummary() {
//   return {
//     type: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
//     promise: apiClient => apiClient.get('/cloud/api/v1/order/analysize/summary')
//   };
// }
