import { urlPrefix } from 'Constants/Dictionary';

const LOAD_ALARM_DISTRIBUTE = 'DASHBOARD/LOAD_ALARM_DISTRIBUTE';
const LOAD_ALARM_DISTRIBUTE_SUCCESS = 'DASHBOARD/LOAD_ALARM_DISTRIBUTE_SUCCESS';
const LOAD_ALARM_DISTRIBUTE_FAIL = 'DASHBOARD/LOAD_ALARM_DISTRIBUTE_FAIL';

const LOAD_ALGO_CONFIGS = 'DASHBOARD/LOAD_ALGO_CONFIGS';
const LOAD_ALGO_CONFIGS_SUCCESS = 'DASHBOARD/LOAD_ALGO_CONFIGS_SUCCESS';
const LOAD_ALGO_CONFIGS_FAIL = 'DASHBOARD/LOAD_ALGO_CONFIGS_FAIL';

const LOAD_ALARM_TREND = 'DASHBOARD/LOAD_ALARM_TREND';
const LOAD_ALARM_TREND_SUCCESS = 'DASHBOARD/LOAD_ALARM_TREND_SUCCESS';
const LOAD_ALARM_TREND_FAIL = 'DASHBOARD/LOAD_ALARM_TREND_FAIL';

const LOAD_ALGO_ITEMS = 'DASHBOARD/LOAD_ALGO_ITEMS';
const LOAD_ALGO_ITEMS_SUCCESS = 'DASHBOARD/LOAD_ALGO_ITEMS_SUCCESS';
const LOAD_ALGO_ITEMS_FAIL = 'DASHBOARD/LOAD_ALGO_ITEMS_FAIL';

const DO_NOTHING = 'DASHBOARD/DO_NOTHING';

const initialState = {
  alarmDistribute: {},
  alarmDistributeLoading: true,
  algoConfsLoading: true,
  algoConfs: {},
  alarmTrendLoading: true,
  alarmTrend: {},
  algoItemsLoading: true,
  algoItems: [],
};

export default function dashboard(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_ALARM_DISTRIBUTE:
      return {
        ...state,
        alarmDistributeLoading: true
      };
    case LOAD_ALARM_DISTRIBUTE_SUCCESS:
      return {
        ...state,
        alarmDistributeLoading: false,
        alarmDistribute: action.data,
      };
    case LOAD_ALARM_DISTRIBUTE_FAIL:
      return {
        ...state,
        alarmDistributeLoading: false,
      };

    case LOAD_ALGO_CONFIGS:
      return {
        ...state,
        algoConfsLoading: true
      };
    case LOAD_ALGO_CONFIGS_SUCCESS:
      return {
        ...state,
        algoConfsLoading: false,
        algoConfs: action.data,
      };
    case LOAD_ALGO_CONFIGS_FAIL:
      return {
        ...state,
        algoConfsLoading: false,
      };
    case LOAD_ALARM_TREND:
      return {
        ...state,
        alarmTrendLoading: true
      };
    case LOAD_ALARM_TREND_SUCCESS:
      return {
        ...state,
        alarmTrendLoading: false,
        alarmTrend: action.data,
      };
    case LOAD_ALARM_TREND_FAIL:
      return {
        ...state,
        alarmTrendLoading: false,
      };

    case LOAD_ALGO_ITEMS:
      return {
        ...state,
        algoItemsLoading: true
      };
    case LOAD_ALGO_ITEMS_SUCCESS:
      return {
        ...state,
        algoItemsLoading: false,
        algoItems: action?.data?.homeAlgorithmConfig,
      };
    case LOAD_ALGO_ITEMS_FAIL:
      return {
        ...state,
        algoItemsLoading: false,
      };
    case DO_NOTHING:
      return {
        ...state,
      };
    default:
      return state;
  }
}

export function getAlarmDistribute(data) {
  return {
    type: [LOAD_ALARM_DISTRIBUTE, LOAD_ALARM_DISTRIBUTE_SUCCESS, LOAD_ALARM_DISTRIBUTE_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/home/queryalarmdistr`, {
      data
    })
  };
}

export function getAlgoConfs() {
  return {
    type: [LOAD_ALGO_CONFIGS, LOAD_ALGO_CONFIGS_SUCCESS, LOAD_ALGO_CONFIGS_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/home/queryalgorithm`)
  };
}

export function getAlarmTrend(type) {
  return {
    type: [LOAD_ALARM_TREND, LOAD_ALARM_TREND_SUCCESS, LOAD_ALARM_TREND_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/home/queryalarmtrend`, {
      data: {
        type
      }
    })
  };
}

export function getAlgoItems() {
  return {
    type: [LOAD_ALGO_ITEMS, LOAD_ALGO_ITEMS_SUCCESS, LOAD_ALGO_ITEMS_FAIL],
    promise: apiClient => apiClient.get(`${urlPrefix}/home/queryalarmconfig`)
  };
}
