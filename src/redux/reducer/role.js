import apiClient from 'Common/ApiClient';
import { urlPrefix } from 'Constants/Dictionary';
import { devApi } from 'Constants/Dictionary';

const ROLE_LIST = 'ROLE_LIST';
const ROLE_LIST_SUCCESS = 'ROLE_LIST_SUCCESS';
const ROLE_LIST_FAIL = 'ROLE_LIST_FAIL'
const ROLE_DELETE = 'ROLE_DELETE';


// const roleList = [];
// for (let i = 0; i < 10; i++) {
//     roleList.push({
//         key: i,
//         name: `Edward King ${i}`,
//         age: 32,
//         address: `London, Park Lane no. ${i}`,
//         comment: 'todo'
//     });
// }

const initialState = {
};


export default function role(state = initialState, action = {}) {
  switch (action.type) {
    case ROLE_LIST:
      return {
        ...state,
      };
    case ROLE_LIST_SUCCESS:
     return {
       ...state, 
      };
    case ROLE_LIST_FAIL:
      return{
        ...state,
        error:action.error
      }
    default:
      return {
        ...state
      };
  }
}

export function getRoleList(params) {
  console.log("params->",params)
  return {
    type: [ROLE_LIST,ROLE_LIST_SUCCESS,ROLE_LIST_FAIL],
    promise: apiClient => apiClient.post(`${urlPrefix}/role/list`,
      {
        data: params
      })
  };
}

export function deleteRoles(params) {
  // return {
  //   type: ROLE_Delete,
  //   promise: apiClient => apiClient.post(`${urlPrefix}/api/v1/login/`,
  //     {
  //       data: params
  //       // params
  //     })
  // };
  
  return {
    type : ROLE_DELETE,
    data : params
  }
}
