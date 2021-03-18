import React, { Component } from 'react';
import {
  Select, Button, Form, Input, Icon, message
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getAccountList, getRoleList, addAccount
} from 'Redux/reducer/account';

import styles from './addUser.less';

const FormItem = Form.Item;
const { Option } = Select;

const mapStateToProps = state => ({ account: state.account });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAccountList, getRoleList, addAccount
  },
  dispatch
);

class AddAccount extends Component {
    state = {
      roleData: [],
      isTooltipShow: true,
    };

    componentDidMount() {
      this.getRoleList();
    }

    getRoleList = () => {
      const { getRoleList } = this.props;
      getRoleList().then((res) => {
        const roleData = res.map(item => ({ id: item.id, name: item.name }));
        this.setState({
          roleData
        });
      });
    };

    // 提交添加用户的表单
    addAccount = (e) => {
      const { addAccount } = this.props;
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          addAccount(values).then(
            (res) => {
              message.success('添加账号成功');
              this.props.form.resetFields();
              this.props.history.go(-1);
            }
          ).catch((err) => {
            // message.warning('添加账户失败')
          });
        }
      });
    };

    // 添加用户的取消 返回上一级菜单
    handleCancel = () => {
      this.props.history.go(-1);
    };

    validatorPsw = (rule, value, callback) => {
      if (!(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?_~.]).{12,26}$/.test(value)) && value) {
        callback(new Error('新密码至少包含大小写字母、数字和特殊字符(!@#$%^&*?_~.)，且长度为12～26位字符！'));
      } else {
        callback();
      }
    };

    validatorRePsw = (rule, value, callback) => {
      const password = this.props.form.getFieldValue('password');
      if (password && password !== value && value) {
        callback(new Error('两次密码输入不一致！'));
      } else {
        callback();
      }
    };

    handleRoleChange = (value) => {
    //   console.log(`selected role ${value}`);
    };

    handleRoleSearch = (value) => {
    //   console.log('search:', value);
    };

    pswChange = () => {
      this.setState({
        isTooltipShow: false,
      });
    };

    render() {
      const { roleData, isTooltipShow } = this.state;
      const {
        form: { getFieldDecorator },
      } = this.props;
      const formItemLayout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 10 },
      };
      const tailFormItemLayout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 10, offset: 2, },
      };
      return (
        <div className={styles.addContainer}>
          <Form horizontal="true">
            <div className={styles.editSecTitle}>基本配置</div>
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '用户名不能为空' },
                  { max: 30, message: '用户名不得超过30个字符' },
                  { pattern: new RegExp(/\S/), message: '用户名不能为空' }
                ],
                validateTrigger: 'onBlur'
              },
              { initialValue: '' })(
                <Input placeholder="请输入用户名" />
              )
              }
            </FormItem>
            <FormItem label="密码" autoComplete="off" {...formItemLayout} className={isTooltipShow ? styles.passwordBpttom : styles.password}>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '密码不能为空' },
                  // eslint-disable-next-line max-len
                  { validator: (rule, value, callback) => { this.validatorPsw(rule, value, callback); } }
                ],
                validateTrigger: 'onBlur'
              },
              { initialValue: '' })(
                <Input.Password onChange={this.pswChange} placeholder="请输入密码" />
              )}
            </FormItem>
            {
              isTooltipShow
                ? (
                  <FormItem {...tailFormItemLayout} className={styles.tooltip}>
                    <span>密码至少包含大小写字母、数字和特殊字符(!@#$%^&*?_~.)，且长度为12～26位字符</span>
                  </FormItem>
                ) : ''
            }
            <FormItem label="确认密码" autoComplete="off" {...formItemLayout}>
              {getFieldDecorator('rePassword', {
                rules: [
                  { required: true, message: '确认密码不能为空' },
                  // eslint-disable-next-line max-len
                  { validator: (rule, value, callback) => { this.validatorRePsw(rule, value, callback); } }
                ],
                validateTrigger: 'onBlur'
              },
              { initialValue: '' })(
                <Input.Password placeholder="请确认密码" />
              )}
            </FormItem>
            <div className={styles.editSecTitle}>关联权限</div>
            <FormItem label="选择角色" {...formItemLayout}>
              {
                getFieldDecorator('roleId', {
                  rules: [
                    { required: true, message: '角色不能为空' }
                  ]
                },
                { initialValue: '' })(
                  <Select
                    placeholder="请为账号选择角色"
                    showSearch
                    optionFilterProp="children"
                    onChange={this.handleRoleChange}
                    onSearch={this.handleRoleSearch}
                    initialValue=""
                    // eslint-disable-next-line max-len
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {roleData.map(d => (
                      <Option key={d.id}>{d.name}</Option>
                    ))}
                  </Select>
                )
              }
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={this.addAccount}>保存</Button>
              <Button type="button" onClick={this.handleCancel} className={styles.cancel}>取消</Button>

            </FormItem>

          </Form>
        </div>
      );
    }
}

AddAccount.propTypes = {
  // account: PropTypes.object.isRequired
};
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddAccount));
