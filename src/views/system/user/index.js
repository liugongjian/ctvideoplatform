/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  Select, Button, Modal, Form, Input, Switch, Icon, message, Table, Pagination
} from 'antd';
// import Icon from 'Components/Icon';
import { Link } from 'react-router-dom';
import ETable from 'Components/ETable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getAccountList, getRoleList, updateUser, delAccount, stopAccount, updatePassword
} from 'Redux/reducer/account';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const mapStateToProps = state => ({ account: state.account });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getAccountList, getRoleList, updateUser, delAccount, stopAccount, updatePassword
  },
  dispatch
);

class Account extends Component {
  state = {
    accountData: [],
    modalVisible: false, // 对话框显示标志
    pswModalVisible: false,
    deleteModelVisible: false,
    delIds: [],
    delUserName: '',
    stopModelVisible: false,
    stopIds: [],
    stopUserName: '',
    enableModelVisible: false,
    enableIds: [],
    enableUserName: '',
    loading: false, // 账号列表加载状态
    // loginUserId: Cookies.get('uid'), // 登录用户的uid
    searchParams: {
      userName: '',
      roleName: '',
      active: 2,
      isOnline: 2,
    }, // 模糊搜索
    selectedRowKeys: [],
    total: 0,
    pageSize: 10,
    pageNum: 1,
    editXq: {
      userName: '',
      initialRoleIdValue: undefined,
      initialRoleNameValue: '',
    },
    pswXq: {
      userId: '',
      userName: '',
      rentPassword: '',
      reNewPassword: ''
    },
    isTooltipShow: true,
    roleData: []
  };

  componentDidMount() {
    this.getTableList();
    this.getRoleList();
  }

  getTableList = () => {
    const { getAccountList } = this.props;
    const { active, isOnline } = this.state.searchParams;
    const data = {
      active: active === 2 ? null : active === 0,
      isOnline: isOnline === 2 ? null : isOnline === 0,
      username: this.state.searchParams.userName,
      roleName: this.state.searchParams.roleName,
      pageSize: this.state.pageSize,
      pageNo: this.state.pageNum - 1
    };
    this.setState({
      loading: true
    });
    getAccountList(data).then((res) => {
      this.setState({
        accountData: res.list,
        total: res.recordsTotal,
        pageNum: res.pageNo + 1,
        pageSize: res.pageSize,
        loading: false
      });
    });
  };

  getRoleList = () => {
    const { getRoleList } = this.props;
    getRoleList().then((res) => {
      const roleData = res.map(item => ({ value: item.id, text: item.name }));
      this.setState({
        roleData
      });
    });
  };

  handleRowSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    }, () => this.getTableList());
  };

  // 提交编辑用户的表单
  updateUser = () => {
    const { updateUser } = this.props;
    this.props.form.validateFields((errors, values) => {
      const data = {
        id: this.state.editXq.userId,
        roleId: values.roleId
      };
      delete values.reNewPassword;
      delete values.reNewPassword1;
      delete values.rentpassword;
      updateUser(data).then(
        (res) => {
          message.success('修改成功');
          this.setState({
            modalVisible: false
          });
          this.getTableList();
        }
      );
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  validatorRePsw = (rule, value, callback) => {
    if (!(/^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])(.{12,26})/.test(value)) && value) {
      callback(new Error('新密码至少包含大小写字母、数字和特殊字符，且长度为12～26位字符！'));
    } else {
      callback();
    }
  };

  validatorRePsw2 = (rule, value, callback) => {
    const reNewPassword = this.props.form.getFieldValue('reNewPassword');
    if (reNewPassword && reNewPassword !== value && value) {
      callback(new Error('两次密码输入不一致！'));
    } else {
      callback();
    }
  };

  reset = () => {
    // 头部搜索条件的置空
    this.setState({
      searchParams: {
        active: 2,
        isOnline: 2,
        userName: '',
        roleName: '',
      },
      pageSize: 10,
      pageNum: 1
    }, () => {
      this.getTableList();
    });
  };

  queryUserName = (e) => {
    const searchParams = Object.assign(this.state.searchParams, { userName: e.target.value.trim() });
    this.setState({
      searchParams
    });
  };

  queryRoleName = (e) => {
    const searchParams = Object.assign(this.state.searchParams, { roleName: e.target.value.trim() });
    this.setState({
      searchParams
    });
  };

  queryEnabled = (val) => {
    const searchParams = Object.assign(this.state.searchParams, { active: val });
    this.setState({
      searchParams
    });
  };

  queryStatus = (val) => {
    const searchParams = Object.assign(this.state.searchParams, { isOnline: val });
    this.setState({
      searchParams
    });
  };

  renderTableHeaders = () => (
    <div>
      <div className={styles.query}>
        <div className={styles.queryUserName}>
          <span className={styles.queryLabel}>用户名：</span>
          <Input placeholder="请输入用户名" onChange={this.queryUserName} value={this.state.searchParams.userName} />
        </div>
        <div className={styles.queryRoleName}>
          <span className={styles.queryLabel}>角色名称：</span>
          <Input placeholder="请输入角色名称" onChange={this.queryRoleName} value={this.state.searchParams.roleName} />
        </div>
        <div className={styles.queryStatus}>
          <span className={styles.queryLabel}>在线状态：</span>
          <Select value={this.state.searchParams.isOnline} onChange={this.queryStatus}>
            <Option value={0}>在线</Option>
            <Option value={1}>离线</Option>
            <Option value={2}>全部</Option>
          </Select>
        </div>
        <div className={styles.queryEnabled}>
          <span className={styles.queryLabel}>启用状态：</span>
          <Select value={this.state.searchParams.active} onChange={this.queryEnabled}>
            <Option value={0}>启用</Option>
            <Option value={1}>禁用</Option>
            <Option value={2}>全部</Option>
          </Select>
        </div>

        <div className={styles.btnContainer}>
          <Button onClick={this.getTableList} type="primary">查询</Button>
          <Button onClick={this.reset} icon="redo" className={styles.resetBtn}>重置</Button>
        </div>
      </div>
      <div className={styles.operationAssets}>
        <div className={styles.add}>
          <Link to="/system/account/add"><Button type="primary">+ 新增账号</Button></Link>
        </div>
        <div className={styles.del}>
          {
            this.state.selectedRowKeys.length > 0
              ? (
                <>
                  {/* <Icon type={`anticon-delete ${styles.iconActive}`} ></Icon> */}
                  <Icon type="delete" className={styles.iconActive} />
                  <a onClick={this.handleDelete}>批量删除</a>
                </>
              ) : (
                <>
                  {/* <Icon type={`anticon-delete ${styles.iconDisabled}`} ></Icon> */}
                  <Icon type="delete" className={styles.iconDisabled} />
                  <a disabled>批量删除</a>
                </>
              )}
        </div>
        <div className={styles.enable}>
          {
            this.state.selectedRowKeys.length > 0
              ? (
                <>
                  {/* <Icon type={`anticon-status-start ${styles.iconActive}`} ></Icon> */}
                  <Icon type="play-circle" className={styles.iconActive} />
                  <a onClick={this.handleEnable}>批量启用</a>
                </>
              ) : (
                <>
                  {/* <Icon type={`anticon-status-start ${styles.iconDisabled}`} ></Icon> */}
                  <Icon type="play-circle" className={styles.iconDisabled} />
                  <a disabled>批量启用</a>
                </>
              )}
        </div>
        <div className={styles.stop}>
          {
            this.state.selectedRowKeys.length > 0
              ? (
                <>
                  {/* <Icon type={`anticon-status-stop ${styles.iconActive}`} ></Icon> */}
                  <Icon type="stop" className={styles.iconActive} />
                  <a onClick={this.handleStop}>批量禁用</a>
                </>
              ) : (
                <>
                  {/* <Icon type={`anticon-status-stop ${styles.iconDisabled}`} ></Icon> */}
                  <Icon type="stop" className={styles.iconDisabled} />
                  <a disabled>批量禁用</a>
                </>
              )}
        </div>

      </div>
    </div>

  );

  onPageChange = (current, pageSize) => {
    this.handleTableChange({ current, pageSize }, {}, {});
  };

  onShowSizeChange = (current, pageSize) => {
    this.handleTableChange({ current, pageSize }, {}, {});
  };

  // 编辑账号
  handleEdit= (val) => {
    this.setState({
      modalVisible: true,
      editXq: {
        userId: val.id,
        userName: val.username,
        initialRoleIdValue: val.roleId,
        initialRoleNameValue: val.roleName
      }
    });
  };

  // 删除账号
  handleDelete = (val) => {
    const { id } = val;
    let ids;
    let userName;
    if (this.state.selectedRowKeys.length > 0) {
      ids = this.state.selectedRowKeys;
      userName = '';
    } else {
      ids = [id];
      userName = val.username;
    }
    this.setState({
      deleteModelVisible: true,
      delIds: ids,
      delUserName: userName
    });
  };

  delAccount = () => {
    const { delAccount } = this.props;
    const data = {
      userIdlist: this.state.delIds
    };
    delAccount(data).then((res) => {
      message.success('删除成功');
      this.setState({
        deleteModelVisible: false
      });
      this.getTableList();
    });
  };

  handleDelCancel = () => {
    this.setState({
      deleteModelVisible: false,
      delIds: [],
      delUserName: ''
    });
  };

  // 禁用账号
  handleStop= (val) => {
    const { id } = val;
    let ids;
    let userName;
    if (this.state.selectedRowKeys.length > 0) {
      ids = this.state.selectedRowKeys;
      userName = '';
    } else {
      ids = [id];
      userName = val.username;
    }
    console.log('handleStop', ids);
    this.setState({
      stopModelVisible: true,
      stopIds: ids,
      stopUserName: userName
    });
  };

  stopAccount = () => {
    const { stopAccount } = this.props;
    const data = {
      userIdArr: this.state.stopIds,
      isActive: false
    };
    stopAccount(data).then((res) => {
      message.success('禁用成功');
      this.setState({
        stopModelVisible: false,
        selectedRowKeys: []
      });
      this.getTableList();
    });
  };

  handleStopCancel = () => {
    this.setState({
      stopModelVisible: false,
      stopIds: [],
      stopUserName: ''
    });
  };

  // 启用账号
  handleEnable = (val) => {
    const { id } = val;
    let ids;
    let userName;
    if (this.state.selectedRowKeys.length > 0) {
      ids = this.state.selectedRowKeys;
      userName = '';
    } else {
      ids = [id];
      userName = val.username;
    }
    console.log('handleEnable', ids);
    this.setState({
      enableModelVisible: true,
      enableIds: ids,
      enableUserName: userName
    });
  };

  enableAccount = () => {
    const { stopAccount } = this.props;
    const data = {
      userIdArr: this.state.enableIds,
      isActive: true
    };
    stopAccount(data).then((res) => {
      message.success('启用成功');
      this.setState({
        enableModelVisible: false,
        selectedRowKeys: []
      });
      this.getTableList();
    });
  };

  handleEnableCancel = () => {
    this.setState({
      enableModelVisible: false,
      enableIds: [],
      enableUserName: ''
    });
  };

  // 重置密码
  handlePassword = (val) => {
    this.props.form.resetFields();
    this.setState({
      pswModalVisible: true,
      pswXq: {
        userId: val.id,
        userName: val.username,
        rentPassword: '',
        reNewPassword: ''
      },
      isTooltipShow: true,
    });
  };

  handleRoleChange = (value) => {
    console.log(`selected role ${value}`);
  };

  handleRoleSearch = (value) => {
    console.log('search:', value);
  };

  updatePassword = () => {
    const { updatePassword } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log('重置密码的values', values);
        const data = {
          rentpassword: values.rentpassword,
          renewpassword: values.reNewPassword,
          useridlist: [this.state.pswXq.userId]
        };
        updatePassword(data).then(
          (res) => {
            message.success('重置密码成功');
            this.setState({
              pswModalVisible: false
            });
            this.getTableList();
          }
        );
      }
    });
  };

  handlePswCancel = () => {
    this.setState({
      pswModalVisible: false
    });
  };

  reNewPswChange = () => {
    this.setState({
      isTooltipShow: false
    });
  };

  renderTable = () => {
    const {
      // eslint-disable-next-line max-len
      selectedRowKeys, total, pageSize, pageNum, loading, accountData, roleData, editXq, pswXq, isTooltipShow
    } = this.state;
    const {
      // eslint-disable-next-line max-len
      delIds, deleteModelVisible, delUserName, stopIds, stopModelVisible, stopUserName, enableIds, enableModelVisible, enableUserName
    } = this.state;
    const delIdsLength = delIds.length;
    const stopIdsLength = stopIds.length;
    const enableIdsLength = enableIds.length;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const tailFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18, offset: 6, },
    };
    // let pagination;
    // // eslint-disable-next-line prefer-const
    // pagination = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   total: Number(total),
    //   pageSize: Number(pageSize),
    //   defaultCurrent: 1,
    //   current: Number(pageNum),
    //   hideOnSinglePage: false
    // };
    // pagination.onChange = this.onPageChange;
    // pagination.onShowSizeChange = this.onShowSizeChange;

    const columns = [
      {
        title: '用户名', // 列名称
        dataIndex: 'username', // 数据源的字段名
        ellipsis: true,
        render: text => (
          // <div title={text}>{text}</div>
          <div title={text}>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</div>
        )
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        render: (text, record) => (
          // <div title={text}>{text}</div>
          <div title={text}>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</div>
        )
      },
      {
        title: '在线状态', // 状态0 在线 1离线
        dataIndex: 'isOnline',
        render: (text, record) => (
          record.isOnline
            ? (
              <div className={styles.status}>
                <div className={styles.statusOn} />
                <span>在线</span>
              </div>
            ) : (
              <div className={styles.status}>
                <div className={styles.statusOff} />
                <span>离线</span>
              </div>
            )
        )
      },
      {
        title: '启用状态', // 0 启用 有禁用stop操作 1禁用 有启用操作
        dataIndex: 'active',
        render: (text, record) => (
          record.active
            ? (
              <div className={styles.active}>
                <Switch checked={record.active} onChange={() => this.handleStop(record)} size="small" />
                <span>已启用</span>
              </div>
            ) : (
              <div className={styles.active}>
                <Switch checked={record.active} onChange={() => this.handleEnable(record)} size="small" />
                <span>已禁用</span>
              </div>
            )
        )
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <div className={styles.operation}>
            <div>
              <a onClick={() => this.handleEdit(record)}>编辑</a>
              <div className={styles.line} />
            </div>
            <div>
              <a onClick={() => this.handleDelete(record)}>删除</a>
              <div className={styles.line} />
            </div>
            <div>
              <a onClick={() => this.handlePassword(record)}>重置密码</a>
            </div>
          </div>
        ),
      }
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange
    };
    return (
      <div className={styles['table-content']}>
        {/* <ETable
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          rowClassName={() => 'dark-row'}
          rowSelection={rowSelection}
          dataSource={accountData}
          pagination={pagination}
          onChange={this.handleTableChange}
          locale={{ emptyText: '暂无数据' }}
        /> */}
        <Table
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={accountData}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          pagination={false}
        />
        <div className={styles.paginationWrapper}>
          <span>
            总条数：
            {total}
          </span>
          <div>
            <Pagination
              total={total}
              current={pageNum}
              showSizeChanger
              showQuickJumper
              pageSize={pageSize}
              onChange={this.onPageChange}
              onShowSizeChange={this.onShowSizeChange}
            />
          </div>
        </div>
        <Modal
          title="编辑账号"
          visible={this.state.modalVisible}
          okText="保存"
          cancelText="取消"
          onOk={this.updateUser}
          onCancel={this.handleCancel}
          className={styles.editModal}
        >
          <Form horizontal="true">
            <div className={styles.editSecTitle}>基本配置</div>
            <FormItem label="用户名" {...formItemLayout} className={styles.username}>
              <div>{editXq.userName}</div>
            </FormItem>
            <div className={styles.editSecTitle}>关联权限</div>
            <FormItem label="选择角色" {...formItemLayout} className={styles.role}>
              {
                getFieldDecorator('roleId', { initialValue: editXq.initialRoleNameValue })(
                  <Select
                    placeholder="请选择角色"
                    showSearch
                    optionFilterProp="children"
                    onChange={this.handleRoleChange}
                    onSearch={this.handleRoleSearch}
                    initialValue={editXq.initialRoleNameValue}
                    // eslint-disable-next-line max-len
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {roleData.map(d => (
                      <Option key={d.value}>{d.text}</Option>
                    ))}
                  </Select>
                )
              }
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="重置密码"
          visible={this.state.pswModalVisible}
          okText="保存"
          cancelText="取消"
          onOk={this.updatePassword}
          onCancel={this.handlePswCancel}
          className={styles.pswModal}
          width="600px"
        >
          <Form horizontal="true">
            <FormItem label="用户名" {...formItemLayout} className={styles.username}>
              <div>{pswXq.userName}</div>
            </FormItem>
            <FormItem label="租户管理员密码" autoComplete="off" {...formItemLayout}>
              {getFieldDecorator('rentpassword', {
                rules: [
                  { required: true, message: '租户管理员密码不能为空！' },
                ],
                validateTrigger: 'onBlur'
              },
              { initialValue: '' })(
                <Input placeholder="请输入租户管理员密码" />
              )}
            </FormItem>
            <FormItem label="新密码" autoComplete="off" {...formItemLayout} className={isTooltipShow ? styles.passwordBpttom : styles.password}>
              {getFieldDecorator('reNewPassword', {
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
              isTooltipShow
                ? (
                  <FormItem {...tailFormItemLayout} className={styles.tooltip}>
                    <span>新密码至少包含大小写字母、数字和特殊字符，且长度为12～26位字符</span>
                  </FormItem>
                ) : ''
            }
            <FormItem label="确认密码" autoComplete="off" {...formItemLayout}>
              {getFieldDecorator('reNewPassword1',
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
        <Modal
          visible={deleteModelVisible}
          okText="确定"
          cancelText="取消"
          onOk={this.delAccount}
          onCancel={this.handleDelCancel}
          className={styles.delComfirmModal}
          width="400px"
          closable={false}
        >
          <Icon type="warning" />
          <div>{`您确定要删除${selectedRowKeys.length > 0 ? `这${delIdsLength}个账号吗？` : `账号：${delUserName}吗？`}`}</div>
        </Modal>
        <Modal
          visible={stopModelVisible}
          okText="确定"
          cancelText="取消"
          onOk={this.stopAccount}
          onCancel={this.handleStopCancel}
          className={styles.stopComfirmModal}
          width="400px"
          closable={false}
        >
          <Icon type="warning" />
          <div>{`您确定要禁用${selectedRowKeys.length > 0 ? `${stopIdsLength}个账号吗？` : `账号：${stopUserName}吗？`}`}</div>
        </Modal>
        <Modal
          visible={enableModelVisible}
          okText="确定"
          cancelText="取消"
          onOk={this.enableAccount}
          onCancel={this.handleEnableCancel}
          className={styles.enableComfirmModal}
          width="400px"
          closable={false}
        >
          <Icon type="exclamation-circle" />
          <div>{`您确定要启用${selectedRowKeys.length > 0 ? `${enableIdsLength}个账号吗？` : `账号：${enableUserName}吗？`}`}</div>
        </Modal>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.content}>
        {this.renderTableHeaders()}
        {this.renderTable()}
      </div>
    );
  }
}

Account.propTypes = {
  account: PropTypes.object.isRequired
};
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Account));
