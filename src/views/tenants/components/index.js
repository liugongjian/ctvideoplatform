/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from 'Components/EPagination';
import {
  Button, Table, Upload
} from 'antd';
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

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const btn = this.props.btndata.path ? (
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
    );
    const footer = this.props.btndata.path ? (
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
    ) : (
      <p>
        当前Licence购买日期为
        {this.props.data.issued.split(' ')[0].split('-')[0]}
        年
        {this.props.data.issued.split(' ')[0].split('-')[1]}
        月
        {this.props.data.issued.split(' ')[0].split('-')[2]}
        日
      </p>
    );
    const dataSource = this.props.data.list;
    return (
      <div>
        {btn}
        <Table
          rowKey={record => record.id}
          columns={this.props.columns}
          dataSource={dataSource}
          pagination={false}
        />
        <div style={{ marginTop: 24 }}>
          {footer}
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(InnerTable);