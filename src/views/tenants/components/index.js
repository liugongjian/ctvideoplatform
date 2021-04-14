/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from 'Components/EPagination';
import {
  Button, Table, Upload
} from 'antd';
import moment from 'moment';
import styles from './index.less';

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
  },
  dispatch
);


class InnerTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  btn = () => (
    this.props.btndata.path ? (
      <Link to={this.props.btndata.path}>
        <Button type="primary" className={styles.addBtn}>
          +
          {this.props.btndata.name}
        </Button>
      </Link>
    ) : (
      <Upload {...this.props.uploadProps}>
        <Button type="primary" className={styles.addBtn}>
          +
          {this.props.btndata.name}
        </Button>
      </Upload>
    )
  )

  footer = () => (
    this.props.btndata.path ? (
      <Pagination
        total={this.props.data.recordsTotal}
        onChange={pageNo => this.props.onPageNumChange(pageNo)}
        current={this.props.data.pageNo + 1}
        hideOnSinglePage={false}
        showSizeChanger
        showQuickJumper
        pageSize={this.props.data.pageSize ? this.props.data.pageSize : 10}
        pageSizeOptions={['10', '20', '50']}
        onShowSizeChange={(current, size) => this.props.onPageSizeChange(current, size)}
      />
    ) : null
  )

  render() {
    const dataSource = this.props.data.list;
    const showInfo = () => {
      const { path, deviceQuota } = this.props.btndata;
      return !path && this.props.data.issued ? (
        <Fragment>
          <p>
            当前许可证书到期日期：
            {moment(this.props.data.issued).format('YYYY年MM月DD日')}
          </p>
          <p>
            设备接入总额度：
            {deviceQuota}
          </p>
        </Fragment>
      ) : null;
    };
    return (
      <div>
        {this.btn()}
        {showInfo()}
        <Table
          rowKey={record => record.id}
          columns={this.props.columns}
          dataSource={dataSource}
          pagination={false}
        />
        <div style={{ marginTop: 24 }}>
          {this.footer()}
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(InnerTable);
