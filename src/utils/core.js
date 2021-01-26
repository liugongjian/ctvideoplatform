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

export const createRouters = (routersconfig, withHook, parentPath) => {
  const routers = [];
  mapRouter(routers, routersconfig, '');
  return (
    <Switch>
      {
        routers.map(config => createRouter(config, withHook, parentPath))
      }
      <Redirect to={pathPrefix} />
    </Switch>
  );
};
