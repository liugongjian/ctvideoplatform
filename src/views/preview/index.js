import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import {
  Tree, Input, Select, Icon
} from 'antd';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  getAreaList
} from 'Redux/reducer/preview';

import { getAlgorithmList } from 'Redux/reducer/monitor';

import styles from './index.less';

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAreaList,
    getAlgorithmList
  },
  dispatch
);

const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;

class Preview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: '啊啊啊',
      treeDatas: [],
      expandedKeys: ['1'],
      selectAreaKeys: ['1'],
      algorithmList: []
    };
  }


  componentDidMount() {
    this.getTreeData();
    this.getAlgorithmList();
  }

    getTreeData = () => {
      const { getAreaList } = this.props;
      const param = {
        keyword: '',
        algorithmIds: []
      };
      getAreaList(param).then((res) => {
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
      const getTitle = (val) => {
        if (val.type === 1) {
          return (
            <span onDoubleClick={e => this.doubleClickHandle(e, val)}>
              {val.name}
            </span>
          );
        }
        return val.name;
      };
      const getIcon = (val) => {
        if (val.type === 1) {
          return (
            <EIcon type="myicon-monitorIcon" />
          );
        }
        return (<Icon type="folder" />);
      };
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.id.toString()}
            title={item.name}
            className={styles.treenode}
            icon={<EIcon type="myicon-folderopen" />}
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
          //   icon={props => getIcon(props, item)}
          icon={getIcon(item)}
        />
      );
    })

    onExpand = (expandedKeys) => {
      this.setState({
        expandedKeys
      });
    }

    onSelect = (keys, eve) => {
      this.setState({
        selectAreaKeys: keys
      });
    }


    getAlgorithmList = () => {
      const { getAlgorithmList } = this.props;
      getAlgorithmList().then((res) => {
        this.setState({
          algorithmList: res
        });
      });
    }

    render() {
      const {
        treeDatas, selectAreaKeys, expandedKeys, algorithmList
      } = this.state;

      const drawAlgorithmList = () => algorithmList.map(item => (
        <Option value={item.id} key={item.id} label={item.cnName}>
          <span aria-label={item.id}>
            {item.cnName}
          </span>
        </Option>
      ));

      return (
        <div className={styles.content}>
          <div className={styles.areaBox}>
            <div className={styles.searchBox}>
              <Search placeholder="请输入点位或区域" onSearch={this.getAreaList} />
              <Select
                defaultValue={[]}
                style={{ width: '100%' }}
                mode="multiple"
                onChange={this.algorithmChangeHandle}
                optionLabelProp="label"
              >
                {drawAlgorithmList()}
              </Select>
            </div>
            {
              treeDatas && treeDatas.length ? (
                <Tree
                  expandedKeys={expandedKeys}
                  defaultExpandAll
                  blockNode
                  //   showLine
                  showIcon
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
