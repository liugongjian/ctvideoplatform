import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Tree,
  Input,
  // Icon,
  Modal,
  message,
  Spin,
} from 'antd';
import Icon from 'Components/Icon';
import AddFolder from './addFolder';
import styles from './folderTree.less';


const { TreeNode } = Tree;
const { Search } = Input;
let timer;

class FolderTree extends Component {
  constructor() {
    super();
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      dataList: [],
      deptHover: {},
      addDeptVisible: false,
      curDeptKey: null,
      scrolling: false
    };
  }

  componentDidMount() {
    // const { treeData } = this.props;
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData = (props) => {
    if (!props.loading) {
      const dataList = [];
      const { treeData } = props;
      this.generateList(treeData, dataList, null);
      this.setState({
        dataList,
      });
      if (treeData.length > 0) {
        const root = `${treeData[0].key}`;
        if (!this.state.expandedKeys || this.state.expandedKeys.length <= 0) {
          this.setState({
            expandedKeys: [root],
          });
        }
      }
    }
  }

  // tree生成list方便查找
  generateList = (data, dataList, parentKey) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title, children } = node;
      dataList[key] = {
        title, isLeaf: !children, parentKey
      };
      if (children) {
        this.generateList(node.children, dataList, key);
      }
    }
  };

  onMouseEnter = (deptKey) => {
    // console.log('enter', deptKey);
    this.setState((preState, props) => ({
      deptHover: {
        ...preState.deptHover,
        [deptKey]: true,
      },
    }));
  }

  onMouseLeave = (deptKey) => {
    // console.log('leave', deptKey);
    this.setState((preState, props) => ({
      deptHover: {
        ...preState.deptHover,
        [deptKey]: false,
      },
    }));
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  showAddDept = (key, e) => {
    e.stopPropagation();
    this.setState({
      addDeptVisible: true,
      curDeptKey: key,
    });
  }

  addDept = (name) => {
    const { curDeptKey } = this.state;
    const resBody = {
      name,
      parent_id: curDeptKey,
    };
    return this.props.addFunc(resBody);
  }

  delDept = (key, curTitle, e) => {
    // this.setState({
    //   addDeptVisible: true,
    //   curDeptKey: key,
    // });
    e.stopPropagation();
    const self = this;
    const { dataList } = this.state;
    // const curTitle = dataList[key] && dataList[key].title;
    Modal.confirm({
      title: `确定要删除[${curTitle}]吗?`,
      // content: '删除部门将删除其下的所有的部门',
      onOk() {
        self.props.delFunc(key).then((res) => {
          message.success('删除成功');
          // const { expandedKeys } = self.state;
          // if (expandedKeys.length > 0) {
          //   const newExpandKeys = expandedKeys.filter(item => item === `${key}`);
          //   this.setState({
          //     expandedKeys: newExpandKeys,
          //   });
          // }
          self.props.refresh();
        });
      },
      onCancel() {},
    });
  }

  closeAddFolder = (key) => {
    this.setState({
      addDeptVisible: false,
    });
  }

  onSearch = (val) => {
    const value = val.replace(/\s*/g, '');// 去除字符串中所有空格
    const { dataList } = this.state;
    const { treeData } = this.props;
    const expandedKeys = dataList
      .map((item, key) => {
        if (item.title.indexOf(value) > -1) {
          // return this.getParentKey(key, treeData);
          // console.log('123123', dataList[key]);
          return dataList[key].parentKey;
        }
        return null;
      });
    // .filter((item, i, self) => item);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  onTreeScroll = (e) => {
    clearTimeout(timer);
    this.setState({
      scrolling: true,
    });
    timer = setTimeout(() => {
      this.setState({
        scrolling: false,
      });
    }, 500);
  }

  render() {
    const {
      searchValue, expandedKeys, autoExpandParent, deptHover,
      addDeptVisible, curDeptKey, dataList, scrolling
    } = this.state;
    const {
      onSelect, loading, refresh
    } = this.props;
    let {
      treeData
    } = this.props;
    if (!treeData.length) {
      treeData = [];
    }
    if (treeData && treeData.length > 0) {
      treeData[0].isRoot = true;
    }
    const genTree = data => data.map((item) => {
      const index = searchValue ? item.title.indexOf(searchValue) : -1;
      const title = <span style={{ color: index > -1 ? '#f50' : 'black' }}>{item.title}</span>;
      return (
        <TreeNode
          key={item.key}
          title={(
            <div
              onMouseEnter={() => this.onMouseEnter(item.key)}
              onMouseLeave={() => this.onMouseLeave(item.key)}
              className={styles['dept-title']}
              title={`${item.title}(${item.total})`}
            >
              <span className={styles['dept-text']}>
                {title}
              </span>
              <span className={styles['dept-total']}>{item.total}</span>
              {deptHover && deptHover[item.key] ? (
                <span className={styles['dept-op']}>
                  <a onClick={e => this.showAddDept(item.key, e)}><Icon type="anticon-add" /></a>
                  &nbsp;
                  <a onClick={e => this.delDept(item.key, item.title, e)}><Icon type="anticon-reduce" /></a>
                </span>
              ) : ''}
              <div />
            </div>
          )}
        >
          {item.children ? genTree(item.children) : null}
        </TreeNode>
      );
    });
    const curTitle = dataList[curDeptKey] && dataList[curDeptKey].title;
    return (
      <div className={styles['folder-tree']}>
        <Spin spinning={loading}>
          <AddFolder
            visible={addDeptVisible}
            title={curTitle ? `在[${curTitle}]中添加新部门` : '添加根部门'}
            placeholder="请输入部门名称"
            addFolder={this.addDept}
            refresh={refresh}
            closeModal={() => this.closeAddFolder()}
          />
          <Search className={styles['search-bar']} placeholder="搜索部门" onSearch={this.onSearch} onChange={e => this.onSearch(e.target && e.target.value)} />
          <div
            onScrollCapture={this.onTreeScroll}
            className={scrolling ? `${styles['folder-scroll']} ${styles['folder-wrapper']}` : `${styles['folder-wrapper']}`}
          >
            {
              treeData.length === 0
                && (
                  <div
                    style={{
                      lineHeight: '46px',
                      padding: '4px 0 4px 10px',
                      fontSize: '12px'
                    }}
                  >
                    <a onClick={e => this.showAddDept(undefined, e)}>+&nbsp;添加根部门</a>
                  </div>
                )
            }
            <Tree
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={onSelect}
              blockNode
            >
              {genTree(treeData)}
            </Tree>
          </div>
        </Spin>
      </div>
    );
  }
}

FolderTree.propTypes = {
  treeData: PropTypes.array.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  loading: PropTypes.bool.isRequired,
  addFunc: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  delFunc: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};
FolderTree.defaultProps = {
};

export default FolderTree;
