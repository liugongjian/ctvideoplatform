import apiClient from 'Common/ApiClient';
import { urlPrefix } from 'Constants/Dictionary';
import { devApi } from 'Constants/Dictionary';
import { func } from 'prop-types';

const PLATE_LIST = 'PLATE_LIST';
const PLATE_LIST_SUCCESS = 'PLATE_LIST_SUCCESS';
const PLATE_LIST_FAIL = 'ROLE_LIST_FAIL'

const ADD_PLATE = 'ADD_PLATE';
const DELETE_PLATE = 'DELETE_PLATE';
const UPDATE_PLATE = 'UPDATE_PLATE';


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
    
    case ADD_PLATE:
      return {
        ...state,
      };  
    case DELETE_PLATE:
      return {
        ...state,
      };  
    case UPDATE_PLATE:
    return {
      ...state,
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

export function addPlate(params) {
  
  return {
      type: ADD_PLATE,
      promise: apiClient => apiClient.post(`${urlPrefix}/license/add`,
        {
          data: params
        })
  };
}

export function deletePlates(params) {
  return {
    type: DELETE_PLATE,
    promise: apiClient => apiClient.del(`${urlPrefix}/license`,
      {
        data: params
      })
  };
}

export function updatePlate(params) {
  return {
    type: UPDATE_PLATE,
    promise: apiClient => apiClient.post(`${urlPrefix}/license/update`,
      {
        data: params
      })
  };
}