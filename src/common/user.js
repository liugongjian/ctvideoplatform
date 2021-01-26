/* eslint-disable camelcase */
import { urlPrefix } from 'Constants/Dictionary';
import { buildObj } from 'Utils/paramsOperate';
import { message, notification } from 'antd';
import superagent from 'superagent';
import apiClient from './ApiClient';

const LOAD_USER_INFO = 'LOAD_USER_INFO';

const initialState = {
  userInfo: {
  },
};


export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_USER_INFO:
      return { ...state, userInfo: action.data, loading: false };
    default:
      return state;
  }
}


export function updateUserInfo(data) {
  return {
    type: LOAD_USER_INFO,
    data
  };
}

export function ssoLogin(url, params) {
  // if (__DEVELOPMENT__) {
  //   // mPrefix = 'mock';
  // }
  window.location.href = `${url}?${params}`; // redirect_url=${encodeURIComponent(window.location.href)}&clientId=${clientId}
}


const getcookie = (name) => { // for django csrf protection
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};


const methods = ['post'];

function formatUrl(path) {
  return path;
}


// 为了权限问题，登录方法单独拎出来，不使用apiClient

class GetIflogin {
  constructor() {
    methods.forEach(
      (method) => {
        this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
          const { search } = window.location;
          const myParam = buildObj(search);
          const { token, ticket } = myParam;
          const request = superagent[method](formatUrl(path)).withCredentials().set({
            'X-CSRFToken': getcookie('csrftoken'),
            'Redirect-Url': window.location.href,
            token: token || '',
            ticket: ticket || ''
          });
          if (params) {
            request.query(params);
          }

          if (data) {
            request.send(data);
          }
          request
            .then((res) => {
              if (res.status >= 200 && res.status < 300) {
                if (res.body.code === 302) {
                  const { sso_login_url, params } = res.body.data;
                  message.info('正在跳转到登陆页面...');
                  ssoLogin(sso_login_url, params);
                  return;
                }
                if (res.body.success === 0) {
                  return resolve(res.body);
                }
                throw new Error(res.body.message || res.statusText);
              }

              throw new Error(res.statusText);
            })
            .catch((err) => {
              if (err.status === 403) {
                // window.location.href = `${window.origin}/noauth`;
              }
              return reject(err);
            });
        });
      }
    );
  }
}

const getIflogin = new GetIflogin();
// export default apiClient;


export async function ifLogin() {
  const mPrefix = urlPrefix;
  if (__DEVELOPMENT__) {
    // mPrefix = 'mock';
  }
  const url = `${mPrefix}/api/v1/iflogin/`;

  return getIflogin.post(url).then((data) => {
    if (data.success === 0 && data.data.status) {
      const { search, href } = window.location;
      if (search.indexOf('ticket') > -1) {
        const purePath = href.split('?');
        // eslint-disable-next-line prefer-destructuring
        window.location.href = purePath[0];
      }
      if (search.indexOf('token') >= 0) {
        const purePath = href.split('?');
        // eslint-disable-next-line prefer-destructuring
        window.location.href = purePath[0];
      }
      return data.data;
    }
  }).catch((err) => {
    if (err.status === 403) {
      window.location.href = `${window.origin}/temperature/noauth`;
    }
  });
}
