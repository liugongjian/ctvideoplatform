import {
  routerReducer,
} from 'react-router-redux';

import user from 'Common/user';
import dashboard from './dashboard';
import login from './login';
import pageHeader from './pageHeader';
import monitor from './monitor';


export default {
  routing: routerReducer, // 其中之一reducer   用来管理路由
  user,
  dashboard,
  pageHeader,
  login,
  monitor
};
