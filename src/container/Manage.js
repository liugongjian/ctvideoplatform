/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  Route, Switch, Link, withRouter
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, Icon } from 'antd';
// import { menuRouter } from 'Setting/routeconfig';
import { pathPrefix } from 'Constants/Dictionary';
// import Icon from 'Components/Icon';
import { menuRoutes } from 'Setting/routeconfig';
import { createRouters } from 'Utils/core';

import { render } from 'less';
import PageHeader from './PageHeader';
import styles from './Manage.less';

const { SubMenu } = Menu;


const mapStateToProps = state => state.user;
const mapDispathToProps = dispatch => bindActionCreators({
}, dispatch);

class Manage extends Component {
  state = {
    collapsed: false
  }

  changeMenuCollapsed = (collapsed) => {
    this.setState({
      collapsed
    });
  }

  render() {
    let { location: { pathname } } = this.props;
    const { match, userInfo } = this.props;
    const { menus = ['01', '02'], menus_limited } = userInfo;
    const { collapsed } = this.state;


    // menuCode 后端返回展示的，subMenuCode后端返回隐藏的
    const menuRouters = menuRoutes.filter(item => menus.indexOf(item.menuCode) > -1);

    const leftMenu = menuRouters.map((item) => {
      if (item.children) {
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

    const split = pathname.split('/');
    if (split && split.length > 4) {
      const reg = /^(\/[\w-_]+\/[\w-_]+\/[\w-_]+)\/(.)*$/.exec(pathname);
      pathname = reg && reg[1];
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
            className={collapsed ? `${styles['EMR-manage-menuInline']}` : `${styles['EMR-manage-menu']}`}
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

// const Manage = (props) => {
//   let { location: { pathname } } = props;
//   const { match, userInfo } = props;

//   const { menus = ['01', '02'], menus_limited } = userInfo;


//   // menuCode 后端返回展示的，subMenuCode后端返回隐藏的
//   const menuRouters = menuRoutes.filter(item => menus.indexOf(item.menuCode) > -1);

//   const leftMenu = menuRouters.map((item) => {
//     if (item.children) {
//       const data = Array.isArray(menus_limited) && menus_limited.length > 0
//         ? item.children.filter(res => menus_limited.indexOf(res.subMenuCode) === -1)
//         : item.children;

//       return (
//         <SubMenu key={item.path.split('/')[1]} title={item.menuTitle}>
//           {
//             data.map(val => (
//               <Menu.Item key={`${pathPrefix}${item.path}${val.path}`}>
//                 <Link to={`${pathPrefix}${item.path}${val.path}`}>{val.pageTitle}</Link>
//               </Menu.Item>
//             ))
//           }
//         </SubMenu>
//       );
//     }
//     return (
//       <Menu.Item key={`${pathPrefix}${item.path}`}>
//         <Link to={`${pathPrefix}${item.path}`}>{item.menuTitle}</Link>
//       </Menu.Item>
//     );
//   });

//   const menuRouter = () => createRouters(menuRouters, true, pathPrefix);

//   const split = pathname.split('/');
//   if (split && split.length > 4) {
//     const reg = /^(\/[\w-_]+\/[\w-_]+\/[\w-_]+)\/(.)*$/.exec(pathname);
//     pathname = reg && reg[1];
//   }
//   return (
//     <div className={styles['EMR-manage-container']}>
//       <div className={styles['EMR-manage-tab']}>
//         <div className={styles['EMR-manage-avatar']}>
//           <img src="" alt="视频云" className={styles['EMR-manage-img']} />
//           <div className={styles['EMR-manage-name']}>视频云平台</div>
//         </div>
//         <Menu
//           defaultOpenKeys={[]}
//           defaultSelectedKeys={[pathname]}
//           selectedKeys={[pathname]}
//           mode="inline"
//           className={styles['EMR-manage-menu']}
//         >
//           {leftMenu}
//         </Menu>
//       </div>
//       <div className={styles['EMR-manage-content']}>
//         <div className={styles['EMR-manage-content-inner']}>
//           <PageHeader />
//           <div className={styles['EMR-manage-main']}>
//             { menuRouter() }
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

Manage.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(connect(
  mapStateToProps, mapDispathToProps
)(Manage));
