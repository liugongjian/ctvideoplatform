import { urlPrefix } from 'Constants/Dictionary';

const GET_LIST = 'GET_LIST';
const GET_LIST_SUCCESS = 'GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'GET_LIST_FAIL';
const LOAD_SUCCESS = 'LOAD_SUCCESS';

const initialState = {
  face: [],
  faceLoading: false,
};

export default function face(state = initialState, action = {}) {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        faceLoading: true
      };
    case GET_LIST_SUCCESS:
      return {
        ...state,
        faceLoading: false,
        face: action.data,
      };
    case GET_LIST_FAIL:
      return {
        ...state,
        faceLoading: false,
      };
    case LOAD_SUCCESS:
      return {
        ...state
      };
    default:
      return state;
  }
}

export function getFaceList(data) {
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/face/list/`,
      {
        data
      })
  };
}

export function addFace(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/face/submit/`,
      {
        data
      })
  };
}

export function editFace(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/face/edit/`,
      {
        data
      })
  };
}

export function delFace(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/face/delete/`,
      {
        data
      })
  };
}

export function getImportFaceList(data) {
  return {
    type: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/face/listupload/`,
      {
        data
      })
  };
}

export function submitLabel(data) {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/face/sumitzip/`,
      {
        data
      })
  };
}

export function saveUploadList() {
  return {
    type: LOAD_SUCCESS,
    promise: apiClient => apiClient.post(`${urlPrefix}/face/save/`)
  };
}
