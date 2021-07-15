import React from 'react';
import { urlPrefix, captureLibraryUrl } from 'Constants/Dictionary';
import { message } from 'antd';
import { store } from '../store';

const lixueping = '/lixueping';

const GET_LIST = 'INTELLIGENT/GET_LIST';
const GET_LIST_SUCCESS = 'INTELLIGENT/GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'INTELLIGENT/GET_LIST_FAIL';


const SAVE_FACE_IMAGES = 'INTELLIGENT/SAVE_FACE_IMAGES';
const ADD_FACE_IMAGE = 'INTELLIGENT/ADD_FACE_IMAGE';
const DEL_FACE_IMAGE = 'INTELLIGENT/DEL_FACE_IMAGE';
const UPDATE_FACE_IMAGE = 'INTELLIGENT/UPDATE_FACE_IMAGE';
const ADD_PLATE_IMAGE = 'INTELLIGENT/ADD_PLATE_IMAGE';
const DEL_PLATE_IMAGE = 'INTELLIGENT/DEL_PLATE_IMAGE';
const UPDATE_PLATE_IMAGE = 'INTELLIGENT/UPDATE_PLATE_IMAGE';

const DO_NOTHING = '/DO_NOTHING';

const initialState = {
  faceImages: [],
  nextImageId: 0,
  plateImages: [],
  nextPlateImageId: 0,
};

export default function alarms(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SAVE_FACE_IMAGES: {
      return {
        ...state,
        faceImages: payload,
      };
    }
    case ADD_FACE_IMAGE: {
      return {
        ...state,
        faceImages: [...state.faceImages, { ...payload, id: state.nextImageId }],
        nextImageId: ++state.nextImageId,
      };
    }
    case DEL_FACE_IMAGE: {
      // 删除特定id的image
      const id = payload;
      return {
        ...state,
        faceImages: state.faceImages.filter(item => item.id !== id),
      };
    }
    case UPDATE_FACE_IMAGE: {
      // 更新特定id的image
      const faceImages = state.faceImages.map(item => (item.id === payload.id ? payload : item));
      return {
        ...state,
        faceImages,
      };
    }
    case ADD_PLATE_IMAGE: {
      return {
        ...state,
        plateImages: [...state.plateImages, { ...payload, id: state.nextPlateImageId }],
        nextPlateImageId: ++state.nextPlateImageId,
      };
    }
    case DEL_PLATE_IMAGE: {
      // 删除特定id的image
      const id = payload;
      return {
        ...state,
        plateImages: state.plateImages.filter(item => item.id !== id),
      };
    }
    case UPDATE_PLATE_IMAGE: {
      // 更新特定id的image
      const plateImages = state.plateImages.map(item => (item.id === payload.id ? payload : item));
      return {
        ...state,
        plateImages,
      };
    }
    case DO_NOTHING:
      return {
        ...state
      };
    default:
      return state;
  }
}


// export function getMarkers() {
//   return {
//     type: DO_NOTHING,
//     promise: apiClient => apiClient.get(`${urlPrefix}/smartsearch/face/周帅通`)
//   };
// }

export function searchPlate(formData) {
  return {
    type: DO_NOTHING,
    promise: apiClient => apiClient.post(`${urlPrefix}/detect/plate`, { data: formData })
  };
}

export function searchPlateAlarms(data) {
  return {
    type: DO_NOTHING,
    promise: apiClient => apiClient.post(`${urlPrefix}/detect/plate/result`, { data })
  };
}

export function searchFace(formData) {
  return {
    type: DO_NOTHING,
    promise: apiClient => apiClient.post(`${urlPrefix}/detect/face`, { data: formData })
  };
}

export function searchFaceFromCapture(formData) {
  return {
    type: DO_NOTHING,
    promise: apiClient => apiClient.post(`${captureLibraryUrl}/facecapture/list`, { data: formData })
  };
}

export function saveImages(data, type) {
  store.dispatch({
    type: SAVE_FACE_IMAGES,
    payload: data,
  });
}
export function addImage(data, type) {
  store.dispatch({
    type: type === 'plate' ? ADD_PLATE_IMAGE : ADD_FACE_IMAGE,
    payload: data,
  });
}
export function delImage(id, type) {
  store.dispatch({
    type: type === 'plate' ? DEL_PLATE_IMAGE : DEL_FACE_IMAGE,
    payload: id,
  });
}

export function updateImage(data, type) {
  store.dispatch({
    type: type === 'plate' ? UPDATE_PLATE_IMAGE : UPDATE_FACE_IMAGE,
    payload: data,
  });
}
