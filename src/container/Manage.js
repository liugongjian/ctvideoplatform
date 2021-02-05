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
import { Menu, Icon } from 'antd';
// import { menuRouter } from 'Setting/routeconfig';
import { pathPrefix } from 'Constants/Dictionary';
// import Icon from 'Components/Icon';
import { menuRoutes } from 'Setting/routeconfig';
import { createRouters } from 'Utils/core';
import { getMenuList } from 'Redux/reducer/pageHeader';

import { render } from 'less';
import PageHeader from './PageHeader';
import styles from './Manage.less';

const { SubMenu } = Menu;


const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  menuList: state.pageHeader.menuList || []
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

  render() {
    let { location: { pathname } } = this.props;
    const { match: { params }, userInfo } = this.props;
    const { menus = ['01', '02'], menus_limited } = userInfo;
    const { collapsed } = this.state;


    // menuCode 后端返回展示的，subMenuCode后端返回隐藏的
    const menuRouters = menuRoutes.filter(item => menus.indexOf(item.menuCode) > -1);

    const leftMenu = menuRouters.map((item) => {
      if (item.hideMenu) {
        return null;
      }

      if (item.children) {
        let showMenu = false;
        for (const subItem of item.children) {
        // 如果有需要展示菜单的子级，说明是SubMenu
          if (!subItem.hideMenu) {
            showMenu = true;
            break;
          }
        }
        if (showMenu) {
          const data = Array.isArray(menus_limited) && menus_limited.length > 0
            ? item.children.filter(res => menus_limited.indexOf(res.subMenuCode) === -1)
            : item.children;

          return (
            <SubMenu key={item.path.split('/')[1]} title={item.menuTitle}>
              {
                data.map(val => (
                  <Menu.Item key={`${pathPrefix}${item.path}${val.path}`}>
                    <Link to={`${pathPrefix}${item.path}${val.path}`}>
                      <Icon type="anticon-service-Cloudhostconsole" />
                      <span>{val.pageTitle}</span>
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
            <Icon type="desktop" />
            <span className={styles['EMR-manage-menuicon']}>{item.menuTitle}</span>
          </Link>
        </Menu.Item>
      );
    });

    const menuRouter = () => createRouters(menuRouters, true, pathPrefix);

    // 匹配当前选中菜单
    const split = pathname.split('/');
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
        <div className={styles['EMR-manage-tab']}>
          <div className={styles['EMR-manage-avatar']}>
            <img src="" alt="视频云" className={styles['EMR-manage-img']} />
            <div className={styles['EMR-manage-name']}>视频云平台</div>
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
