import React, { Component } from 'react';
import {
  Menu, Button, Icon, Dropdown
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { userlogout, userInfo } from 'Redux/reducer/login';
// import Icon from 'Components/Icon';
import PageHeader from 'Components/pageHeader';
import styles from './pageHeader.less';

const mapStateToProps = state => ({
  pageHeaderRoute: state.pageHeader.pageHeaderRoute || []
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, userlogout, userInfo
  },
  dispatch
);

class Contents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      userinfo: {}
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = () => {
    const { userInfo } = this.props;
    userInfo().then((res) => {
      this.setState({ userinfo: res });
    });
  }

  menu = () => (
    <Menu onClick={this.logout}>
      <Menu.Item key="0">
        <a>退出</a>
      </Menu.Item>
    </Menu>
  );

  logout = () => {
    const { userlogout, push } = this.props;
    userlogout().then((data) => {
      push('/login');
    });
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    }, () => {
      const { collapsed } = this.state;
      const { changeCollapsed } = this.props;
      changeCollapsed(collapsed);
    });
  }

  render() {
    const { pageHeaderRoute } = this.props;
    const { collapsed, userinfo } = this.state;
    return (
      <div className={styles.pageHeaderBox}>
        <Button type="link" onClick={this.toggleCollapsed} className={styles.changeBtn}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <PageHeader routes={pageHeaderRoute} />
        <Dropdown overlay={this.menu} trigger={['click']} className={styles.userBtn}>
          <a>
            <Icon type="user" />
            <span className={styles.username}>{userinfo.username || '' }</span>
          </a>
        </Dropdown>
      </div>
    );
  }
}


Contents.propTypes = {
  pageHeaderRoute: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
