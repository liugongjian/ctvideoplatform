const LOAD = 'DASHBOARD/LOAD';
const LOAD_SUCCESS = 'DASHBOARD/LOAD_SUCCESS';
const LOAD_FAIL = 'DASHBOARD/LOAD_FAIL';

const LOAD_MONITOR = 'DASHBOARD/LOAD_MONITOR';
const LOAD_MONITOR_SUCCESS = 'DASHBOARD/LOAD_MONITOR_SUCCESS';
const LOAD_MONITOR_FAIL = 'DASHBOARD/LOAD_MONITOR_FAIL';

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
    case LOAD_MONITOR:
      return {
        ...state,
        [`monitor${action.id}Loading`]: true,
      };
    case LOAD_MONITOR_SUCCESS:
      return {
        ...state,
        [`monitor${action.id}Loading`]: false,
        [`monitor${action.id}`]: action.data,
      };
    case LOAD_MONITOR_FAIL:
      return {
        ...state,
        [`monitor${action.id}Loading`]: false,
      };
    default:
      return state;
  }
}

export function getSummary() {
  return {
    type: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: apiClient => apiClient.get('/cloud/api/v1/order/analysize/summary')
  };
}

export function getMonitorMetric(params, metric) {
  return {
    type: [LOAD_MONITOR, LOAD_MONITOR_SUCCESS, LOAD_MONITOR_FAIL],
    promise: apiClient => apiClient.get('/cloud/api/v1/order/analysize/monitor/queryMetricGraph', { params }),
    id: metric, // 几个指标共用一个action，通过metirc来区分
  };
}
