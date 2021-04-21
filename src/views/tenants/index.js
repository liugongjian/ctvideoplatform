/* eslint-disable no-nested-ternary */
import React, { Component, Fragment } from 'react';
import {
  Table, Input, Divider, Tabs, Switch, message, Modal, Button
} from 'antd';
import Pagination from 'Components/EPagination';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getTenantsList, getStatis, activeTenants, getLicenceList, resetTenantPassword, deleteTenant
} from '@/redux/reducer/platform';
import { urlPrefix } from '@/constants/Dictionary';
import warnPic from '@/assets/role/warn.png';
import InnerTable from './components';


import 'antd/dist/antd.css';
import styles from './index.less';

const { TabPane } = Tabs;


const mapStateToProps = state => ({ role: state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getTenantsList, getStatis, activeTenants, getLicenceList, resetTenantPassword, deleteTenant
  },
  dispatch
);


class Tenants extends Component {
  state = {
    tenantsData: {},
    statis: {},
    licenseData: [],
    licenseDate: '',
    modalVisible: false,
    resetPwdTenant: null,
    newPwd: null,
    deleteTenant: null,
  };

  componentDidMount() {
    this.initDatas();
  }


  initDatas = () => {
    const { getLicenceList, getTenantsList, getStatis } = this.props;
    getStatis().then((res) => {
      this.setState({ statis: res });
    });
    getTenantsList({ pageNo: 0, pageSize: 10 }).then((res) => {
      console.log('tenantdata:', res);
      this.setState({ tenantsData: res });
    });
    getLicenceList().then((ld) => {
      console.log('ld', ld);
      if (ld) {
        this.setState({
          licenseData: ld.extra.algorithmInfos,
          licenseDate: ld.notAfter,
          deviceQuota: ld.extra.deviceQuota
        });
      }
    });
  }

  onPageSizeChange = (current, size) => {
    this.props.getTenantsList({
      pageNo: 0,
      pageSize: size
    }).then((data) => {
      // console.log(data);
      this.setState({ tenantsData: data });
    });
  }

  onPageNumChange = (pageNo) => {
    this.props.getTenantsList({
      pageNo: pageNo - 1,
      pageSize: this.state.tenantsData.pageSize
    }).then((data) => {
      this.setState({ tenantsData: data });
    });
  }

  handleActivate= (checked, record) => {
    const { activeTenants, getTenantsList } = this.props;
    const { id } = record;
    const ids = [id];
    activeTenants({ tenantIdArr: ids, isActive: checked }).then((res) => {
      if (res) {
        message.success('更新成功');
        getTenantsList({
          pageNo: this.state.tenantsData.pageNo,
          pageSize: this.state.tenantsData.pageSize
        }).then((data) => {
          if (data) {
            this.setState({ tenantsData: data });
          }
        });
      }
    });
  };

  onResetPassword = (record) => {
    console.log('record', record);
    this.props.resetTenantPassword(record.id).then((res) => {
      if (res) {
        this.setState({ newPwd: res });
      } else {
        this.setState({ modalVisible: false });
        message.success('重置失败，请联系管理员');
      }
    });
  }

  onDeletetenant = (record) => {
    console.log('record', record);
    this.props.deleteTenant(record.id).then((res) => {
      if (res) {
        message.success('删除成功');
      } else {
        message.error('删除失败，请联系管理员');
      }
      this.setState({ modalVisible: false, deleteTenant: null });
      this.props.getTenantsList({
        pageNo: this.state.tenantsData.pageNo,
        pageSize: this.state.tenantsData.pageSize
      }).then((data) => {
        this.setState({ tenantsData: data });
      });
    });
  }

  onCancelModal = () => {
    this.setState({ modalVisible: false });
    const that = this;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      that.setState({
        newPwd: null,
        resetPwdTenant: null,
        deleteTenant: null
      });
    }, 500);
  }

  renderModal = () => (
    <Modal
      centered
      width={412}
      visible={this.state.modalVisible}
      onCancel={this.onCancelModal}
      footer={!this.state.newPwd && [
        <Button
          key="submit"
          type="primary"
          onClick={() => (this.state.resetPwdTenant
            ? this.onResetPassword(this.state.resetPwdTenant)
            : this.onDeletetenant(this.state.deleteTenant))}
          style={{ margin: '0 0 0 5px' }}
        >
          确定
        </Button>,
        <Button key="back" style={{ margin: '0 0 0 30px' }} onClick={this.onCancelModal}>
          取消
        </Button>,
      ]}
    >
      <div className={styles.deleteModal}>
        <div>
          <div className={styles.deleteModalImg}>
            { !this.state.newPwd && (<img alt="" src={warnPic} />)}
          </div>
        </div>
        <div className={styles.deleteModalInfo}>
          <span>
            {this.state.resetPwdTenant
              ? (this.state.newPwd
                ? `重置成功！新密码为：${this.state.newPwd}`
                : '您确定要重置当前租户的密码？')
              : '您确定要删除当前用户吗？'}
          </span>
        </div>
      </div>
    </Modal>
  )

  render() {
    const {
      tenantsData, statis, licenseData, licenseDate, deviceQuota
    } = this.state;
    const columns = [
      {
        title: '租户名称',
        dataIndex: 'name',
      },
      {
        title: '设备接入额度',
        dataIndex: 'deviceQuota',
      },
      {
        title: '算法额度',
        dataIndex: 'algorithmQuota',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '启用状态',
        dataIndex: 'isActive',
        render: (text, record) => (
          <div className={styles.active}>
            <Switch checked={record.isActive} onChange={checked => this.handleActivate(checked, record)} size="small" />
            <span>{record.isActive ? '已启用' : '已禁用'}</span>
          </div>
        )
      },
      {
        title: '备注',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`/platform/tenant/${record.id}`}>
              编辑
            </Link>
            <Divider type="vertical" />
            <a onClick={() => this.setState({ resetPwdTenant: record, modalVisible: true })}>
              重置密码
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.setState({ deleteTenant: record, modalVisible: true })}>删除</a>
          </span>
        ),
      },
    ];
    const licensecolumns = [
      {
        title: '许可项',
        dataIndex: 'cnName',
        key: 'cnName'
      },
      {
        title: '额度',
        dataIndex: 'quota',
        key: 'quota'
      },
    ];
    const carditem = (title, no) => (
      <div className={styles.cardItem}>
        <p className={styles.cardItemTitle}>{title}</p>
        <p className={styles.cardItemNo}>{no}</p>
      </div>
    );
    const uploadProps = {
      showUploadList: false,
      action: `${urlPrefix}/license/upload`,
      multiple: false,
      accept: '.lic',
      onChange: (info) => {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file.response.data) {
            message.success(`${info.file.name}上传成功！`);
            this.initDatas();
          } else {
            message.error(`${info.file.name}上传失败！`);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name}上传失败！`);
        }
      },
    };
    return (
      <Fragment>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            {carditem('可接入设备额度', statis.availableDevice)}
            {carditem('已接入设备数', statis.connectedDevicesNums)}
          </div>

          <div className={styles.card}>
            {carditem('在线设备数', statis.onLineDevicesNums)}
            {carditem('离线设备数', statis.offLineDevicesNums)}
          </div>

          <div className={styles.card}>
            {carditem('算法总额度', statis.totalAlgAmount)}
            {carditem('已分配算法额度', statis.allocatedAg)}
          </div>

          <div className={styles.card}>
            {carditem('租户数', statis.rentAmount)}
          </div>
        </div>
        <div className={styles.mainWrapper}>
          <div>
            <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
              <TabPane tab="租户管理" key="1">
                <InnerTable
                  columns={columns}
                  data={tenantsData}
                  btndata={{ path: '/platform/tenant/add', name: '添加租户' }}
                  onPageSizeChange={this.onPageSizeChange}
                  onPageNumChange={this.onPageNumChange}
                />
              </TabPane>
              <TabPane tab="许可管理" key="2">
                <InnerTable
                  columns={licensecolumns}
                  data={{ list: licenseData, issued: licenseDate }}
                  btndata={{ name: '导入许可证书', deviceQuota }}
                  uploadProps={uploadProps}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>

        {this.renderModal()}

      </Fragment>
    );
  }
}

Tenants.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Tenants);
