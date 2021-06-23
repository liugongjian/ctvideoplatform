import React from 'react';
import { urlPrefix } from 'Constants/Dictionary';
import { message } from 'antd';
import { store } from '../store';

const lixueping = '/lixueping';

const GET_LIST = 'INTELLIGENT/GET_LIST';
const GET_LIST_SUCCESS = 'INTELLIGENT/GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'INTELLIGENT/GET_LIST_FAIL';


const SAVE_IMAGES = 'INTELLIGENT/SAVE_IMAGES';
const ADD_IMAGE = 'INTELLIGENT/ADD_IMAGE';
const DEL_IMAGE = 'INTELLIGENT/DEL_IMAGE';
const UPDATE_IMAGE = 'INTELLIGENT/UPDATE_IMAGE';
const DO_NOTHING = '/DO_NOTHING';

const initialState = {
  images: [],
  nextImageId: 0,
};

export default function alarms(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SAVE_IMAGES: {
      return {
        ...state,
        images: payload,
      };
    }
    case ADD_IMAGE: {
      return {
        ...state,
        images: [...state.images, { ...payload, id: state.nextImageId }],
        nextImageId: ++state.nextImageId,
      };
    }
    case DEL_IMAGE: {
      // 删除特定id的image
      const id = payload;
      return {
        ...state,
        images: state.images.filter(item => item.id !== id),
      };
    }
    case UPDATE_IMAGE: {
      // 更新特定id的image
      const images = state.images.map(item => (item.id === payload.id ? payload : item));
      return {
        ...state,
        images,
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

export function searchFace(formData) {
  return {
    type: DO_NOTHING,
    promise: apiClient => apiClient.post(`${urlPrefix}/detect/face`, { data: formData })
  };
}

export function saveImages(data) {
  store.dispatch({
    type: SAVE_IMAGES,
    payload: data,
  });
}
export function addImage(data) {
  store.dispatch({
    type: ADD_IMAGE,
    payload: data,
  });
}
export function delImage(id) {
  store.dispatch({
    type: DEL_IMAGE,
    payload: id,
  });
}

export function updateImage(data) {
  store.dispatch({
    type: UPDATE_IMAGE,
    payload: data,
  });
}
