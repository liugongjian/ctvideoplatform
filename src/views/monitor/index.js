import React, { Component, Fragment } from 'react';
import {
  Select, Tree, Icon, Input, Button, Table
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getList, renameArea, addChild, delArea
} from 'Redux/reducer/monitor';

import styles from './index.less';

const { Option } = Select;
const { TreeNode } = Tree;
const InputGroup = Input.Group;

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getList, renameArea, addChild, delArea
  },
  dispatch
);
class Monitor extends Component {
  state = {
    test: '测试什么的',
    treeDatas: [],
    expandedKeys: ['0'],
    editValue: '',
    hasSame: '',
    tempData: [],
    deptHover: {}
  }

  componentDidMount() {
    this.getAreaList();
  }

  getAreaList = () => {
    const { getList, monitor } = this.props;
    getList(0).then((res) => {
      const treeDatas = this.dataToTree(res);
      this.setState({
        tempData: res,
        treeDatas,
      });
    });
  }

  dataToTree = (data) => {
    // 下面的forEach写法会改变原数组，所以深度拷贝一次
    const copy = JSON.parse(JSON.stringify(data));
    const map = {};
    copy.forEach((item) => {
      item.defaultName = item.name;
      map[item.id] = item;
    });
    const val = [];
    copy.forEach((item) => {
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
            {item.ifEdit
              ? (
                <Button type="link" disabled={item.hasSame} size="small" onClick={() => { this.sureEdit(item.id, item.addTag, item.pid); }}>
                  <Icon type="check" />
                </Button>
              )
              : <Icon type="edit" className={styles.treeBtn} onClick={() => this.editThis(item.id, item.name)} />}
            {!item.addTag
              ? (
                <Fragment>
                  <Icon type="delete" className={styles.treeBtn} onClick={() => { this.onDelete(item.id); }} />
                  <Icon type="plus-square" className={styles.treeBtn} onClick={() => { this.onAdd(item.id); }} />
                  <Icon type="arrow-up" className={styles.treeBtn} />
                  <Icon type="arrow-down" className={styles.treeBtn} />

                </Fragment>
              ) : null}

          </span>
        );
      }
      return '';
    };
    const getTitle = val => (
      <Fragment>
        <div
          onMouseEnter={() => { this.onMouseEnter(val.id); }}
          onMouseLeave={() => { this.onMouseLeave(val.id); }}
          className={styles.treeTitleInfo}
          key={val.id}
        >
          {
            val.ifEdit
              ? (
                <Input
                  value={this.state.editValue}
                  onChange={e => this.onChange(e, val.id, val.name)}
                  size="small"
                />
              )
              : <span>{val.name}</span>
          }
          {
            getBtn()
          }
        </div>
        {item.hasSame ? <div className={styles.hasSame}>节点名称重复，请重新设置</div> : null}
      </Fragment>
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

  editThis = (key, name) => {
    const editData = this.editNode(key, this.state.treeDatas);
    this.setState({
      treeDatas: editData,
      editValue: name
    });
  }

  editNode = (key, data) => data.map((item) => {
    if (item.id === key) {
      item.ifEdit = true;
    } else {
      item.ifEdit = false;
    }
    item.name = item.defaultName;
    if (item.children) {
      this.editNode(key, item.children);
    }
    return item;
  })

  sureEdit = (key, tag, pid) => {
    console.log(this.state.editValue);
    if (tag) {
      const { editValue, tempData } = this.state;
      const { addChild } = this.props;
      addChild(pid, editValue).then((res) => {
        this.getAreaList();
      });
    } else {
      const { editValue, tempData } = this.state;
      const { renameArea } = this.props;
      renameArea(key, editValue).then((res) => {
        const temp = tempData.find(item => item.id === res.id) || {};
        temp.name = res.name;
        this.setState({
          treeDatas: this.dataToTree(tempData)
        });
      });
    }
  }

  onChange = (e, key, name) => {
    const { tempData, treeDatas } = this.state;

    const test = tempData.filter(item => item.name === e.target.value);
    if (test && test.length) {
      const temp = tempData.find(item => item.id === key && item.name !== e.target.value) || {};
      temp.hasSame = true;
      temp.ifEdit = true;
      this.setState({
        treeDatas: this.dataToTree(tempData)
      });
    } else {
      const temp = tempData.find(item => item.id === key) || {};
      temp.hasSame = false;
      temp.ifEdit = true;
      this.setState({
        treeDatas: this.dataToTree(tempData)
      });
    }
    this.setState({
      editValue: e.target.value
    });
  }

  changeNode = (key, value, data) => data.map((item) => {
    if (item.id === key) {
      item.name = value;
    }
    if (item.children) {
      this.changeNode(key, value, item.children);
    }
    return item;
  })

  onAdd = (key) => {
    this.state.tempData.map((item) => {
      item.ifEdit = false;
      return item;
    });
    const temp = {
      hasSame: false,
      ifEdit: true,
      id: -1,
      pid: key,
      addTag: true
    };
    this.state.tempData.push(temp);
    this.setState({
      treeDatas: this.dataToTree(this.state.tempData),
      editValue: ''
    });
  }

  onDelete = (key) => {
    const { delArea } = this.props;
    delArea(key).then((res) => {
      this.getAreaList();
    });
  }

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
            // expandedKeys={['0']}
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
