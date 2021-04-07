/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  Select, Button, Modal, Form, Input, Switch, Icon, message, Table, Tooltip
} from 'antd';
import Pagination from 'Components/EPagination';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getAlgoTaskList
} from 'Redux/reducer/algotask';
import DeleteModal from 'Components/modals/warnModal';
import attentionPic from '@/assets/user/attention.png';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const mapStateToProps = state => ({ account: state.account });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getAlgoTaskList
  },
  dispatch
);

class AlgoTask extends Component {
  state = {
    pageData: [],
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
  }

  getTableList = () => {
    const { getAlgoTaskList } = this.props;
    const { active, isOnline } = this.state.searchParams;
    const data = {
      pageSize: 10,
      pageNo: 0
    };
    this.setState({
      loading: true
    });
    getAlgoTaskList(data).then((res) => {
      this.setState({
        pageData: res
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
      selectedRowKeys: [],
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    }, () => this.getTableList());
  };

  // 提交编辑用户的表单
  updateUser = () => {
    const { updateUser } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (values.roleId) {
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
      }
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  validatorRePsw = (rule, value, callback) => {
    if (!(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?_~.]).{12,26}$/.test(value)) && value) {
      callback(new Error('新密码至少包含大小写字母、数字和特殊字符(!@#$%^&*?_~.)，且长度为12～26位字符！'));
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
          <span className={styles.queryLabel}>摄像头ID：</span>
          <Input placeholder="请输入摄像头ID" onChange={this.queryUserName} value={this.state.searchParams.userName} />
        </div>
        <div className={styles.queryRoleName}>
          <span className={styles.queryLabel}>摄像头名称：</span>
          <Input placeholder="摄像头名称" onChange={this.queryRoleName} value={this.state.searchParams.roleName} />
        </div>
        <div className={styles.queryStatus}>
          <span className={styles.queryLabel}>租户名称：</span>
          <Select value={this.state.searchParams.isOnline} onChange={this.queryStatus}>
            <Option value={2}>全部</Option>
            <Option value={0}>在线</Option>
            <Option value={1}>离线</Option>
          </Select>
        </div>
        <div className={styles.queryEnabled}>
          <span className={styles.queryLabel}>算法名称：</span>
          <Select value={this.state.searchParams.active} onChange={this.queryEnabled}>
            <Option value={2}>全部</Option>
            <Option value={0}>启用</Option>
            <Option value={1}>禁用</Option>
          </Select>
        </div>

        <div className={styles.btnContainer}>
          <Button onClick={() => this.setState({ pageNum: 1 }, () => { this.getTableList(); })} type="primary">查询</Button>
          <Button onClick={this.reset} icon="redo" className={styles.resetBtn}>重置</Button>
        </div>
      </div>
      <div className={styles.operationAssets}>
        <div className={styles.add}>
          <Link to="/system/account/add"><Button>批量取消</Button></Link>
        </div>
      </div>
    </div>

  );

  showTotal = total => (<span className={styles.totalText}>{`总条数： ${total}`}</span>);

  onPageChange = (current, pageSize) => {
    this.handleTableChange({ current, pageSize }, {}, {});
  };


  // 编辑账号
  handleEdit= (val) => {
    const {
      form: { setFieldsValue }
    } = this.props;
    this.setState({
      modalVisible: true,
      editXq: {
        userId: val.id,
        userName: val.username,
        initialRoleIdValue: val.roleId,
        initialRoleNameValue: val.roleName
      }
    });
    setFieldsValue({
      roleId: val.roleName
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
        deleteModelVisible: false,
        selectedRowKeys: []
      });
      this.getTableList();
    });
  };

  handleDelCancel = () => {
    this.setState({
      deleteModelVisible: false,
      selectedRowKeys: []
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
    const {
      form: { setFieldsValue }
    } = this.props;
    setFieldsValue({
      roleId: value
    });
  };


  updatePassword = () => {
    const { updatePassword } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (!errors.rentpassword && !errors.reNewPassword && !errors.reNewPassword1 && errors.roleId.errors.length === 1) {
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
      selectedRowKeys, pageData
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const tailFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18, offset: 6, },
    };
    const pswFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const pswTailFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16, offset: 8, },
    };

    const columns = [
      {
        title: '摄像头ID', // 列名称
        dataIndex: 'deviceId', // 数据源的字段名
        render: (text) => {
          if (text.toString().length > 10) {
            return (
              <Tooltip title={text}>
                <span className={styles.toolPointer}>{`${text.toString().substring(0, 10)}...`}</span>
              </Tooltip>
            );
          }
          return <span>{text.toString()}</span>;
        },
      },
      {
        title: '摄像头名称',
        dataIndex: 'deviceName',
        render: (text) => {
          if (text && text.length > 10) {
            return (
              <Tooltip title={text}>
                <span className={styles.toolPointer}>{`${text.substring(0, 10)}...`}</span>
              </Tooltip>
            );
          }
          return <span>{text}</span>;
        },
      },
      {
        title: '算法名称',
        dataIndex: 'algorithmName',
        render: (text) => {
          if (text.length > 10) {
            return (
              <Tooltip title={text}>
                <span className={styles.toolPointer}>{`${text.substring(0, 10)}...`}</span>
              </Tooltip>
            );
          }
          return <span>{text.substring(0, 10)}</span>;
        },
      },
      {
        title: '算法类型',
        dataIndex: 'taskType',
        // render: (text) => {
        //   if (text.length > 10) {
        //     return (
        //       <Tooltip title={text}>
        //         <span className={styles.toolPointer}>{`${text.substring(0, 10)}...`}</span>
        //       </Tooltip>
        //     );
        //   }
        //   return <span>{text.substring(0, 10)}</span>;
        // },
      },
      {
        title: '算法状态',
        key: 'taskStatus',
        // render: (text) => {
        //   if (text.length > 10) {
        //     return (
        //       <Tooltip title={text}>
        //         <span className={styles.toolPointer}>{`${text.substring(0, 10)}...`}</span>
        //       </Tooltip>
        //     );
        //   }
        //   return <span>{text.substring(0, 10)}</span>;
        // },
      },
      {
        title: '任务状态',
        dataIndex: 'dispatchStatus',
        // render: (text) => {
        //   if (text.length > 10) {
        //     return (
        //       <Tooltip title={text}>
        //         <span className={styles.toolPointer}>{`${text.substring(0, 10)}...`}</span>
        //       </Tooltip>
        //     );
        //   }
        //   return <span>{text.substring(0, 10)}</span>;
        // },
      },
      {
        title: '租户名称',
        dataIndex: 'tenantName',
        // render: (text) => {
        //   if (text.length > 10) {
        //     return (
        //       <Tooltip title={text}>
        //         <span className={styles.toolPointer}>{`${text.substring(0, 10)}...`}</span>
        //       </Tooltip>
        //     );
        //   }
        //   return <span>{text.substring(0, 10)}</span>;
        // },
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange
    };
    return (
      <div>
        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            rowKey={record => record.tid}
            dataSource={pageData.list}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
            pagination={false}
          />
        </div>
        <div className={styles.paginationWrapper}>
          {/* <Pagination
            total={pageData.pageTotal}
            current={pageData.pageNo}
            pageSize={pageData.pageSize}
            onChange={this.onPageChange}
            onShowSizeChange={this.onPageChange}
            hideOnSinglePage={false}
            showSizeChanger
            showQuickJumper
            showTotal={this.showTotal}
          /> */}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.userContent}>
        {this.renderTableHeaders()}
        {this.renderTable()}
      </div>
    );
  }
}

AlgoTask.propTypes = {
};
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AlgoTask));
