import React from 'react';
import { urlPrefix } from 'Constants/Dictionary';
import { message } from 'antd';

const lixueping = '/lixueping';

const GET_LIST = 'ALARMS/GET_LIST';
const GET_LIST_SUCCESS = 'ALARMS/GET_LIST_SUCCESS';
const GET_LIST_FAIL = 'ALARMS/GET_LIST_FAIL';

const DO_NOTHING = '/DO_NOTHING';

const initialState = {
};

export default function alarms(state = initialState, action = {}) {
  switch (action.type) {
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
