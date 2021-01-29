/**
 * 路由配置
 * createBy: zd
 * 含参路径 eg：
 * menuRoutes = [{
    path: '/device',
    exact: true,
    component: '',
    menuCode: '02', //层级管理
    menuTitle: '设备管理',
    children: [
      {
        path: '/list',
        pageTitle: '设备列表',
        exact: true,
        component: '',
        subMenuCode: '0201',
        children: [
          {
            path: '/add',
            pageTitle: '添加设备',
            exact: true,
            component: ''
          },
          {
            path: '/detail/:id',
            pageTitle: '设备详情',
            exact: true,
            component: ''
          }
        ]
      },
      {
        path: '/test',
        pageTitle: 'test',
        exact: true,
        component: '',
        subMenuCode: '0202'
      }
    ]
  },]
 * */
import { createRouters } from '../utils/core'; // eslint-disable-line
// import BasicLayout from '~/layout'
import App from 'Container/App';
import Login from 'Views/login';
import Dashboard from 'Views/dashboard';
import Monitor from 'Views/monitor';
import CameraDetail from 'Views/cameraDetail';
import Account from 'Views/system/user';
import { pathPrefix } from 'Constants/Dictionary';

const routesConfig = [
  {
    path: '/login',
    exact: true,
    // indexRoute: '/preview',
    component: Login
  },
  {
    path: '/',
    // exact: true,
    // indexRoute: '/preview',
    component: App
  },

];

const menuRoutes = [
  {
    path: '/',
    pageTitle: '控制台',
    exact: true,
    component: Dashboard,
    menuCode: '01',
    menuTitle: '控制台'
  },
  {
    path: '/monitor',
    pageTitle: '设备管理',
    exact: true,
    component: Monitor,
    menuCode: '02',
    menuTitle: '设备管理'
  },
  {
    path: '/cameraDetail',
    pageTitle: '摄像头详情',
    exact: true,
    component: CameraDetail,
    menuCode: '02',
    menuTitle: '摄像头详情（先放这里后面删）'
  },
  {
    path: '/system',
    pageTitle: '系统管理',
    exact: true,
    menuCode: '02',
    menuTitle: '系统管理',
    children: [
      {
        path: '/role',
        pageTitle: '角色管理',
        exact: true,
        component: Monitor,
        menuCode: '02',
        menuTitle: '角色管理',
      },
      {
        path: '/account',
        pageTitle: '账号管理',
        exact: true,
        component: Account,
        menuCode: '02',
        menuTitle: '账号管理',
      }
    ]
  },
];

const menuRouter = () => createRouters(menuRoutes, true, pathPrefix);

export { menuRouter, menuRoutes };

export default () => createRouters(routesConfig, false, pathPrefix);
