/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  Route, Switch, Link, withRouter
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import {
  Menu, Icon, Spin, message
} from 'antd';
// import { menuRouter } from 'Setting/routeconfig';
import { pathPrefix } from 'Constants/Dictionary';
// import Icon from 'Components/Icon';
import { menuRoutes } from 'Setting/routeconfig';
import { createRouters, createRouterByApiData } from 'Utils/core';
import { getMenuList } from 'Redux/reducer/pageHeader';
import EIcon from 'Components/Icon';
import { render } from 'less';

import PageHeader from './PageHeader';
import styles from './Manage.less';

const { SubMenu } = Menu;


const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  menuList: state.pageHeader.menuList || [],
  menuListLoading: state.pageHeader.menuListLoading || false,
});
const mapDispathToProps = dispatch => bindActionCreators({
  getMenuList
}, dispatch);

class Manage extends Component {
  state = {
    collapsed: false
  }

  componentDidMount() {
    this.props.getMenuList().then((res) => {
      console.log(res);
    });
  }

  changeMenuCollapsed = (collapsed) => {
    this.setState({
      collapsed
    });
  }

  createMenuTree = (data) => {
    // 下面的forEach写法会改变原数组，所以深度拷贝一次
    const copy = JSON.parse(JSON.stringify(data));
    const map = {};
    copy.forEach((item) => {
      item.key = item.id;
      map[item.id] = item;
    });
    const val = [];
    copy.forEach((item) => {
      const parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        val.push(item);
      }
    });
    return val;
  };

  render() {
    let {
      location: { pathname },
    } = this.props;
    const {
      match: { params },
      userInfo,
      menuList,
      menuListLoading,
    } = this.props;
    const { collapsed } = this.state;

    let menuRouter = () => null;
    menuRouter = () => createRouterByApiData(menuRoutes, menuList, true, pathPrefix);

    console.log('createRouterByApiData', menuRouter());

    const menuTree = this.createMenuTree(menuList);
    if (!menuTree || !menuTree[0]?.path) {
      return null;
    }

    const leftMenu = menuTree.map((item) => {
      if (item.hide) {
        return null;
      }

      if (item.children) {
        let showMenu = false;
        for (const subItem of item.children) {
        // 如果有需要展示菜单的子级，说明是SubMenu
          if (!subItem.hide) {
            showMenu = true;
            break;
          }
        }
        if (showMenu) {
          return (
            <SubMenu
              key={item.path?.split('/')[1] || ''}
              title={(
                <>
                  <EIcon type={`myicon-menuIcon-${item.id}`} />
                  <span className={styles.span10px} />
                  {item.name}
                </>
              )}
            >
              {
                item.children.map(val => (
                  <Menu.Item key={`${pathPrefix}${item.path}${val.path}`}>
                    <Link to={`${pathPrefix}${item.path}${val.path}`}>
                      {/* <Icon type="anticon-service-Cloudhostconsole" /> */}
                      <EIcon type={`myicon-menuIcon-${val.id}`} />
                      <span className={styles.span10px} />
                      <span>{val.name}</span>
                    </Link>
                  </Menu.Item>
                ))
              }
            </SubMenu>
          );
        }
      }
      return (
        <Menu.Item key={`${pathPrefix}${item.path}`}>
          <Link to={`${pathPrefix}${item.path}`}>
            {/* <Icon type="desktop" /> */}
            <EIcon type={`myicon-menuIcon-${item.id}`} />
            <span className={styles.span10px} />
            <span className={styles['EMR-manage-menuicon']}>{item.name}</span>
          </Link>
        </Menu.Item>
      );
    });
    console.log('!!!!', menuTree);

    // 匹配当前选中菜单
    const split = pathname?.split('/');
    if (split && split.length > 3) {
      const reg = /^(\/[\w-_]+\/[\w-_]+)\/(.)*$/.exec(pathname);
      pathname = reg && reg[1];
    }
    // 摄像头详情
    if (/^\/monitor\/.*$/.test(pathname)) {
      pathname = '/monitor';
    }
    return (
      <div className={styles['EMR-manage-container']}>
        <div className={`${styles['EMR-manage-tab']} ${collapsed ? styles['EMR-manage-tab-collapsed'] : ''}`}>
          <Spin spinning={menuListLoading}>
            <div className={styles['EMR-manage-avatar']}>
              {/* <img src="" alt="视频云" className={styles['EMR-manage-img']} /> */}
              <EIcon type="myicon-menuIcon-4" />
              <div className={styles['EMR-manage-name']}>智能视频分析平台</div>
            </div>
            <Menu
              defaultOpenKeys={[]}
              defaultSelectedKeys={[pathname]}
              selectedKeys={[pathname]}
              mode="inline"
              className={collapsed ? `${styles.menuInline}` : `${styles.menu}`}
              inlineCollapsed={collapsed}
            >
              {leftMenu}
            </Menu>
          </Spin>
        </div>

        <div className={styles['EMR-manage-content']}>
          <div className={styles['EMR-manage-content-inner']}>
            <PageHeader changeCollapsed={this.changeMenuCollapsed} />
            <div className={styles['EMR-manage-main']}>
              { menuRouter() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Manage.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(connect(
  mapStateToProps, mapDispathToProps
)(Manage));
