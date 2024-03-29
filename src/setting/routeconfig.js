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
import Playback from 'Views/playback';

import Role from 'Views/role';
import RoleEdit from 'Views/role/roleedit';
import RoleAdd from 'Views/role/roleadd';
import Plate from 'Views/plate';
import AddPlate from 'Views/plate/add';
import CameraDetail from 'Views/cameraDetail';
import Account from 'Views/system/user';
import AddAccount from 'Views/system/user/addUser';
import Face from 'Views/gallery/face';
import ImportFace from 'Views/gallery/face/import';
import Alarms from 'Views/alarms';
import IntelligentSearchPlate from 'Views/intelligentSearch/plate';
import IntelligentSearchFace from 'Views/intelligentSearch/face';
import Tenants from 'Views/tenants';
import TenantsDetail from 'Views/tenants/detail';
import { pathPrefix } from 'Constants/Dictionary';
import AlgoTask from 'Views/algotask';


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
        pageTitle: '实时预览',
        component: Preview,
      },
      {
        path: '/replay',
        exact: true,
        pageTitle: '视频回放',
        component: Playback,
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
  {
    path: '/intelligentSearch',
    exact: true,
    children: [
      {
        path: '/face',
        exact: true,
        pageTitle: '人脸检索',
        component: IntelligentSearchFace,
      },
      {
        path: '/plate',
        exact: true,
        pageTitle: '车牌识别',
        component: IntelligentSearchPlate,
      }
    ]
  },
  // 图库管理
  {
    path: '/gallery',
    exact: true,
    children: [
      {
        path: '/face',
        exact: true,
        pageTitle: '人脸库',
        component: Face,
        children: [
          {
            path: '/import',
            pageTitle: '人脸导入',
            component: ImportFace,
          }
        ]
      },
      {
        path: '/carLicense',
        exact: true,
        component: Plate,
        pageTitle: '车牌库',
        children: [
          {
            path: '/import',
            pageTitle: '车牌导入',
            component: AddPlate,
          },
        ]
      },
    ]
  },
  {
    path: '/tasks',
    pageTitle: '算法任务',
    exact: true,
    component: AlgoTask,
  },
  {
    path: '/platform',
    pageTitle: '平台管理',
    exact: true,
    component: Tenants,
    children: [
      {
        path: '/tenant/add',
        pageTitle: '添加租户',
        component: TenantsDetail,
      },
      {
        path: '/tenant/:tenantId',
        pageTitle: '租户详情',
        component: TenantsDetail,
      },
    ]
  },
  // {
  //   path: '/licenseManage',
  //   pageTitle: '许可管理',
  //   exact: true,
  //   component: DefaultPage,
  // },
  {
    path: '/',
    pageTitle: '首页',
    exact: true,
    component: Dashboard,
  },
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
