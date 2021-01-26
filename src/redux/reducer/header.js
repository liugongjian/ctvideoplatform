const LOAD = 'CLIENT_HEAD/LOAD';
const LOAD_SUCCESS = 'CLIENT_HEAD/LOAD_SUCCESS';
const LOAD_FAIL = 'CLIENT_HEAD/LOAD_FAIL';

const initialState = {
  user: {},
  loading: true,
};

export default function header(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.data,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function getUserInfo(params) {
  return {
    type: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: apiClient => apiClient.get('', { params }),
  };
}
