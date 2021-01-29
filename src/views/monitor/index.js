import React, { Component } from 'react';
import {
  Select, Tree, Icon, Input, Button
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

class Monitor extends Component {
  state = {
    test: '测试什么的'
  }

  componentDidMount() {
    // ajax code
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode
          title={item.name}
          key={item.key}
        >
          {item.name}
          {
            this.renderTreeNodes(item.children)
          }
        </TreeNode>
      );
    }
    return (
      <TreeNode
        title={item.name}
        key={item.key}
      >
        {item.name}
      </TreeNode>
    );
  })

  render() {
    const { test } = this.state;
    const { monitor } = this.props;
    return (
      <div className={styles.content}>
        <div className={styles.areaTree}>
          <Tree
            defaultExpandedKeys={['0-0-0', '0-0-1', '0-0-2']}
            showLine
          >
            <TreeNode icon={<Icon type="carry-out" />} title="parent 1" key="0-0">
              <TreeNode icon={<Icon type="carry-out" />} title="parent 1-0" key="0-0-0">
                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-0-0" />
                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-0-1" />
                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-0-2" />
              </TreeNode>
              <TreeNode icon={<Icon type="carry-out" />} title="parent 1-1" key="0-0-1">
                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-1-0" />
              </TreeNode>
              <TreeNode icon={<Icon type="carry-out" />} title="parent 1-2" key="0-0-2">
                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-2-0" />
                <TreeNode
                  switcherIcon={<Icon type="form" />}
                  icon={<Icon type="carry-out" />}
                  title="leaf"
                  key="0-0-2-1"
                />
              </TreeNode>
            </TreeNode>
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
              <Button type="primary">
                <Icon type="export" />
              </Button>
              <Button type="primary">
                <Icon type="delete" />
              </Button>
            </div>
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
