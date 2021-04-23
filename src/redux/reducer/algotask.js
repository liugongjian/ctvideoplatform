import { urlPrefix } from 'Constants/Dictionary';

const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';
const GET_DETAIL = 'GET_DETAIL';
const GET_ALGO_ALL = 'GET_ALGO_ALL';
const DELETE_ALGO_TASKS = 'DELETE_ALGO_TASKS';

const initialState = {
};
export default function account(state = initialState, action = {}) {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state
      };
    case GET_LIST_SUCCESS:
      return {
        ...state
      };
    case GET_LIST_FAIL:
      return {
        ...state
      };
    case GET_DETAIL:
      return {
        ...state
      };
    case GET_ALGO_ALL:
      return {
        ...state
      };
    case DELETE_ALGO_TASKS:
      return {
        ...state
      };
    default:
      return state;
  }
}

export function getAlgoTaskList(data) {
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/operation/tasks/status`,
      {
        data
      })
  };
}

export function getAlgoTaskDetail(data) {
  return {
    type: GET_DETAIL,
    promise: apiClient => apiClient.post(`${urlPrefix}/operation/tasks/detail`,
      {
        data
      })
  };
}

export function getAlgoAll() {
  return {
    type: GET_ALGO_ALL,
    promise: apiClient => apiClient.get(`${urlPrefix}/algorithm/all`)
  };
}

export function terminateAlgoTasks(data) {
  return {
    type: DELETE_ALGO_TASKS,
    promise: apiClient => apiClient.del(`${urlPrefix}/operation/tasks`, {
      data
    })
  };
}
