import React, { Component } from 'react';
import {
  Form, Popover, Input, Button
} from 'antd';
import PropTypes from 'prop-types';
import Icon from 'Components/Icon';
import { formGetFieldDecorator } from 'Components/FormPopover';

const { Item: FormItem } = Form;
class EPopover extends Component {
    state = { passwordHasValidate: false, popoverVisible: false, confirmDirty: false }

    checkConfirm = (rule, value, callback) => {
      const { form } = this.props;
      const { confirmDirty } = this.state;
      if (value && confirmDirty) {
        form.validateFields(['confirm'], {
          force: true
        });
      }
      callback();
    }

    checkPassword = (rule, value, callback) => {
      const { form } = this.props;
      const { getFieldValue } = form;
      if (value && value !== getFieldValue('password')) {
        callback('两次密码输入不一致, 请重新输入');
      } else {
        callback();
      }
    }

    validatePassword = () => {
      const { form } = this.props;
      const { getFieldValue } = form;
      const value = getFieldValue('password') || '';
      const tips = [{
        title: '长度为8~15个字符',
        status: /^.{8,15}$/.test(value) ? 'success' : 'failure'
      }, {
        title: '字母、数字及至少一个特殊符号（#!@）组合',
        status: /^(?=.*[#!@])[0-9a-zA-Z#!@]+$/.test(value) ? 'success' : 'failure'
      },
      {
        title: '需包含大写字母',
        status: /^(?=.*[A-Z]).+$/.test(value) ? 'success' : 'failure'
      }
      ];
      let isValid = true;
      tips.map((tip) => {
        if (tip.status === 'failure') {
          isValid = false;
        }
        return tip;
      });
      return { isValid, tips };
    }

    popover = (form) => {
      const { getFieldValue } = form;
      const value = getFieldValue('password');
      const { passwordHasValidate } = this.state;
      const hasValidate = value === undefined && !passwordHasValidate;
      const { tips } = this.validatePassword();
      const iconData = {
        success: {
          type: 'check-circle-o',
          color: '#52c41a'
        },
        failure: {
          type: 'close-circle-o',
          color: '#f5222d'
        }
      };

      function iconRender(status) {
        let icon = '';
        if (hasValidate) {
          icon = <Icon type="icon-NAT-Gateway" />;
        } else {
          icon = <Icon type="icon-NAT-Gateway" />;
        }
        return icon;
      }
      return (
        <ul styleName="popover">
          {
            tips.map(tip => (
              <li key={tip.title}>
                {iconRender(tip.status, tip.title)}
                {!hasValidate && tip.status === 'failure' ? <span style={{ color: iconData[tip.status].color }}>{tip.title}</span> : tip.title}
              </li>
            ))
          }
        </ul>
      );
    }

    handleSubmit = (e) => {
      e.preventDefault();
      const { form } = this.props;
      form.validateFields(
        (err, fieldsValue) => {
          if (err) {
            return null;
          }
          return true;
        }
      );
    }

    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      const { popoverVisible } = this.state;
      const formItemLayout = {
        labelCol: {
          span: 5
        },
        wrapperCol: {
          span: 19
        },
      };
      const msgIcon = msg => (
        <span>
          <Icon type="anticon-status-problem-o" />
          {msg}
        </span>
      );
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="设置密码"
          >
            {/* <FormPopover
              tips={tips}
              placement="right"
            > */}
            {/* {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请设置登录密码',
                }, {
                  validator: [this.checkConfirm],
                }],
              })(
                <Input type="password" autoComplete="off" placeholder="请输入密码" />
              )} */}
            {
              formGetFieldDecorator(form)('password', {
                rules: [{
                  required: true,
                  message: msgIcon('请输入密码'),
                }],
                validator: [
                  {
                    message: '需包含大写字母',
                    valid: /^(?=.*[A-Z]).+$/
                  }, {
                    message: '长度为8~15个字符',
                    valid: /^.{8,15}$/
                  }
                ]
              })(
                <Input type="password" allowClear autoComplete="off" placeholder="请输入密码" />
              )
            }
            {/* </FormPopover> */}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="重复密码"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: msgIcon('请确认密码'),
              }, {
                validator: this.checkPassword
              }]
            })(
              <Input type="password" allowClear autoComplete="off" onBlur={this.handleConfirmPasswordBlur} placeholder="请重复输入一次密码" />
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
            >
            提交
            </Button>
          </FormItem>
        </Form>
      );
    }
}
EPopover.propTypes = {
  form: PropTypes.shape({}).isRequired,
  // tips: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Form.create()(EPopover);
