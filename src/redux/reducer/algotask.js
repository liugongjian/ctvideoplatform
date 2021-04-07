import { urlPrefix } from 'Constants/Dictionary';

const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';


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
