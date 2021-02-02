/* eslint-disable camelcase */
import superagent from 'superagent';
// import config from '../config';
import { message } from 'antd';
import { notification } from 'antd';
import { ifLogin, ssoLogin } from 'Common/user';
import { buildObj } from 'Utils/paramsOperate';

// const superagent = {};
const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  // const adjustedPath = path[0] === '/' ? path.replace('/', '') : path;
  // // if (__SERVER__) {
  // //   // Prepend host and port of the API server to the path.
  // //   const getPort = port => (`:${port}` || '');
  // //   return `http://${config.apiHost}${getPort(config.apiPort)}${adjustedPath}`;
  // // }
  // // Prepend `/api` to relative URL, to proxy to API server.
  // return `${adjustedPath}`;
  return path;
}

// function getcookie(name) { // for django csrf protection
//   let cookieValue = null;
//   if (document.cookie && document.cookie !== '') {
//     const cookies = document.cookie.split(';');
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim();
//       if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }

class ApiClient {
  constructor() {
    methods.forEach(
      (method) => {
        this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
          const { search } = window.location;
          // const myParam = buildObj(search);
          // const { token, ticket } = myParam;
          const request = superagent[method](formatUrl(path)).withCredentials();
          // .set({
          //   'X-CSRFToken': getcookie('csrftoken'),
          //   'Redirect-Url': window.location.href,
          //   token: token || '',
          //   ticket: ticket || ''
          // });
          if (params) {
            request.query(params);
          }

          if (data) {
            request.send(data);
          }
          request
            .then((res) => {
              if (res.status === 401) {
                ifLogin();
                return;
              }
              if (res.status >= 200 && res.status < 300) {
                if (res.body.code === 302) {
                  const { sso_login_url, params } = res.body.data;
                  message.info('正在跳转到登陆页面...');
                  ssoLogin(sso_login_url, params);
                  return;
                }
                if (res.body.code === 0) {
                  return resolve(res.body);
                }
                // notification.error({
                //   message: res.body.message || res.statusText,
                //   // description: '您暂无权限访问本页面',
                // });
                throw new Error(res.body.msg || res.statusText);
              }

              throw new Error(res.statusText);
            })
            .catch((err) => {
              if (err.status === 401) {
                ifLogin();
                return;
              }
              if (err.status === 403) {
                notification.error({
                  message: err.message || '',
                  description: '您暂无权限访问本页面',
                });
              }
              message.error(err.message);
              // notification.config({
              //   top: 60,
              // });
              // notification.open({
              //   message: err.message || '',
              // });
              // throw new Error('test');
              return reject(err);
            });

          // request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)));
          // request.end((err, { body } = {}) => {
          //   if (err || body.success === 1) {
          //     notification.config({
          //       top: 60,
          //     });
          //     notification.open({
          //       message: err ? err.message : body.message,
          //     });
          //     return reject(body || err);
          //   }
          //   return resolve(body);
          // });
        });
      }
    );
  }

  /*
     * There's a V8 bug where, when using Babel, exporting classes with only
     * constructors sometimes fails. Until it's patched, this is a solution to
     * "ApiClient is not defined" from issue #14.
     * https://github.com/erikras/react-redux-universal-hot-example/issues/14
     *
     * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
     *
     * Remove it at your own risk.
     */
//   empty() { }
}

const apiClient = new ApiClient();
export default apiClient;
