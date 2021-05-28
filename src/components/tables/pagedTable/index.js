import React, { Component } from 'react';
import {
  Select,
  Menu,
  Input,
  Icon,
  Row,
  Col,
  Button,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import EIcon from '../../Icon';
import ETable from '../../ETable';
import styles from './pagedTable.less';

class PagedTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      tableData: [], // 当页数据
      curPage: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.initData(this.props, 1);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps, this.state.curPage);
  }


  initData = (props, curPage) => {
    if (props.dataSource.length / this.state.pageSize + 1 <= curPage) {
      curPage = 1;
    }
    const tableData = this.getPageData(props.dataSource, curPage, this.state.pageSize);
    this.setState({
      tableData,
      curPage
    });
  }

  handleSelect = (val) => {
    this.setState({
      filterType: val
    });
  }

  onPageChange = (page, pageSize) => {
    const tableData = this.getPageData(this.props.dataSource, page, pageSize);
    this.setState({
      curPage: page,
      tableData,
    });
  }

  getPageData = (tableData, page, pageSize) => {
    pageSize = pageSize || this.state.pageSize;
    const start = pageSize * (page - 1);
    const end = start + pageSize;
    return tableData.slice(start, end);
  }

  onShowSizeChange = (current, pageSize) => {
    // this.props.changeSize(pageSize);
    this.setState({
      pageSize,
    });
    const { dataSource } = this.props;
    let page = this.state.curPage;
    // 如果当前页无数据，跳转到第一页
    if (dataSource.length / pageSize + 1 <= page) {
      page = 1;
    }
    const tableData = this.getPageData(dataSource, page, pageSize);
    this.setState({
      curPage: page,
      tableData,
    });
  }


  render() {
    const {
      dataSource, handleFilter, searchComp, ...restProps
    } = this.props;
    const { tableData, pageSize, curPage } = this.state;
    const pagination = {
      current: curPage,
      pageSize,
      total: dataSource.length,
      showSizeChanger: true,
      showQuickJumper: true,
      hideOnSinglePage: false,
    };
    pagination.onChange = this.onPageChange.bind(this);
    pagination.onShowSizeChange = this.onShowSizeChange.bind(this);
    return (
      <div className={styles['paged-table']}>
        {
          searchComp
        && (
          <Row className={styles['search-bar']}>
            <Col offset={18} span={6}>
              {searchComp}
            </Col>
          </Row>
        )
        }


        <div className={styles['cluster-table']}>
          <ETable
            {...restProps}
            dataSource={tableData}
            pagination={pagination}
          />
        </div>
      </div>
    );
  }
}

export default PagedTable;
