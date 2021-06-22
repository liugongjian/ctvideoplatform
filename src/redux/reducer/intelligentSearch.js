import React from 'react';
import { urlPrefix } from 'Constants/Dictionary';
import { message } from 'antd';

const lixueping = '/lixueping';

const GET_LIST = 'INTELLIGENT/GET_LIST';
const GET_LIST_SUCCESS = 'INTELLIGENT/GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'INTELLIGENT/GET_LIST_FAIL';


const SAVE_IMAGES = 'INTELLIGENT/SAVE_IMAGES';
const ADD_IMAGES = 'INTELLIGENT/ADD_IMAGES';
const DEL_IMAGES = 'INTELLIGENT/DEL_IMAGES';
const DO_NOTHING = '/DO_NOTHING';

const initialState = {
  images: [],
};

export default function alarms(state = initialState, action = {}) {
  switch (action.type) {
    case SAVE_IMAGES: {
      return {
        images: action.data,
      };
    }
    case ADD_IMAGES: {
      return {
        images: [...state.images, action.data],
      };
    }
    case DEL_IMAGES: {
      // 删除特定id的image
      const id = action.data;
      return {
        images: state.images.fiter(item => item.id !== id),
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
  return {
    type: SAVE_IMAGES,
    data,
  };
}
export function addImage(data) {
  return {
    type: ADD_IMAGES,
    data,
  };
}
export function delImage(id) {
  return {
    type: DEL_IMAGES,
    data: id,
  };
}
