import apiClient from 'Common/ApiClient';
import { urlPrefix } from 'Constants/Dictionary';
import { devApi } from 'Constants/Dictionary';
import { func } from 'prop-types';

const PLATE_LIST = 'PLATE_LIST';
const PLATE_LIST_SUCCESS = 'PLATE_LIST_SUCCESS';
const PLATE_LIST_FAIL = 'ROLE_LIST_FAIL'


const initialState = {
};


export default function role(state = initialState, action = {}) {
  switch (action.type) {
    case PLATE_LIST:
      return {
        ...state,
      };
    case PLATE_LIST_SUCCESS:
     return {
       ...state, 
      };
    case PLATE_LIST_FAIL:
      return{
        ...state,
        error:action.error
      };
    default:
      return {
        ...state
      };
  }
}

export function getPlateList(params) {
  
  return {
    type: [PLATE_LIST,PLATE_LIST_SUCCESS,PLATE_LIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/license/list`,
      {
        data: params
      })
  };
}