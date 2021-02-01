import React, { Component } from 'react';
import {
  Select, Tree, Icon, Input, Button, Table
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getList
} from 'Redux/reducer/monitor';

import styles from './index.less';

const { Option } = Select;
const { TreeNode } = Tree;
const InputGroup = Input.Group;

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  { push, getList },
  dispatch
);
class Monitor extends Component {
  state = {
    test: '测试什么的',
    treeDatas: [],
    expandedKeys: ['0', '0-1'],
  }

  componentDidMount() {
    this.getAreaList();
  }

  getAreaList = () => {
    const { getList } = this.props;
    getList(0).then((data) => {
      const treeDatas = this.dataToTree(data);
      this.setState({
        treeDatas,
      });
    });
  }

  dataToTree = (data) => {
    const map = {};
    data.forEach((item) => {
      item.ifEdit = false;
      map[item.id] = item;
    });
    const val = [];
    data.forEach((item) => {
      const parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        val.push(item);
      }
    });
    return val;
  }

  renderTreeNodes = data => data.map((item) => {
    const { deptHover } = this.state;
    const getBtn = () => {
      if (deptHover && deptHover[item.id]) {
        if (item.pid === 0) {
          return (
            <span className={styles.treeBtnBox}>
              <Icon type="edit" className={styles.treeBtn} />
              <Icon type="plus-square" className={styles.treeBtn} />
            </span>
          );
        }
        return (
          <span className={styles.treeBtnBox}>
            <Icon type="edit" className={styles.treeBtn} onClick={() => this.editThis(item.id)} />
            <Icon type="delete" className={styles.treeBtn} />
            <Icon type="plus-square" className={styles.treeBtn} />
            <Icon type="arrow-up" className={styles.treeBtn} />
            <Icon type="arrow-down" className={styles.treeBtn} />
          </span>
        );
      }
      return '';
    };
    const getTitle = val => (
      <div
        onMouseEnter={() => { this.onMouseEnter(val.id); }}
        onMouseLeave={() => { this.onMouseLeave(val.id); }}
        className={styles.treeTitleInfo}
        key={val.id}
      >
        <span>{val.name}</span>
        {
          getBtn()
        }
      </div>
    );
    if (item.children && item.children.length) {
      return (
        <TreeNode key={item.id} title={getTitle(item)}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.id} title={getTitle(item)} />;
  })

  editThis = (key) => {
    console.log('edit', key);
  }

  editNode = (key, data) => data.map((item) => {
    if (item.id === key) {
      item.ifEdit = true;
    } else {
      item.ifEdit = false;
    }
  })

  onMouseEnter = (key) => {
    this.setState((preState, props) => ({
      deptHover: {
        ...preState.deptHover,
        [key]: true,
      },
    }));
  }

  onMouseLeave = (key) => {
    this.setState((preState, props) => ({
      deptHover: {
        ...preState.deptHover,
        [key]: false,
      },
    }));
  }

  render() {
    const { test, treeDatas, expandedKeys } = this.state;
    const { monitor } = this.props;
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
      },
    ];
    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
      {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sidney No. 1 Lake Park',
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div className={styles.content}>
        <div className={styles.areaTree}>
          <Input placeholder="请输入关键字" />
          <Tree
            className="draggable-tree"
            defaultExpandedKeys={expandedKeys}
            draggable
            blockNode
            showLine
            onDragEnter={this.onDragEnter}
            onDrop={this.onDrop}
          >
            {this.renderTreeNodes(treeDatas)}
          </Tree>
        </div>
        <div className={styles.monitorList}>
          <h1>视频监控点</h1>
          <div className={styles.searchBox}>
            <div className={styles.searchItme}>
              <span>摄像头名称:</span>
              <Input />
            </div>
            <div className={styles.searchItme}>
              <span>摄像头ID:</span>
              <Input />
            </div>
            <div className={styles.searchItme}>
              <span>算法:</span>
              <Input />
            </div>
          </div>
          <div className={styles.searchResult}>
            <div className={styles.handleResult}>
              <Button type="link">
                <Icon type="export" />
                <span>导入</span>
              </Button>
              <Button type="link">
                <Icon type="delete" />
                <span>批量删除</span>
              </Button>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
          </div>
        </div>
      </div>
    );
  }
}

Monitor.propTypes = {
  monitor: PropTypes.object.isRequired,
  // getList: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
