/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { pathPrefix } from 'Constants/Dictionary';
import _ from 'lodash';
import { menuRoutes } from 'Setting/routeconfig';
import { store } from '../redux/store';


const getRoute = (text, routers, pathArr) => {
  let pathPoint = 0;
  routers.forEach((route) => {
    const restPath = pathArr.slice(pathPoint).join('');
    if (route.path === pathArr[pathPoint]) {
      text.push({
        title: route.pageTitle,
        path: route.path
      });
      if (pathArr[++pathPoint]) {
        getRoute(text, route.children, _.drop(pathArr));
      }
    } else if (route.path === restPath) {
      if (route.pageTitle) {
        text.push({
          title: route.pageTitle,
          path: route.path
        });
      }
    }
  });
};

function findTitleInSetting(path) {
  const routers = menuRoutes;
  // 生产环境接入修改
  path = path.replace(pathPrefix, '');
  let splitedPath = path.split('/');
  splitedPath = splitedPath.filter(str => str).map(str => (`/${str}`));

  if (path === '/' || path === '') splitedPath = ['/'];
  const text = [];
  getRoute(text, routers, splitedPath);
  return text;
}

const reg = /\{(\w+)\}/g;
const formatTitle = (str, data) => str.replace(reg, (match, matchStr, index, stringObj) => {
  return data[matchStr] || matchStr;
});

const routerHook = (WrappedComponent, condition) => class RouterHook extends Component {
  componentDidMount() {
    const { location, match } = this.props;
    const { state } = location;
    let title;
    const path = match.url;
    if (state && (state.title || state.text)) {
      title = state.title || state.text;
    } else {
      title = findTitleInSetting(match.path);
    }
    let pageHeader;
    if (_.isArray(title)) {
      let prePath = pathPrefix;
      pageHeader = title.map((item) => {
        if (_.startsWith(item.path, '/:')) {
          const curPath = match.params[item.path.slice(2, item.length)];
          prePath = `${prePath}/${curPath}`;
        } else {
          prePath += item.path;
        }
        return {
          ...item,
          path: prePath,
          title: item.title && formatTitle(item.title, match.params)
        };
      });
    } else if (title) {
      pageHeader = [{
        title,
        path,
      }];
    }
    if (pageHeader) {
      // 没有pageTitle属性的route设置不显示在面包屑中
      pageHeader = pageHeader.filter(item => item.title);
      store.dispatch({
        type: 'SET_PAGE_HEADER',
        payload: pageHeader
      });
    }

    if (condition) condition();
  }

  render() {
    return <WrappedComponent {...this.props} />;
  }
};

export default routerHook;
