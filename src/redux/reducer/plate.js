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

const IMPORTED_PLATE = 'IMPORTED_PLATE';

const TEMPLATE_PLATE = 'TEMPLATE_PLATE';

const DUPLICATED_PLATE = 'DUPLICATED_PLATE';
const SUBMIT_PLATE = 'SUBMIT_PLATE';
const EXIST_PLATE = 'EXIST_PLATE';

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
    
    case IMPORTED_PLATE:
      return {
        ...state,
    };  
    
    case TEMPLATE_PLATE:
      return {
        ...state,
    };  
    case DUPLICATED_PLATE:
      return {
        ...state,
    };  
    case SUBMIT_PLATE:
      return {
        ...state,
    };  
    
    case EXIST_PLATE:
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


export function getImportedPlate(params) {
  return {
    type: IMPORTED_PLATE,
    promise: apiClient => apiClient.post(`${urlPrefix}/license/imported`,
    {
      data: params
    })
  };
}

export function getDuplicatedPlate(params) {
  return {
    type: DUPLICATED_PLATE,
    promise: apiClient => apiClient.get(`${urlPrefix}/license/duplicated`,
    {
      data: params
    })
  };
}

export function submitImportedPlate(params) {
  return {
    type: SUBMIT_PLATE,
    promise: apiClient => apiClient.post(`${urlPrefix}/license/submit`,
    {
      data: params
    })
  };
}

export function licenseExist(license) {
  return {
    type: EXIST_PLATE,
    promise: apiClient => apiClient.get(`${urlPrefix}/license/exist?license=${license}`)
  };
}