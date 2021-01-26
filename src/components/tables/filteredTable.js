import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Input, message,
} from 'antd';
import PagedTable from './pagedTable';

const { Search } = Input;
class FilteredTable extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      shwonDataSource: [],
      fitler: '',
    };
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData = (props) => {
    this.setState({
      shwonDataSource: props.listData
    }, () => {
      props.searchOption.forEach((op, index) => (
        this.handleFilter(op.propNames, this.state.filter)
      ));
    });
  }

  /**
   *
   * @param {*} filterProps dataSource中需要查询的属性
   * @param {*} value 需要匹配的值
   */
  handleFilter = (filterProps, value) => {
    if (value) {
      filterProps = [0, ...filterProps];
      const shwonDataSource = this.props.listData.filter(val => filterProps.reduce((res, prop) => {
        const str = `${val[prop]}`;
        return res || ~str.indexOf(value);
      }));
      this.setState({
        shwonDataSource
      });
    } else {
      this.setState({
        shwonDataSource: this.props.listData
      });
    }
  }

  render() {
    const { shwonDataSource } = this.state;
    const { searchOption, listData, ...restProps } = this.props;
    const searchComp = searchOption.map((op, index) => (
      <Search
        key={index}
        placeholder={`请输入${op.text}`}
        onSearch={val => this.setState({
          filter: val
        }, () => this.handleFilter(op.propNames, val))}
      />
    ));


    return (
      <div>
        <PagedTable
          {...restProps}
          dataSource={shwonDataSource}
          handleFilter={this.handleFilter}
          searchComp={searchComp}
        />
      </div>
    );
  }
}

export default FilteredTable;
