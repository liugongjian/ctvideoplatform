import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Tree } from 'antd';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  getList
} from 'Redux/reducer/monitor';

import styles from './index.less';

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getList
  },
  dispatch
);

const { TreeNode } = Tree;
class Preview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: '啊啊啊',
      treeDatas: [],
      expandedKeys: ['1'],
      selectAreaKeys: ['1']
    };
    this.count = 0;
    this.timer = null;
  }


  componentDidMount() {
    this.getTreeData();
  }

  componentWillUnmount() {
    window.setTimeout(this.timer);
    this.timer = null;
  }

    getTreeData = () => {
      const { getList } = this.props;
      getList(0).then((res) => {
        const treeDatas = this.dataToTree(res);
        this.setState({
          treeDatas
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

    doubleClickHandle = (e, val) => {
      console.log('曲线救国思密达----->', val);
    }

    renderTreeNodes = data => data.map((item, index) => {
      const getTitle = val => (
        <div onDoubleClick={e => this.doubleClickHandle(e, val)}>
          {val.name}
        </div>
      );
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.id.toString()}
            title={getTitle(item)}
            className={styles.treenode}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id.toString()}
          title={getTitle(item)}
          className={styles.treenode}
        />
      );
    })

    onExpand = (expandedKeys) => {
      this.setState({
        expandedKeys
      });
    }

    onSelect = (keys, eve) => {
      const { selectAreaKeys: [a] } = this.state;
      const [b] = keys;
      //   if (b && a === b) {

      //   }
      //   console.log('selectAreaKeys---------->', a, 'keys--------->', keys);
      //   if (this.timer && this.count > 0 && this.count < 3) {
      //     window.clearTimeout(this.timer);
      //     this.timer = null;
      //   }
      //   this.count++;
      //   if (this.count === 2) {
      //     console.log('芜湖');
      //     console.log('好几ble click here');
      //   }
      //   console.log(this.count);
      //   window.setTimeout(() => {
      //     window.clearTimeout(this.timer);
      //     this.timer = null;
      //     this.count = 0;
      //   }, 2000);
      this.setState({
        selectAreaKeys: keys
      });
    }

    render() {
      const { treeDatas, selectAreaKeys, expandedKeys } = this.state;
      return (
        <div>
          <div>
            {
              treeDatas && treeDatas.length ? (
                <Tree
                  expandedKeys={expandedKeys}
                  defaultExpandAll
                  blockNode
                  showLine
                  onExpand={this.onExpand}
                  onSelect={this.onSelect}
                  //   defaultSelectedKeys={['1']}
                  className={styles.dataTree}
                  //   selectedKeys={selectAreaKeys}
                  ref={ref => this.treeNode = ref}
                >
                  {this.renderTreeNodes(treeDatas)}
                </Tree>
              ) : null
            }
          </div>
        </div>
      );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview);
