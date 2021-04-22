/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  Select, Button, Modal, Form, Input, Switch, Icon, message, Table, Tooltip, Divider
} from 'antd';
import Pagination from 'Components/EPagination';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getAlgoTaskList, getAlgoTaskDetail
} from 'Redux/reducer/algotask';
import DeleteModal from 'Components/modals/warnModal';
import attentionPic from '@/assets/user/attention.png';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const mapStateToProps = state => ({ account: state.account });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getAlgoTaskList, getAlgoTaskDetail
  },
  dispatch
);

class AlgoTask extends Component {
  state = {
    pageData: {
      recordsTotal: 0,
      pageNo: 0,
      pageSize: 0,
      list: []
    },
    searchParams: {
      deviceId: '',
      deviceName: '',
      tenantId: '',
      algorithmId: '',
    }, // 模糊搜索
    selectedRowKeys: [],
    detailModalVisible: false,
    detailData: null,
  };

  componentDidMount() {
    this.getTableList(1, 10);
  }

  getTableList = (pageNo, pageSize) => {
    const { getAlgoTaskList } = this.props;
    const data = {
      // ...this.state.searchParams,
      pageSize,
      pageNo: pageNo - 1,
    };
    getAlgoTaskList(data).then((res) => {
      console.log('res', res);
      if (res) {
        this.setState({
          pageData: res
        });
      }
    });
  };

  handleRowSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  reset = () => {
    this.setState({ searchParams: {} });
  };

  handleInput = (e, inputid) => {
    let searchParams;
    switch (inputid) {
      case 1:
        searchParams = Object.assign(this.state.searchParams, { deviceId: e.target.value.trim() });
        break;
      case 2:
        searchParams = Object.assign(this.state.searchParams, { deviceName: e.target.value.trim() });
        break;
      case 3:
        searchParams = Object.assign(this.state.searchParams, { tenantId: e.target.value.trim() });
        break;
      default:
        searchParams = Object.assign(this.state.searchParams, { algorithmId: e });
        break;
    }
    this.setState({ searchParams });
  }

  handleTaskDetail = (record) => {
    const detail = [];
    this.props.getAlgoTaskDetail(record).then((res) => {
      if (res) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(res)) {
          detail.push({ name: key, value: res[key] });
        }
      }
      console.log('detail', detail);
      this.setState({ detailData: detail, detailModalVisible: true });
    });
  }

  onPageSizeChange = (current, size) => {
    this.getTableList(1, size);
  }

  onPageNumChange = (pageNo) => {
    this.getTableList(pageNo, this.state.pageData.pageSize);
  }

  renderTableHeaders = () => (
    <div>
      <div className={styles.query}>
        <div className={styles.queryUserName}>
          <span className={styles.queryLabel}>摄像头ID：</span>
          <Input placeholder="请输入摄像头ID" onChange={e => this.handleInput(e, 1)} value={this.state.searchParams.deviceId} />
        </div>
        <div className={styles.queryRoleName}>
          <span className={styles.queryLabel}>摄像头名称：</span>
          <Input placeholder="摄像头名称" onChange={e => this.handleInput(e, 2)} value={this.state.searchParams.deviceName} />
        </div>
        <div className={styles.queryStatus}>
          <span className={styles.queryLabel}>租户名称：</span>
          <Input placeholder="租户名称" onChange={e => this.handleInput(e, 3)} value={this.state.searchParams.tenantId} />
        </div>
        <div className={styles.queryEnabled}>
          <span className={styles.queryLabel}>算法名称：</span>
          <Select onChange={v => this.handleInput(v, 4)}>
            <Option value={2}>全部</Option>
            <Option value={0}>启用</Option>
            <Option value={1}>禁用</Option>
          </Select>
        </div>

        <div className={styles.btnContainer}>
          <Button onClick={() => this.getTableList(1, this.state.pageData.pageSize)} type="primary">查询</Button>
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

  pagination = () => (
    <Pagination
      total={this.state.pageData.recordsTotal}
      onChange={this.onPageNumChange}
      current={this.state.pageData.pageNo + 1}
      hideOnSinglePage={false}
      showSizeChanger
      showQuickJumper
      pageSize={this.state.pageData ? this.state.pageData.pageSize : 10}
      pageSizeOptions={['1', '2', '10']}
      onShowSizeChange={this.onPageSizeChange}
    />
  )

  renderTable = () => {
    const {
      // eslint-disable-next-line max-len
      selectedRowKeys, pageData
    } = this.state;
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
      },
      {
        title: '算法状态',
        dataIndex: 'dispatchStatus',
      },
      {
        title: '任务状态',
        dataIndex: 'taskStatus',
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
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            <a onClick={() => this.handleTaskDetail(record)}>
              查看
            </a>
            <Divider type="vertical" />
            <a>
              取消
            </a>
          </div>
        ),
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
            dataSource={pageData ? pageData.list : []}
            rowSelection={rowSelection}
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

  onCancel = () => {
    this.setState({ detailModalVisible: false });
  }

  render() {
    return (
      <div className={styles.userContent}>
        {this.renderTableHeaders()}
        {this.renderTable()}
        {this.pagination()}
        <Modal
          centered
          width={412}
          visible={this.state.detailModalVisible}
          footer={[
            <Button key="back" onClick={this.onCancel}>
              取消
            </Button>
          ]}
        >
          <div className={styles.deleteModal}>
            <div className={styles.deleteModalInfo}>
              {
                this.state.detailData && this.state.detailData.map(item => (
                  <div>
                    <span>{item.name}</span>
                    <Input value={item.value} disabled />
                  </div>
                ))
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

AlgoTask.propTypes = {
};
export default connect(mapStateToProps, mapDispatchToProps)(AlgoTask);
