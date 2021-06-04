import React, { Component } from 'react';
import {
  Icon, Form, Input, Button, message,
} from 'antd';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { pathPrefix, urlPrefix } from 'Constants/Dictionary';
import { userlogin } from 'Redux/reducer/login';
import leftTop from 'Assets/leftTop.png';
import rightTop from 'Assets/rightTop.png';
import leftBottom from 'Assets/leftBottom.png';
import rightBottom from 'Assets/rightBottom.png';
import loginLogo from 'Assets/loginLogo.png';
import styles from './index.less';

const FormItem = Form.Item;

const mapStateToProps = state => ({ dashboard: state });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, userlogin
  },
  dispatch
);

class Login extends Component {
  state = {
    verifyImgUrl: `${urlPrefix}/verifyCode?${new Date().getTime()}`
  };

  // 刷新验证码
  refreshImg = () => {
    this.setState({
      verifyImgUrl: `${urlPrefix}/verifyCode?${new Date().getTime()}`
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { push, userlogin } = this.props;
        const { username, password, validate } = values;
        userlogin({
          username,
          password,
          validate,
        }).then((data) => {
          if (data && data.username) {
            window.sessionStorage.removeItem('deviceInfo');
            window.sessionStorage.removeItem('squareInfo');
            push('/');
          } else {
            this.refreshImg();
          }
        }).catch((err) => {
          this.refreshImg();
          console.log(err);
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { verifyImgUrl } = this.state;
    return (
      <div className={styles.login}>
        <div className={styles.imgs}>
          <div className={styles.leftTop}>
            <img src={leftTop} alt="" />
          </div>
          <div className={styles.rightTop}>
            <img src={rightTop} alt="" />
          </div>
          <div className={styles.leftBottom}>
            <img src={leftBottom} alt="" />
          </div>
          <div className={styles.rightBottom}>
            <img src={rightBottom} alt="" />
          </div>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <img src={loginLogo} alt="" />
            </div>
            <span className={styles.productName}>
              智能视频分析平台
            </span>
          </div>
        </div>
        <div className={styles.centerBox} />
        <div className={styles.loginForm}>
          <div className={styles.logo}>智能视频分析平台</div>
          <p className={styles.title}>账号密码登录</p>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input
                  prefix={<Icon type="user" className={styles.icon} />}
                  placeholder="账号"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input.Password
                  prefix={<Icon type="lock" className={styles.icon} />}
                  placeholder="密码"
                />,
              )}
            </FormItem>
            <div className={styles.yzmContainer}>
              <FormItem>
                {getFieldDecorator('validate', {
                  rules: [{ required: true, message: '请输入验证码' }],
                })(
                  <Input
                    prefix={<Icon type="safety-certificate" className={styles.icon} />}
                    placeholder="验证码"
                  />,
                )}
              </FormItem>
              <div className={styles.yzm} onClick={this.refreshImg}>
                <img src={verifyImgUrl} alt="" />
              </div>
            </div>
            <FormItem>
              <Button type="primary" htmlType="submit" className={styles.submitBtn} block>
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  form: PropTypes.object.isRequired,
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Login));
