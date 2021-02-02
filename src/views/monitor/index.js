import React, { Component, Fragment } from 'react';
import {
  Select, Tree, Icon, Input, Button, Table, Divider,
  Modal
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getList, renameArea, addChild, delArea, upArea, downArea,
  getDeiviceList
} from 'Redux/reducer/monitor';

import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const { TreeNode } = Tree;
const InputGroup = Input.Group;

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getList,
    renameArea,
    addChild,
    delArea,
    upArea,
    downArea,
    getDeiviceList
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
    deptHover: {},
    areaId: 0,
    pageNo: 1,
    recursive: false,
    pageSize: 10,
    tableData: [],
    showModal: false
  }

  componentDidMount() {
    this.getAreaList();
    this.getDeviceList();
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    });
  }

  getAreaList = (keyword) => {
    const { getList } = this.props;
    const { expandedKeys } = this.state;
    getList(0, keyword).then((res) => {
      const treeDatas = this.dataToTree(res);
      this.setState({
        tempData: res,
        treeDatas,
      }, () => this.onExpand(expandedKeys));
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
              {item.ifEdit
                ? (
                  <Button type="link" disabled={item.hasSame} size="small" onClick={() => { this.sureEdit(item.id, item.addTag, item.pid); }}>
                    <Icon type="check" />
                  </Button>
                )
                : <Icon type="edit" className={styles.treeBtn} onClick={() => this.editThis(item.id, item.name)} />}

              <Icon type="plus-square" className={styles.treeBtn} onClick={() => { this.onAdd(item.id); }} />

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
                  <Icon type="arrow-up" className={styles.treeBtn} onClick={() => { this.upArea(item.id); }} />
                  <Icon type="arrow-down" className={styles.treeBtn} onClick={() => { this.downArea(item.id); }} />
                </Fragment>
              ) : <Icon type="delete" className={styles.treeBtn} onClick={() => { this.cancel(item.id); }} />}
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
        <TreeNode key={item.id.toString()} title={getTitle(item)}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.id.toString()} title={getTitle(item)} />;
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
    const arr = this.state.tempData.filter(item => item.addTag);
    if (arr && arr.length > 0) {
      return;
    }
    const temp = {
      hasSame: false,
      ifEdit: true,
      id: -1,
      pid: key,
      addTag: true
    };
    this.state.tempData.push(temp);
    const tempKeys = [...this.state.expandedKeys, key.toString()];
    this.setState({
      treeDatas: this.dataToTree(this.state.tempData),
      editValue: '',
      expandedKeys: tempKeys
    });
  }

  cancel = (key) => {
    this.state.tempData = this.state.tempData.filter(({ id }) => id !== -1);
    this.setState({
      treeDatas: this.dataToTree(this.state.tempData)
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

  upArea = (key) => {
    const { upArea } = this.props;
    upArea(key).then((res) => {
      this.getAreaList();
    });
  }

  downArea =(key) => {
    const { downArea } = this.props;
    downArea(key).then((res) => {
      this.getAreaList();
    });
  }

  onSelect = (keys) => {
    if (keys && keys.length > 0) {
      const [a] = keys;
      console.log(a);
    }
  }

  getDeviceList = () => {
    const { getDeiviceList } = this.props;
    const {
      areaId,
      pageNo,
      recursive,
      pageSize
    } = this.state;
    const param = {
      areaId,
      pageNo: 0,
      recursive: true,
      pageSize
    };
    getDeiviceList(param).then((res) => {
      console.log(res);
      this.setState({
        tableData: res.list
      });
    });
  }

  openModal=() => {
    this.setState({
      showModal: true
    });
  }

  render() {
    const {
      test, treeDatas, expandedKeys, tableData, showModal
    } = this.state;
    const columns = [
      {
        title: '摄像头名称',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '摄像头ID',
        dataIndex: 'originId',
      },
      {
        title: '区域名称',
        dataIndex: 'address',
      },
      {
        title: '已配置算法',
        dataIndex: 'algorithms',
      },
      {
        title: '经纬度',
        dataIndex: 'longitude',
        render: (text, record) => (
          <span>
            {text}
            ,
            {record.latitude}
          </span>
        )
      },
      {
        title: '状态',
        dataIndex: 'online',
      },
      {
        title: '操作',
        dataIndex: 'x',
        render: (text, record) => (
          <span>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </span>
        ),
      }
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
          <Search placeholder="请输入关键字" onSearch={this.getAreaList} />
          <Tree
            className="draggable-tree"
            expandedKeys={expandedKeys}
            // expandedKeys={['0']}
            blockNode
            showLine
            onExpand={this.onExpand}
            onSelect={this.onSelect}
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
              <Button type="link" onClick={this.openModal}>
                <Icon type="export" />
                <span>导入</span>
              </Button>
              <Button type="link">
                <Icon type="delete" />
                <span>批量删除</span>
              </Button>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={tableData} />
          </div>
        </div>
        <Modal
          title="导入摄像头"
          visible={showModal}
        >
          <p>123</p>
        </Modal>
      </div>
    );
  }
}

// Monitor.propTypes = {
//   monitor: PropTypes.object.isRequired,
//   // getList: PropTypes.func.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
