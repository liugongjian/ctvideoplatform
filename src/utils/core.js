import React from 'react';
import {
  BrowserRouter, Route, Switch, Redirect
} from 'react-router-dom';
import routerconfig from 'Setting/routeconfig';
import { pathPrefix } from 'Constants/Dictionary';
import routerHook from './routerHook';

const mapRouter = (routers, routersConfig, prePath) => {
  routersConfig.forEach((item) => {
    const { children, ...otherConfigs } = item;
    otherConfigs.path = (prePath || '') + item.path;
    routers.push(otherConfigs);
    if (children) {
      const prePath = otherConfigs.path;
      mapRouter(routers, children, prePath);
    }
  });
};

export const createRouter = (routeConfig, withHook, parentPath) => {
  const { pageTitle, ...restProps } = routeConfig;
  let { path, key, component } = restProps;
  if (parentPath) {
    path = parentPath + (path === '/' ? '' : path);
  }
  key = path;
  if (withHook) {
    component = routerHook(component);
  }
  const routeProps = {
    ...restProps, key, path, component
  };
  return (<Route {...routeProps} />);
};

const getRealPath = (id, list) => {
  const { path, pid } = list?.find(item => item.id == id) || {};
  if (pid) {
    return `${getRealPath(pid,list)}${path}`;
  }
  return path;
};

export const createRouterByApiData = (routersconfig, apiData, withHook, parentPath) => {
  const localRouters = [];
  mapRouter(localRouters, routersconfig, '');
  // 以菜单接口数据(apiData)为主，并入本地配置
  const copyApiData = JSON.parse(JSON.stringify(apiData));
  const routers = copyApiData?.map((item) => {
    item.path = getRealPath(item.id, apiData);
    const { path, name } = item;
    const localConf = localRouters.find(route => route.path === path);
    if (!localConf) {
      // throw Error(`${path}菜单本地尚未配置！`);
      console.log(`${path}菜单本地尚未配置！`)
    }
    return {
      pageTitle: name,
      ...localConf,
      ...item,
    };
  });

  console.log('routers', routers)

  return (
    <Switch>
      {
        routers.map(config => createRouter(config, withHook, parentPath))
      }
    </Switch>
  );
  // return routers;
};

export const createRouters = (routersconfig, withHook, parentPath) => {
  const routers = [];
  mapRouter(routers, routersconfig, '');
  return (
    <Switch>
      {
        routers.map(config => createRouter(config, withHook, parentPath))
      }
    </Switch>
  );
};
