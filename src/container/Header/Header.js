/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { userlogout } from 'Redux/reducer/login';
import { ifLogin } from 'Common/user';

import logo from 'Assets/logo.png';
import styles from './Header.less';

const mapStateToProps = state => state.user;
const mapDispathToProps = dispatch => bindActionCreators({
  push, userlogout
}, dispatch);


class Header extends Component {
  menu = () => (
    <Menu onClick={this.logout}>
      <Menu.Item key="0">
        <a>退出</a>
      </Menu.Item>
    </Menu>
  );

  logout = () => {
    const { userlogout } = this.props;
    userlogout().then((data) => {
      if (data && data.sso_logout_url) {
        const { sso_logout_url } = data;
        window.location.href = sso_logout_url;
      } else {
        ifLogin();
      }
    }); // () => window.location.href = '/login'
  }

  render() {
    const { userInfo } = this.props;
    return (
      <header>
        <div className={styles['EMR-header']}>
          <div className={styles['EMR-header-left']}>
            <div className={styles['EMR-header-logo']}>
              <img alt="天翼云" src={logo} className={styles['EMR-header-logo-png']} />
            </div>
          </div>

          <div className={styles['EMR-header-right']}>
            <Dropdown overlay={this.menu} trigger={['click']}>
              <a>{userInfo.username || ''}</a>
            </Dropdown>
          </div>
        </div>
      </header>
    );
  }
}


Header.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispathToProps)(Header);
