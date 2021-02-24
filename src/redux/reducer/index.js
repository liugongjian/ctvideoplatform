import {
  routerReducer,
} from 'react-router-redux';

import user from 'Common/user';
// import dashboard from './dashboard';
import login from './login';
import pageHeader from './pageHeader';
import monitor from './monitor';
import account from './account';
import role from './role';
import cameraDetail from './cameraDetail';
import alarms from './alarms';
import preview from './preview';

export default {
  routing: routerReducer, // 其中之一reducer   用来管理路由
  user,
  // dashboard,
  pageHeader,
  login,
  monitor,
  account,
  role,
  cameraDetail,
  alarms,
  preview
};
