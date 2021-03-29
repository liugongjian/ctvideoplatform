import { urlPrefix } from 'Constants/Dictionary';

const LOAD_ALARM_DISTRIBUTE = 'DASHBOARD/LOAD_ALARM_DISTRIBUTE';
const LOAD_ALARM_DISTRIBUTE_SUCCESS = 'DASHBOARD/LOAD_ALARM_DISTRIBUTE_SUCCESS';
const LOAD_ALARM_DISTRIBUTE_FAIL = 'DASHBOARD/LOAD_ALARM_DISTRIBUTE_FAIL';

const DO_NOTHING = 'DASHBOARD/DO_NOTHING';

const initialState = {
  alarmDistribute: {},
  alarmDistributeLoading: true,
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
