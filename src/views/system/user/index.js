import React, { Component } from 'react';
import {
  Select, Button, Modal, Form, Input, Icon
} from 'antd';
import ETable from 'Components/ETable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
    getAccountList, 
} from 'Redux/reducer/account';

import styles from './index.less';
import copy from 'copy-to-clipboard'
const FormItem = Form.Item;
const Option = Select.Option;

const mapStateToProps = state => ({ account: state.account });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAccountList, 
  },
  dispatch
);

class Account extends Component {
  state = {
    accountData: [
            {
              "id": "inner_gB9fOjfjJ5Y",
              "status": 0,
              "isEnabled": 1,
              "role": "角色1",
              "departmentName": "研发三部",
              "departmentCode": "yfsb",
              "refUid": "fa606bdf1f814e5aa09d887e0e4981a2",
              "username": "19946281964",
              "realname": "黄璐璐",
              "phone": "19946281964",
              "email": "huanglulu@chinatelecom.cn",
              "channelData": {
                "id": "fa606bdf1f814e5aa09d887e0e4981a2",
                "userPhone": "19946281964",
                "userPassword": "af120511b45926acf177a1b37b3a3992",
                "userLoginName": "19946281964",
                "userRealname": "黄璐璐",
                "userEmail": "huanglulu@chinatelecom.cn",
                "userJob": "0",
                "fkUserDepId": "be03fbed6c2a48239f9540a570c5ba87",
                "departmentName": "研发三部",
                "departmentCode": "yfsb",
                "departmentType": "0"
              },
              "createdTime": "2020-04-28T09:36:05.626Z",
              "lastUpdatedTime": "2021-01-27T10:23:49.343Z",
              "lastLoginTime": "2021-01-27T10:23:49.340Z"
            },
            {
              "id": "inner_n5VEu5Jl5lN",
              "status": 0,
              "isEnabled": 0,
              "role": "角色2",
              "departmentName": "研发三部",
              "departmentCode": "yfsb",
              "refUid": "c7a4287fb0f3498fabe6cd9553ac6dd5",
              "username": "13384925459",
              "realname": "胡佳婷",
              "phone": "13384925459",
              "email": "hujt@chinatelecom.cn",
              "channelData": {
                "id": "c7a4287fb0f3498fabe6cd9553ac6dd5",
                "userPhone": "13384925459",
                "userPassword": "8b016e7dd2a57f502495677442ed9508",
                "userLoginName": "13384925459",
                "userRealname": "胡佳婷",
                "userEmail": "hujt@chinatelecom.cn",
                "userJob": "0",
                "fkUserDepId": "be03fbed6c2a48239f9540a570c5ba87",
                "departmentName": "研发三部",
                "departmentCode": "yfsb",
                "departmentType": "0"
              },
              "createdTime": "2020-04-28T09:35:54.891Z",
              "lastUpdatedTime": "2021-01-27T06:39:00.529Z",
              "lastLoginTime": "2021-01-27T06:39:00.526Z"
            },
            {
              "id": "inner_vQwj0g-JEa",
              "status": 0,
              "isEnabled": 1,
              "role": "角色21",
              "departmentName": "省公司独立运维组",
              "departmentCode": "SDLYUW",
              "refUid": "fdb62b7d0d544f94a2852e4aeb0fa8b0",
              "username": "17326597320",
              "realname": "陈建跃-福建",
              "phone": "17326597320",
              "email": "fjchenjy@chinatelecom.cn",
              "channelData": {
                "id": "fdb62b7d0d544f94a2852e4aeb0fa8b0",
                "userPhone": "17326597320",
                "userPassword": "f764e62fa8a0f9464c78314e78bc19d6",
                "userLoginName": "17326597320",
                "userRealname": "陈建跃-福建",
                "userEmail": "fjchenjy@chinatelecom.cn",
                "userJob": null,
                "fkUserDepId": "008ef3de5c9a4cfd891473e364fb52dd",
                "departmentName": "省公司独立运维组",
                "departmentCode": "SDLYUW",
                "departmentType": "0"
              },
              "createdTime": "2020-10-16T16:00:09.035Z",
              "lastUpdatedTime": "2021-01-26T16:00:09.721Z",
              "lastLoginTime": "2020-10-16T16:00:09.034Z"
            },
            {
              "id": "inner_7uTkb6coWS",
              "status": 1,//0代表在线 1代表离线
              "isEnabled": 0,
              "role": "角色2",
              "departmentName": "天翼云西南中心",
              "departmentCode": "tyyxnzx",
              "refUid": "fd8fbf8f2dd54e959f7a619a3a991fd4",
              "username": "18987959916",
              "realname": "侯博君",
              "phone": "18987959916",
              "email": "18987959916@189.cn",
              "channelData": {
                "id": "fd8fbf8f2dd54e959f7a619a3a991fd4",
                "userPhone": "18987959916",
                "userPassword": "a01e41dbda8087f5230c37bda89e3722",
                "userLoginName": "18987959916",
                "userRealname": "侯博君",
                "userEmail": "18987959916@189.cn",
                "userJob": "0",
                "fkUserDepId": "98056255559c44288d725f327f0840e7",
                "departmentName": "天翼云西南中心",
                "departmentCode": "tyyxnzx",
                "departmentType": "0"
              },
              "createdTime": "2020-04-28T09:36:06.284Z",
              "lastUpdatedTime": "2021-01-26T16:00:09.710Z",
              "lastLoginTime": "2020-07-24T01:57:50.226Z"
            }
    ],
    dialogVisible: false,   // 对话框显示标志
    dialogStatus: 'create',   // 判断是新增还是编辑的对话框
    textMap: {
        update: '编辑账号',
        create: '新建账号'
    },
    loading: false,             // 账号列表加载状态
    // loginUserId: Cookies.get('uid'), // 登录用户的uid
    searchParams: {
        userName: '',
        roleName: '',
        isEnabled: 2,
        status: 2
    }, //模糊搜索
    selectedRowKeys: [],
    total: 0,
    pageSize: 10,
    pageNum: 1,
    username: '', //编辑用户时 拿到的用户名字
    password: ''//编辑用户时 拿到的用户密码
  }

  componentDidMount() {
    this.getTableList();
  }
  getTableList = () => {
    const params = {
      userName: this.state.searchParams.userName,
      roleName: this.state.searchParams.roleName,
      pageSize: this.state.pageSize,
      pageNum: this.state.pageNum
    }
    const data = {
      isEnabled: this.state.searchParams.isEnabled,
      status: this.state.searchParams.status,
    }
    console.log('获取列表数据', params, data)
    // this.setState({
    //   isTableLoading: true
    // })
    // getAccountList(params).then((res) => {
    //     debugger
    //     console.log('>>>>>>>', res)
    // })
  }
  handleRowSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  handleTableChange = (pagination, filters, sorter) => {
      this.setState({
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      })
    this.getTableList();
  };
  // 添加用户按钮
  handleAddUser = () => {
    this.setState({
      dialogVisible: true,
    //   searchInput: '',
      dialogStatus: 'create'
    })
    this.props.form.resetFields();
  };
  // 提交添加用户的表单
  createUser = (e) => {
    this.props.form.validateFields((errors, values) => {
      if(!errors) {  
        console.log('创建用户的values', values)      
        // addUsers(values ).then(
        //   (res) => {
        //     if(res.code === 200) {
        //       message.success('创建成功！');
        //       this.setState({
        //         dialogVisible: false
        //       })
        //       this.getTableList();
        //     }else {
        //       message.error(res.msg);
        //     }
        //     this.props.form.resetFields();
        //   }
        // ).catch(err => {
        //   message.warning('创建失败')
        // })
      } else {
      }
    })
  }
   // 提交编辑用户的表单
   updateUser = () => {
    this.props.form.validateFields((errors, values) => {
      if(!errors) {
        console.log('编辑用户的values', values)
        // editUsers(this.state.editUserId, values).then(
        //   res => {
        //     if(res.code === 200) {
        //       message.success('修改成功');
        //       this.setState({
        //         dialogVisible: false
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
    })

  }
  handleCancel = () => {
    this.setState({
      dialogVisible: false
    })
  };
  validatorPsd = (rule, value, callback) => {
    let rePassword = this.props.form.getFieldValue('rePassword');
    if (rePassword && rePassword !== value) {
        callback(new Error('两次密码输入不一致！'));
    }else if(!(/^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])(.{12,26})/.test(value)) && value){
      callback(new Error('密码至少包含大小写字母、数字和特殊字符，且长度为12～26位字符！'));
    }else {
        callback();
    }
    
  };
  validatorRePsd = (rule, value, callback) => {
    let password = this.props.form.getFieldValue('password');
    if (password && password !== value && value) {
      callback(new Error('两次密码输入不一致'));
    }else if(!(/^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])(.{12,26})/.test(value)) && value){
      callback(new Error('密码至少包含大小写字母、数字和特殊字符，且长度为12～26位字符！'));
    }else {
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
      })
      this.props.form.resetFields();
      this.getTableList()
  };
  queryUserName = (e) => {
    console.log('用户名模糊搜索',e, e.target.value.trim())
    this.setState({
      searchParams: {
        userName: e.target.value.trim()
      }
    })
  };
  queryRoleName = (e) => {
    console.log('角色名称模糊搜索',e, e.target.value.trim())
    this.setState({
      searchParams: {
        roleName: e.target.value.trim()
      }
    })
  };
  queryEnabled = (val) => {
    console.log('是否启用筛选',val)
    this.setState({
      searchParams: {
        isEnabled: val
      }
    })
  };
  queryStatus = (val) => {
    console.log('状态筛选',val)
    this.setState({
      searchParams: {
        status: val
      }
    })
  };
  renderTableHeaders = () => {
    const {
        form: { getFieldDecorator },
      } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={styles.header}>
          <div className={styles.operationAssets}>
            <div className={styles.add}>
                <Button onClick={this.handleAddUser}>添加用户</Button>
                <Modal 
                  title={this.state.textMap[this.state.dialogStatus]}
                  visible={this.state.dialogVisible}
                  okText="确认"
                  cancelText="取消"
                  onOk={this.state.dialogStatus==="create"?this.createUser:this.updateUser}
                  onCancel={this.handleCancel}
                >
                  <Form horizontal="true">
                    <FormItem label="用户名" {...formItemLayout}>
                        {getFieldDecorator('username', 
                            { rules: [
                                { required: true , message: '用户名不能为空'},
                                {
                                    max: 30, message: '用户名不得超过30个字符',
                                },
                                { pattern: new RegExp(/\S/), message: '用户名不能为空'}
                            ],
                            validateTrigger: 'onBlur'},
                            { initialValue: this.state.dialogStatus === "create"?'':  this.state.username})
                            (
                              <Input placeholder="请输入用户名"  disabled={this.state.dialogStatus === "create" ? false: true}/>
                            )
                        }
                    </FormItem>
                    <FormItem label="密码" autoComplete="off" {...formItemLayout}>
                       {getFieldDecorator('password',
                          {
                            rules: [
                                { required: true, message: '请输入密码' },
                                { validator: (rule, value, callback) => { this.validatorPsd(rule, value, callback) } }
                              ],
                            validateTrigger: 'onChange'
                          },
                          { initialValue: this.state.dialogStatus === "create"?'':  this.state.password}
                        )(
                            <Input.Password placeholder="请输入密码" />
                        )}
                    </FormItem>
                    <FormItem label="确认密码" autoComplete="off" {...formItemLayout}>
                       {getFieldDecorator('rePassword',
                          {
                            rules: [
                                { required: true, message: '请确认密码' },
                                { validator: (rule, value, callback) => { this.validatorRePsd(rule, value, callback) } }
                              ],
                            validateTrigger: 'onBlur'
                          },
                          { initialValue: this.state.dialogStatus === "create"?'':  this.state.password}
                        )(
                            <Input.Password placeholder="请输入密码" />
                        )}
                    </FormItem>
                    <FormItem label="角色" {...formItemLayout}>
                        {
                            getFieldDecorator('role', { initialValue: 0})(
                                <Select initialValue={0}>
                                    <Option value={1}>管理员</Option>
                                    <Option value={0}>普通用户</Option>
                                </Select>
                            )
                        }    
                    </FormItem>
                  </Form>
                </Modal>
            </div>
            <div className={styles.del}>
                <Button onClick={this.handleDelete} disabled={this.state.selectedRowKeys.length > 0 ? false: true}>删除</Button>
            </div>
            <div className={styles.stop}>
                <Button onClick={this.handleStop} disabled={this.state.selectedRowKeys.length > 0 ? false: true}>禁用</Button>
            </div>
            <div className={styles.enable}>
                <Button onClick={this.handleEnable} disabled={this.state.selectedRowKeys.length > 0 ? false: true}>启用</Button>
            </div>
          </div>
          <div className={styles.query}>
            <div className={styles.queryUserName}>
              <span>用户名：</span>
              <Input placeholder="请输入用户名" onChange={this.queryUserName} />
            </div>
            <div className={styles.queryRoleName}>
              <span>角色名称：</span>
              <Input placeholder="请输入角色名称" onChange={this.queryRoleName}/>
            </div>
            <div className={styles.queryEnabled}  >
              <span>是否启用：</span>
              <Select defaultValue={2} onChange={this.queryEnabled}>
                <Option value={0}>启用</Option>
                <Option value={1}>禁用</Option>
                <Option value={2}>全部</Option>
              </Select>
            </div>
            <div className={styles.queryStatus}>
              <span>状态：</span>
              <Select defaultValue={2} onChange={this.queryStatus}>
                <Option value={0}>在线</Option>
                <Option value={1}>离线</Option>
                <Option value={2}>全部</Option>
              </Select>
            </div>
            <Button onClick={this.getTableList}>查询</Button>
            <Button onClick={this.reset}>重置</Button>

          </div>
      </div>

    )
  };
  onPageChange = (current, pageSize) => {
    this.handleTableChange({ current, pageSize }, {}, {});
  };

  onShowSizeChange = (current, pageSize) => {
    this.handleTableChange({ current, pageSize }, {}, {});
  };
  //删除账号
  handleDelete = (val)=> {
    const id = val.id;
    console.log('handleDelete', id)
    Modal.confirm({
      title: '删除账号',
      content: `确定要删除账号：${val.username}吗?`,
      onOk() {
        // self.props.delFunc(key).then((res) => {
        //   message.success('删除成功');
        //   self.props.refresh();
        // });
      },
      onCancel() {},
    });
  };
  //编辑账号
  handleEdit= (val)=>{
    console.log('handleEdit')
  };
  //禁用账号
  handleStop= (val)=>{
    const id = val.id;
    console.log('handleStop', id)
    Modal.confirm({
      title: '禁用账号',
      content: `确定要禁用账号：${val.username}吗?`,
      onOk() {
        // self.props.delFunc(key).then((res) => {
        //   message.success('禁用成功');
        //   self.props.refresh();
        // });
      },
      onCancel() {},
    });
  };
  //启用账号
  handleEnable = (val)=>{
    const id = val.id;
    console.log('handleEnable', id)
    Modal.confirm({
      title: '启用账号',
      content: `确定要启用账号：${val.username}吗?`,
      onOk() {
        // self.props.delFunc(key).then((res) => {
        //   message.success('启用成功');
        //   self.props.refresh();
        // });
      },
      onCancel() {},
    });
  };
  //重置密码
  handlePassword = (val)=>{
    const id = val.id;
    console.log('handleEnable', id)
    Modal.confirm({
      title: '重置密码',
      content: `确定要重置账号：${val.username}的密码吗?`,
      onOk() {
        // resetPassword(uid).then(
        //   res => {
        //     if(res.code === 200) {
        //       Modal.success({
        //         content: `该账号新密码为：${res.data.password}`,
        //         okText: "复制密码",
        //         onOk(){
        //           copy(res.data.password);
        //           message.success('密码已复制到剪切板');
        //         }
        //       });
        //     }else{
        //       message.warning(res.msg);
        //     }
        //   }
        // )
      },
      onCancel() {},
    });
      
  };  
  renderTable = () => {
    const { selectedRowKeys,total, pageSize,pageNum,loading, accountData} = this.state;
    let pagination;
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
          title: '用户名',         //列名称
          dataIndex: 'username',      //数据源的字段名
          render:(text)=>{
              return (
                <div title={text}>{text}</div>
              )
          }
        },
        {
          title: '角色名称',
          dataIndex: 'role',
          render:(text)=>{
              return (
                <div title={text}>{text}</div>
              )
          }
        },
        {
          title: '是否启用',//0 启用 有禁用stop操作 1禁用 有启用操作
          dataIndex: 'isEnabled',
          render:(text, record)=>(
            record.isEnabled == 0 ? <div >启用</div>: <div >禁用</div>
          )
        },
        {
          title: '状态', //状态0 在线 1离线 
          dataIndex: 'status',
          render:(text, record)=>(
            record.isEnabled == 0 ? <div >在线</div>: <div >离线</div>
          )
        },
        {
          title: '操作',
          key: 'operation',
          render: (text, record) => (
            <div className={styles.operation}>
                <span onClick={()=>this.handleDelete(record)}><Icon type="delete" /></span>
                <span onClick={()=>this.handleEdit(record)}><Icon type="edit" /></span>
                {record.isEnabled === 0 ? <span onClick={()=>this.handleStop(record)}><Icon type="stop" /></span>: <span onClick={()=>this.handleEnable(record)}><Icon type="check-circle" /></span>}
                <span onClick={()=>this.handlePassword(record)}><Icon type="lock" /></span>
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
