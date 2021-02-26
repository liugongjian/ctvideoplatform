import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import {
  Tree, Input, Select, Icon, Card
} from 'antd';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  getAreaList, getHistoryListTopTen
} from 'Redux/reducer/preview';

import { getAlgorithmList } from 'Redux/reducer/monitor';

import VideoPlayer from './VideoPlayer';

import styles from './index.less';

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAreaList,
    getAlgorithmList,
    getHistoryListTopTen
  },
  dispatch
);

const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

class Preview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: '啊啊啊',
      treeDatas: [],
      expandedKeys: ['1'],
      selectAreaKeys: ['1'],
      algorithmList: [],
      keyword: ''
    };
  }


  componentDidMount() {
    this.getTreeData();
    this.getAlgorithmList();
  }

    getTreeData = () => {
      const { getAreaList } = this.props;
      const { keyword, algorithmIds } = this.state;
      const param = {
        keyword,
        algorithmIds
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
      this.getHistory(val.id);
    }

    getHistory=(id) => {
      const { getHistoryListTopTen } = this.props;
      const param = {
        pageSize: 10,
        pageNo: 0,
        deviceId: id
      };
      getHistoryListTopTen(param).then(res => console.log('res', res));
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
            <EIcon type={val.online ? `${styles.monitorOnline} myicon-monitorIcon` : `${styles.monitorOffline} myicon-monitorIcon`} />
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

    algorithmChangeHandle = (val) => {
      this.setState({
        algorithmIds: val
      }, () => {
        this.getTreeData();
      });
    }

    searchByKeyword = (val) => {
      this.setState({
        keyword: val
      }, () => {
        this.getTreeData();
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
              <h2>监控点</h2>
              <Search placeholder="请输入点位或区域" onSearch={this.searchByKeyword} />
              <Select
                defaultValue={[]}
                style={{ width: '100%' }}
                placeholder="请选择已配置算法"
                mode="multiple"
                onChange={this.algorithmChangeHandle}
                optionLabelProp="label"
              >
                {drawAlgorithmList()}
              </Select>
            </div>
            <div className={styles.areaList}>
              {
                treeDatas && treeDatas.length ? (
                  <Tree
                    expandedKeys={expandedKeys}
                    defaultExpandAll
                    blockNode
                    showIcon
                    onExpand={this.onExpand}
                    onSelect={this.onSelect}
                    className={styles.dataTree}
                    ref={ref => this.treeNode = ref}
                  >
                    {this.renderTreeNodes(treeDatas)}
                  </Tree>
                ) : null
              }
            </div>
          </div>
          <div className={styles.videoBox}>
            <div className={styles.videoHandle}>
              <EIcon type="myicon-monitoring" />
              <div>监控点位</div>
              <EIcon type="myicon-cancel" />
            </div>
            <VideoPlayer src="http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8" />
          </div>
          <div className={styles.historyList}>
            <div className={styles.historyTitle}>
              <p>
                实时告警记录
                <a>历史记录</a>
              </p>
            </div>
            <div className={styles.historyCard}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
              >
                {/* } <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                <p>Card content</p>
              </Card>
            </div>
          </div>
        </div>
      );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview);
