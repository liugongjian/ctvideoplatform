import React, { Component } from 'react';
import {
  Menu, Button, Icon, Dropdown, Modal, Input, Form, message
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { userlogout, userInfo, updatePassword } from 'Redux/reducer/login';
// import Icon from 'Components/Icon';
import PageHeader from 'Components/pageHeader';
import styles from './pageHeader.less';

const FormItem = Form.Item;

const mapStateToProps = state => ({
  pageHeaderRoute: state.pageHeader.pageHeaderRoute || []
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, userlogout, userInfo, updatePassword
  },
  dispatch
);

class Contents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      userinfo: {},
      showChangeModal: false,
      isTooltipShow: true
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  componentWillReceiveProps(prevprops) {
    if (prevprops.collapsed === this.props.collapsed) {
      this.setState({
        collapsed: this.props.collapsed
      });
    }
  }

  getUserInfo = () => {
    const { userInfo, push } = this.props;
    userInfo().then((res) => {
      this.setState({
        userinfo: res
      }, () => {
        const { type } = res;
        if (type === 'ADMIN') { // 根据账号type决定默认页，后续需优化
          push('/platform');
        }
      });
    });
  }

  menu = () => (
    <Menu onClick={this.menuClick}>
      <Menu.Item key="1">
        <a>修改密码</a>
      </Menu.Item>
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

  menuClick = (param) => {
    const { item, key } = param;
    console.log('item', item, 'key', key === '1');
    if (key === '1') {
      this.setState({
        showChangeModal: true
      });
    } else if (key === '0') {
      const { userlogout, push } = this.props;
      userlogout().then((data) => {
        push('/login');
      });
    }
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

  sureChange = () => {
    const { updatePassword } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const data = {
          rentpassword: values.oldPassword,
          renewpassword: values.newPassword,
          useridlist: [this.state.userinfo.id]
        };
        updatePassword(data).then(
          (res) => {
            message.success('重置密码成功');
            this.setState({
              showChangeModal: false
            });
            this.getTableList();
          }
        );
      }
    });
  }

  cancelChange = () => {
    this.setState({
      showChangeModal: false
    });
  }

  reNewPswChange = () => {
    this.setState({
      isTooltipShow: false
    });
  };

  validatorRePsw = (rule, value, callback) => {
    if (!(/^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?_~.])(.{12,26})/.test(value)) && value) {
      callback(new Error('新密码至少包含大小写字母、数字和特殊字符(!@#$%^&*?_~.)，且长度为12～26位字符！'));
    } else {
      callback();
    }
  };

  validatorRePsw2 = (rule, value, callback) => {
    const newPassword = this.props.form.getFieldValue('newPassword');
    if (newPassword && newPassword !== value && value) {
      callback(new Error('两次密码输入不一致！'));
    } else {
      callback();
    }
  };

  render() {
    const { pageHeaderRoute } = this.props;
    const {
      collapsed, userinfo, showChangeModal, isTooltipShow
    } = this.state;

    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div className={styles.pageHeaderBox}>
        <span onClick={this.toggleCollapsed} className={styles.changeBtn}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
        <PageHeader routes={pageHeaderRoute} />
        <Dropdown overlay={this.menu} trigger={['click']} className={styles.userBtn}>
          <a>
            <Icon type="user" />
            <span className={styles.username}>{userinfo.username || '' }</span>
          </a>
        </Dropdown>
        <Modal
          title="修改密码"
          visible={showChangeModal}
          onCancel={this.cancelChange}
          className={styles.pswModal}
          forceRender
          destroyOnClose
          width="600px"
          footer={[
            <Button key="submit" type="primary" onClick={this.sureChange}>
              确定
            </Button>,
            <Button key="back" style={{ margin: '0 0 0 20px' }} onClick={this.cancelChange}>
              取消
            </Button>,
          ]}
        >
          <Form>
            <FormItem label="旧密码" autoComplete="new-password" {...formItemLayout}>
              {getFieldDecorator('oldPassword', {
                rules: [
                  { required: true, message: '请输入旧密码' },
                ],
                validateTrigger: 'onBlur'
              },
              { initialValue: '' })(
                <Input.Password placeholder="请输入旧密码" />
              )}
            </FormItem>
            <FormItem label="新密码" autoComplete="new-password" {...formItemLayout}>
              {getFieldDecorator('newPassword', {
                rules: [
                  { required: true, message: '新密码不能为空！' },
                  // eslint-disable-next-line max-len
                  { validator: (rule, value, callback) => { this.validatorRePsw(rule, value, callback); } }
                ],
                validateTrigger: 'onBlur'
              },
              { initialValue: '' })(
                <Input.Password onChange={this.reNewPswChange} placeholder="请输入新密码" />
              )}
            </FormItem>
            {
              // isTooltipShow
              //   ? (
              //     <FormItem {...formItemLayout} className={styles.tooltip}>
              //       <span>新密码至少包含大小写字母、数字和特殊字符(!@#$%^&*?_~.)，且长度为12～26位字符</span>
              //     </FormItem>
              //   ) : ''
            }
            <FormItem label="确认密码" autoComplete="new-password" {...formItemLayout}>
              {getFieldDecorator('reNewPassword',
                {
                  rules: [
                    { required: true, message: '确认密码不能为空！' },
                    // eslint-disable-next-line max-len
                    { validator: (rule, value, callback) => { this.validatorRePsw2(rule, value, callback); } }
                  ],
                  validateTrigger: 'onBlur'
                },
                { initialValue: '' })(
                // eslint-disable-next-line react/jsx-indent
                <Input.Password placeholder="请输入确认密码" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}


Contents.propTypes = {
  pageHeaderRoute: PropTypes.array.isRequired,
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Contents));
