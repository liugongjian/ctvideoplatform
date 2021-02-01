import React, { Component } from 'react';
import {
  Select, Button, Modal, Form, Input, Switch, Icon
} from 'antd';
// import Icon from 'Components/Icon';
import ETable from 'Components/ETable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getAccountList
} from 'Redux/reducer/account';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const mapStateToProps = state => ({ account: state.account });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getAccountList
  },
  dispatch
);

class Account extends Component {
  state = {
    accountData: [
      {
        id: 'inner_gB9fOjfjJ5Y',
        status: 0,
        isEnabled: 1,
        role: {
          id: 'role1',
          name: '角色1'
        },
        departmentName: '研发三部',
        departmentCode: 'yfsb',
        refUid: 'fa606bdf1f814e5aa09d887e0e4981a2',
        username: '19946281964',
        realname: '黄璐璐',
        phone: '19946281964',
        email: 'huanglulu@chinatelecom.cn',
        channelData: {
          id: 'fa606bdf1f814e5aa09d887e0e4981a2',
          userPhone: '19946281964',
          userPassword: 'af120511b45926acf177a1b37b3a3992',
          userLoginName: '19946281964',
          userRealname: '黄璐璐',
          userEmail: 'huanglulu@chinatelecom.cn',
          userJob: '0',
          fkUserDepId: 'be03fbed6c2a48239f9540a570c5ba87',
          departmentName: '研发三部',
          departmentCode: 'yfsb',
          departmentType: '0'
        },
        createdTime: '2020-04-28T09:36:05.626Z',
        lastUpdatedTime: '2021-01-27T10:23:49.343Z',
        lastLoginTime: '2021-01-27T10:23:49.340Z'
      },
      {
        id: 'inner_n5VEu5Jl5lN',
        status: 0,
        isEnabled: 0,
        role: {
          id: 'role2',
          name: '角色2'
        },
        departmentName: '研发三部',
        departmentCode: 'yfsb',
        refUid: 'c7a4287fb0f3498fabe6cd9553ac6dd5',
        username: '13384925459',
        realname: '胡佳婷',
        phone: '13384925459',
        email: 'hujt@chinatelecom.cn',
        channelData: {
          id: 'c7a4287fb0f3498fabe6cd9553ac6dd5',
          userPhone: '13384925459',
          userPassword: '8b016e7dd2a57f502495677442ed9508',
          userLoginName: '13384925459',
          userRealname: '胡佳婷',
          userEmail: 'hujt@chinatelecom.cn',
          userJob: '0',
          fkUserDepId: 'be03fbed6c2a48239f9540a570c5ba87',
          departmentName: '研发三部',
          departmentCode: 'yfsb',
          departmentType: '0'
        },
        createdTime: '2020-04-28T09:35:54.891Z',
        lastUpdatedTime: '2021-01-27T06:39:00.529Z',
        lastLoginTime: '2021-01-27T06:39:00.526Z'
      },
      {
        id: 'inner_vQwj0g-JEa',
        status: 0,
        isEnabled: 1,
        role: {
          id: 'role3',
          name: '管理员'
        },
        departmentName: '省公司独立运维组',
        departmentCode: 'SDLYUW',
        refUid: 'fdb62b7d0d544f94a2852e4aeb0fa8b0',
        username: '17326597320',
        realname: '陈建跃-福建',
        phone: '17326597320',
        email: 'fjchenjy@chinatelecom.cn',
        channelData: {
          id: 'fdb62b7d0d544f94a2852e4aeb0fa8b0',
          userPhone: '17326597320',
          userPassword: 'f764e62fa8a0f9464c78314e78bc19d6',
          userLoginName: '17326597320',
          userRealname: '陈建跃-福建',
          userEmail: 'fjchenjy@chinatelecom.cn',
          userJob: null,
          fkUserDepId: '008ef3de5c9a4cfd891473e364fb52dd',
          departmentName: '省公司独立运维组',
          departmentCode: 'SDLYUW',
          departmentType: '0'
        },
        createdTime: '2020-10-16T16:00:09.035Z',
        lastUpdatedTime: '2021-01-26T16:00:09.721Z',
        lastLoginTime: '2020-10-16T16:00:09.034Z'
      },
      {
        id: 'inner_7uTkb6coWS',
        status: 1, // 0代表在线 1代表离线
        isEnabled: 0,
        role: {
          id: 'role4',
          name: '审核员'
        },
        departmentName: '天翼云西南中心',
        departmentCode: 'tyyxnzx',
        refUid: 'fd8fbf8f2dd54e959f7a619a3a991fd4',
        username: '18987959916',
        realname: '侯博君',
        phone: '18987959916',
        email: '18987959916@189.cn',
        channelData: {
          id: 'fd8fbf8f2dd54e959f7a619a3a991fd4',
          userPhone: '18987959916',
          userPassword: 'a01e41dbda8087f5230c37bda89e3722',
          userLoginName: '18987959916',
          userRealname: '侯博君',
          userEmail: '18987959916@189.cn',
          userJob: '0',
          fkUserDepId: '98056255559c44288d725f327f0840e7',
          departmentName: '天翼云西南中心',
          departmentCode: 'tyyxnzx',
          departmentType: '0'
        },
        createdTime: '2020-04-28T09:36:06.284Z',
        lastUpdatedTime: '2021-01-26T16:00:09.710Z',
        lastLoginTime: '2020-07-24T01:57:50.226Z'
      }
    ],
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
      isEnabled: 2,
      status: 2
    }, // 模糊搜索
    selectedRowKeys: [],
    total: 0,
    pageSize: 10,
    pageNum: 1,
    editXq: {
      userName: '一开始的用户名',
      initialRoleValue: 'role4'
    },
    pswXq: {
      userId: '',
      userName: '',
      rentPassword: '',
      reNewPassword: ''
    },
    isTooltipShow: true,
    roleData: [
      {
        value: 'role1',
        text: '角色1'
      },
      {
        value: 'role2',
        text: '角色2'
      },
      {
        value: 'role3',
        text: '管理员'
      },
      {
        value: 'role4',
        text: '审核员'
      }
    ]
  };

  componentDidMount() {
    this.getTableList();
    this.getRoleList();
  }

  getTableList = () => {
    const { getAccountList } = this.props;
    const params = {
      userName: this.state.searchParams.userName,
      roleName: this.state.searchParams.roleName,
      pageSize: this.state.pageSize,
      pageNum: this.state.pageNum
    };
    const data = {
      isEnabled: this.state.searchParams.isEnabled,
      status: this.state.searchParams.status,
    };
    console.log('获取列表数据', params, data);
    this.setState({
      isTableLoading: true
    });
    getAccountList(params).then((res) => {
      console.log('>>>>>>>', res);
    });
  };

  getRoleList = () => {
    console.log('获取不分页的角色列表');
  };

  handleRowSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    });
    this.getTableList();
  };

  // 新增用户按钮 跳转到新增账号页面
  handleAddUser = () => {
    console.log('>>>>跳转到新增账号页面');
  };

  // 提交编辑用户的表单
  updateUser = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log('编辑用户的values', values);
        // const userId = this.state.editXq.userId
        // delete values.reNewPassword
        // delete values.reNewPassword1
        // delete values.rentpassword
        // editUsers(this.state.editUserId, values).then(
        //   res => {
        //     if(res.code === 200) {
        //       message.success('修改成功');
        //       this.setState({
        //         modalVisible: false
        //       })
        //       this.getUserList()
        //     }else {
        //       message.warning(res.msg)
        //     }
        //   }
        // )
      } else {
        // message.warning('表单验证错误');
      }
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  validatorRePsw = (rule, value, callback) => {
    const reNewPassword2 = this.props.form.getFieldValue('reNewPassword2');
    if (reNewPassword2 && reNewPassword2 !== value && value) {
      callback(new Error('两次密码输入不一致！'));
    } else if (!(/^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])(.{12,26})/.test(value)) && value) {
      callback(new Error('新密码至少包含大小写字母、数字和特殊字符，且长度为12～26位字符！'));
    } else {
      callback();
    }
  };

  validatorRePsw2 = (rule, value, callback) => {
    const reNewPassword = this.props.form.getFieldValue('reNewPassword');
    if (reNewPassword && reNewPassword !== value && value) {
      callback(new Error('两次密码输入不一致！'));
    } else if (!(/^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])(.{12,26})/.test(value)) && value) {
      callback(new Error('确认密码至少包含大小写字母、数字和特殊字符，且长度为12～26位字符！'));
    } else {
      callback();
    }
  };

  reset = () => {
    // 头部搜索条件的置空
    this.setState({
      searchParams: {
        isEnabled: undefined,
        status: undefined
      },
    });
    this.props.form.resetFields();
    this.getTableList();
  };

  queryUserName = (e) => {
    console.log('用户名模糊搜索', e, e.target.value.trim());
    this.setState({
      searchParams: {
        userName: e.target.value.trim()
      }
    });
  };

  queryRoleName = (e) => {
    console.log('角色名称模糊搜索', e, e.target.value.trim());
    this.setState({
      searchParams: {
        roleName: e.target.value.trim()
      }
    });
  };

  queryEnabled = (val) => {
    console.log('是否启用筛选', val);
    this.setState({
      searchParams: {
        isEnabled: val
      }
    });
  };

  queryStatus = (val) => {
    console.log('状态筛选', val);
    this.setState({
      searchParams: {
        status: val
      }
    });
  };

  renderTableHeaders = () => (
    <div>
      <div className={styles.query}>
        <div className={styles.queryUserName}>
          <span className={styles.queryLabel}>用户名：</span>
          <Input placeholder="请输入用户名" onChange={this.queryUserName} />
        </div>
        <div className={styles.queryRoleName}>
          <span className={styles.queryLabel}>角色名称：</span>
          <Input placeholder="请输入角色名称" onChange={this.queryRoleName} />
        </div>
        <div className={styles.queryStatus}>
          <span className={styles.queryLabel}>在线状态：</span>
          <Select defaultValue={2} onChange={this.queryStatus}>
            <Option value={0}>在线</Option>
            <Option value={1}>离线</Option>
            <Option value={2}>全部</Option>
          </Select>
        </div>
        <div className={styles.queryEnabled}>
          <span className={styles.queryLabel}>启用状态：</span>
          <Select defaultValue={2} onChange={this.queryEnabled}>
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
          <Button icon="plus" onClick={this.handleAddUser} type="primary">新增账号</Button>
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
    console.log('handleEdit');
    this.setState({
      modalVisible: true,
      editXq: {
        userId: val.id,
        userName: val.username,
        initialRoleValue: val.role.id
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
    console.log('handleDelete', ids);
    this.setState({
      deleteModelVisible: true,
      delIds: ids,
      delUserName: userName
    });
    // Modal.confirm({
    //   title: '删除账号',
    //   content: `确定要删除账号：${val.username}吗?`,
    //   onOk() {
    //     // self.props.delFunc(key).then((res) => {
    //     //   message.success('删除成功');
    //     //   self.props.refresh();
    //     // });
    //   },
    //   onCancel() {},
    // });
  };

  delAccount = () => {
    // self.props.delAccount(this.state.delIds).then((res) => {
    //   message.success('删除成功');
    //   self.props.refresh();
    // });

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
    // self.props.stopAccount(this.state.delIds).then((res) => {
    //   message.success('禁用成功');
    //   self.props.refresh();
    // });
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
    // self.props.enableAccount(this.state.delIds).then((res) => {
    //   message.success('启用成功');
    //   self.props.refresh();
    // });
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
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log('重置密码的values', values);
        // const userId = this.state.pswXq.userId
        // delete values.roleId
        // delete values.reNewPassword1
        // editUsers(this.state.editUserId, values).then(
        //   res => {
        //     if(res.code === 200) {
        //       message.success('修改成功');
        //       this.setState({
        //         modalVisible: false
        //       })
        //       this.getUserList()
        //     }else {
        //       message.warning(res.msg)
        //     }
        //   }
        // )
      } else {
        // message.warning('表单验证错误');
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
    // eslint-disable-next-line max-len
    const {
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
    let pagination;
    // eslint-disable-next-line prefer-const
    pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: Number(total),
      pageSize: Number(pageSize),
      defaultCurrent: 1,
      current: Number(pageNum),
      hideOnSinglePage: false
    };
    pagination.onChange = this.onPageChange;
    pagination.onShowSizeChange = this.onShowSizeChange;

    const columns = [
      {
        title: '用户名', // 列名称
        dataIndex: 'username', // 数据源的字段名
        render: text => (
          <div title={text}>{text}</div>
        )
      },
      {
        title: '角色名称',
        dataIndex: 'role',
        render: (text, record) => (
          <div title={record.role.name}>{record.role.name}</div>
        )
      },
      {
        title: '在线状态', // 状态0 在线 1离线
        dataIndex: 'status',
        render: (text, record) => (
          record.isEnabled === 0
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
        dataIndex: 'isEnabled',
        render: (text, record) => (
          record.isEnabled === 0
            ? (
              <div className={styles.isEnabled}>
                <Switch defaultChecked onChange={() => this.handleStop(record)} size="small" />
                <span>已启用</span>
              </div>
            ) : (
              <div className={styles.isEnabled}>
                <Switch defaultChecked={false} onChange={() => this.handleEnable(record)} size="small" />
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
        <ETable
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          rowClassName={() => 'dark-row'}
          rowSelection={rowSelection}
          dataSource={accountData}
          pagination={pagination}
          onChange={this.handleTableChange}
          locale={{ emptyText: '暂无数据' }}
        />
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
                getFieldDecorator('role', { initialValue: editXq.initialRoleValue })(
                  <Select
                    placeholder="请选择角色"
                    showSearch
                    optionFilterProp="children"
                    onChange={this.handleRoleChange}
                    onSearch={this.handleRoleSearch}
                    initialValue={editXq.initialRoleValue}
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
          <div>{`您确定要删除${selectedRowKeys.length > 0 ? `${delIdsLength}个账号吗？` : `账号：${delUserName}吗？`}`}</div>
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
