import React, { Component } from 'react';
import { notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ifLogin, updateUserInfo, ssoLogin } from 'Common/user';
// import { getConfigSetting } from 'Redux/reducer/settings';
import { urlPrefix, CONFIGURABLE_ITEMS } from 'Constants/Dictionary';

// import ELoading from 'Components/loading/Eloading';

const mapStateToProps = state => state.user;
const mapDispathToProps = dispatch => bindActionCreators({
  updateUserInfo,
}, dispatch);
const LoginContainer = (props) => {
  const {
    updateUserInfo,
    userInfo,
    //  prefix,
    children,
  } = props;

  if (userInfo && userInfo.status) {
    return children;
  }

  ifLogin(urlPrefix).then((result) => {
    console.log('update', result);
    updateUserInfo(result);
    // getConfigSetting(CONFIGURABLE_ITEMS.CONFIG_IMAGE_SHOWN);
  }).catch((err) => {
    // if (err.status === 403) {
    //   notification.error({
    //     message: err.message || '',
    //     description: '您当前账号还未下单，无法访问本页面',
    //   });
    // } else {
    //   notification.error({
    //     message: err.message || '',
    //     description: '当前域名可能和认证域名不一致',
    //   });
    // }
    notification.error({
      message: err.message || '',
      description: '当前域名可能和认证域名不一致',
    });
  });


  // return <ELoading loading page />;
  return null;
};

LoginContainer.propTypes = {
  userInfo: PropTypes.object.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  // prefix: PropTypes.string,
  children: PropTypes.element.isRequired
};
LoginContainer.defaultProps = {
  // prefix: 'cloud'
};

export default connect(
  mapStateToProps, mapDispathToProps
)(LoginContainer);
