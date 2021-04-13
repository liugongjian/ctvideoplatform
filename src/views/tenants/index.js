import React, { Component } from 'react';
import {
  Table, Input, Divider, Tabs, Switch, message
} from 'antd';
import Pagination from 'Components/EPagination';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getTenantsList, getStatis, activeTenants, getLicenceList
} from '@/redux/reducer/platform';
import { urlPrefix } from '@/constants/Dictionary';
import InnerTable from './components';


import 'antd/dist/antd.css';
import styles from './index.less';

const { TabPane } = Tabs;


const mapStateToProps = state => ({ role: state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getTenantsList, getStatis, activeTenants, getLicenceList
  },
  dispatch
);


class Tenants extends Component {
  state = {
    tenantsData: {},
    statis: {},
    licenseData: [],
    licenseDate: '',
  };

  componentDidMount() {
    const { getTenantsList, getStatis, getLicenceList } = this.props;
    getStatis().then((res) => {
      this.setState({ statis: res });
    });
    getTenantsList({ pageNo: 0, pageSize: 10 }).then((res) => {
      console.log('tenantdata:', res);
      this.setState({ tenantsData: res });
    });
    this.getLicenseTableData();
  }

  getLicenseTableData = () => {
    const { getLicenceList } = this.props;
    getLicenceList().then((ld) => {
      console.log('ld', ld);
      if (ld) {
        this.setState({ licenseData: ld.extra.algorithmInfos, licenseDate: ld.issued });
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

  render() {
    const {
      tenantsData, statis, licenseData, licenseDate
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
        dataIndex: 'address',
        key: 'address',
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
            <a>删除</a>
          </span>
        ),
      },
    ];
    const licensecolumns = [
      {
        title: 'License项',
        dataIndex: 'name',
        key: 'name'
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
          message.success(`${info.file.name}上传成功！`);
          this.getLicenseTableData();
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name}上传失败！`);
        }
      },
    };
    return (
      <>
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
              <TabPane tab="License管理" key="2">
                <InnerTable
                  columns={licensecolumns}
                  data={{ list: licenseData, issued: licenseDate }}
                  btndata={{ name: '导入Licence' }}
                  uploadProps={uploadProps}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </>
    );
  }
}

Tenants.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Tenants);
