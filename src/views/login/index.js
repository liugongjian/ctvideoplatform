import React, { Component } from 'react';
import {
  Icon, Form, Input, Button, message, 
} from 'antd';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { pathPrefix } from 'Constants/Dictionary';
import { userlogin } from 'Redux/reducer/login';
import styles from './index.less';
import leftTop from 'Assets/leftTop.png';
import rightTop from 'Assets/rightTop.png';
import leftBottom from 'Assets/leftBottom.png';
import rightBottom from 'Assets/rightBottom.png';

const FormItem = Form.Item;

const mapStateToProps = state => ({ dashboard: state });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, userlogin
  },
  dispatch
);

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { push, userlogin } = this.props;
        const { username, password } = values;
        userlogin({
          username,
          password
        }).then((data) => {
          if (data.islogin === '1') {
            push(`${pathPrefix}/`);
          } else {
            message.error(data.msg);
          }
        }).catch(err => console.log(err));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.login}>
        <div className={styles.imgs}>
          <div className={styles.leftTop}>
            <img src={leftTop}></img>
          </div>
          <div className={styles.rightTop}>
            <img src={rightTop}></img>
          </div>
          <div className={styles.leftBottom}>
            <img src={leftBottom}></img>
          </div>
          <div className={styles.rightBottom}>
            <img src={rightBottom}></img>
          </div>
          <div className={styles.logo}></div>
        </div>
        <div className={styles.centerBox}></div>
        <div className={styles.loginForm}>
          <div className={styles.logo}>智能视频分析平台</div>
          <p className={styles.title}>账号密码登录</p>
          <Form onSubmit={this.handleSubmit}>
             <FormItem>
               {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input
                  prefix={<Icon type='user' className={styles.icon} />}
                  placeholder="账号"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input.Password
                  prefix={<Icon type='lock' className={styles.icon} />}
                  placeholder="密码"
                />,
              )}
            </FormItem>
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
