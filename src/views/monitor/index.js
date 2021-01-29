import React, { Component } from 'react';
import {
  Select, Tree, Icon, Input, Button, Table
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getSummary, getMonitorMetric,
} from 'Redux/reducer/monitor';

import styles from './index.less';

const { Option } = Select;
const { TreeNode } = Tree;
const InputGroup = Input.Group;

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const treeData = [
  {
    title: '根节点',
    key: '0',
    children: [
      {
        title: '一级区域名称1',
        key: '0-1',
        children: [
          {
            title: '二级区域名称1',
            key: '0-1-1'
          },
          {
            title: '二级区域名称2',
            key: '0-1-2',
            children: [
              {
                title: '三级区域名称1',
                key: '0-1-2-1'
              },
              {
                title: '三级区域名称2',
                key: '0-1-2-2',
                children: [
                  {
                    title: '四级区域名称1',
                    key: '0-1-2-2-1',
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

class Monitor extends Component {
  state = {
    test: '测试什么的',
    gData,
    treeData,
    expandedKeys: ['0', '0-1'],
  }

  componentDidMount() {
    // ajax code
    console.log(this.state.gData);
  }

  onDragEnter = (info) => {
    console.log('onDragEnter----->', info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = (info) => {
    console.log('onDrop------>', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 // Has children
      && info.node.props.expanded // Is expanded
      && dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      treeData: data,
    });
  };

  renderTreeNodes = data => data.map((item) => {
    if (item.children && item.children.length) {
      return (
        <TreeNode key={item.key} title={item.title}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} title={item.title} />;
  })

  render() {
    const { test, treeData, expandedKeys } = this.state;
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
          <Tree
            className="draggable-tree"
            defaultExpandedKeys={expandedKeys}
            draggable
            blockNode
            showLine
            onDragEnter={this.onDragEnter}
            onDrop={this.onDrop}
          >
            {this.renderTreeNodes(treeData)}
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
  monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
