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
import DefaultPage from 'Views/defaultPage';
import Monitor from 'Views/monitor';
import Preview from 'Views/preview';

import Role from 'Views/role';
import RoleEdit from 'Views/role/roleedit';
import RoleAdd from 'Views/role/roleadd';
import CameraDetail from 'Views/cameraDetail';
import Account from 'Views/system/user';
import AddAccount from 'Views/system/user/addUser';
import Alarms from 'Views/alarms';
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
    path: '/monitor',
    exact: true,
    component: Monitor,
    pageTitle: '设备管理',
    children: [
      {
        // hideMenu: true,
        path: '/:cameraId',
        pageTitle: '摄像头详情',
        exact: true,
        component: CameraDetail,
      }
    ]
  },
  {
    path: '/system',
    exact: true,
    children: [
      {
        path: '/monitorArea',
        pageTitle: '监控区域',
        exact: true,
        component: DefaultPage,
      },
      {
        path: '/role',
        exact: true,
        pageTitle: '角色管理',
        component: Role,
        children: [
          {
            path: '/edit/:roleid',
            pageTitle: '编辑角色',
            component: RoleEdit,
          },
          {
            path: '/add',
            pageTitle: '新建角色',
            component: RoleAdd,
          },
        ]
      },
      {
        path: '/account',
        exact: true,
        pageTitle: '账号管理',
        component: Account,
        children: [
          {
            path: '/add',
            pageTitle: '新建账号',
            component: AddAccount,
          }
        ]
      }
    ]
  },
  // 视频服务
  {
    path: '/videoService',
    exact: true,
    children: [
      {
        path: '/realtime',
        exact: true,
        component: Preview,
      },
      {
        path: '/replay',
        exact: true,
        component: DefaultPage,
      },
    ]
  },
  // 智能分析
  {
    path: '/alarms',
    exact: true,
    pageTitle: '告警信息',
    component: Alarms,
    // children: [
    //   {
    //     path: '/videoAnalyze',
    //     exact: true,
    //     component: DefaultPage,
    //   },
    //   {
    //     path: '/alarm',
    //     pageTitle: '告警信息',
    //     exact: true,
    //     component: DefaultPage,
    //   },
    //   {
    //     path: '/intelligentSearch',
    //     exact: true,
    //     component: DefaultPage,
    //   },
    // ]
  },
  // 图库管理
  {
    path: '/gallery',
    exact: true,
    component: DefaultPage,
    children: [
      {
        path: '/face',
        exact: true,
        component: DefaultPage,
      },
      {
        path: '/carLicense',
        exact: true,
        component: DefaultPage,
      },
    ]
  },
  {
    path: '/',
    exact: true,
    component: DefaultPage,
  }
];

// const menuRoutes = [
//   {
//     path: '/monitor',
//     pageTitle: '设备管理',
//     exact: true,
//     component: Monitor,
//     menuCode: '02',
//     menuTitle: '设备管理',
//     children: [
//       {
//         hideMenu: true,
//         path: '/:cameraId',
//         pageTitle: '摄像头详情',
//         component: CameraDetail,
//       }
//     ]
//   },
//   {
//     path: '/system',
//     pageTitle: '系统管理',
//     exact: true,
//     menuCode: '02',
//     menuTitle: '系统管理',
//     children: [
//       {
//         path: '/role',
//         pageTitle: '角色管理',
//         exact: true,
//         component: Role,
//         menuCode: '02',
//         menuTitle: '角色管理',
//         children: [
//           {
//             path: '/edit/:roleid',
//             pageTitle: '编辑角色',
//             component: RoleEdit,
//           },
//           {
//             path: '/add',
//             pageTitle: '添加角色',
//             component: RoleAdd,
//           },
//         ]
//       },
//       {
//         path: '/account',
//         pageTitle: '账号管理',
//         exact: true,
//         component: Account,
//         menuCode: '02',
//         menuTitle: '账号管理',
//         children: [
//           {
//             path: '/add',
//             pageTitle: '添加账号',
//             component: AddAccount,
//           }
//         ]
//       }
//     ]
//   },
// ];

const menuRouter = () => createRouters(menuRoutes, true, pathPrefix);

export { menuRouter, menuRoutes };

export default () => createRouters(routesConfig, false, pathPrefix);
