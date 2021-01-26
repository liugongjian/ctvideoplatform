import React, { Component } from 'react';
import {
  Form, Input, Button, message
} from 'antd';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { pathPrefix } from 'Constants/Dictionary';
import { userlogin } from 'Redux/reducer/login';
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

  // validateToNextPassword = (rule, value, callback) => {
  //   console.log(rule);
  //   console.log(value);
  //   // console.log(callback);
  //   callback();
  // }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.content}>
        <div className={styles.loginBox}>
          <div className={styles.logo}>
            <img src="" alt="" />
          </div>
          <div className={styles.textTitle}>
            <h1>天翼云人脸考勤系统</h1>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              登录
            </FormItem>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input
                  placeholder="账号"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input.Password
                  placeholder="密码"
                />,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button" block>
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
