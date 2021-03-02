import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import {
  Tree, Input, Select, Icon, Card
} from 'antd';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  getAreaList, getHistoryListTopTen, getVideoSrc
} from 'Redux/reducer/preview';

import { getAlgorithmList } from 'Redux/reducer/monitor';
import { urlPrefix } from 'Constants/Dictionary';

import {
  ImageModal,
} from 'Views/alarms/Modals';

import nostatus from 'Assets/nostatus.png';
import VideoPlayer from './VideoPlayer';
import styles from './index.less';

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAreaList,
    getAlgorithmList,
    getHistoryListTopTen,
    getVideoSrc
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
      treeDatas: [],
      expandedKeys: ['1'],
      selectAreaKeys: ['1'],
      algorithmList: [],
      keyword: '',
      videoSrc: null,
      historyListData: {},
      imgDialogVisible: false
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
    //   console.log('曲线救国思密达----->', val);
      this.getHistory(val.id);
      this.getVideoSrc(val.id);
    }

    getHistory=(id) => {
      const { getHistoryListTopTen } = this.props;
      const param = {
        pageSize: 10,
        pageNo: 0,
        // deviceId: id
      };
      getHistoryListTopTen(param).then((res) => {
        console.log('res', res);
        this.setState({
          historyListData: res
        });
      });
    }

    getVideoSrc = (id) => {
      const { getVideoSrc } = this.props;
      getVideoSrc(id).then((res) => {
        console.log('视频流', res.m3u8uri);
        this.setState({
          videoSrc: res.m3u8uri
        });
      });
    }

    clearVideo = () => {
      this.setState({
        videoSrc: '',
        historyListData: {}
      });
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

    showImgDialog = (src) => {
      this.setState({
        imgDialogVisible: true,
        imgDialogSrc: src
      });
    }

      closeImgDialog = () => {
        this.setState({ imgDialogVisible: false });
      }

      render() {
        const {
          treeDatas, selectAreaKeys, expandedKeys, algorithmList,
          videoSrc, historyListData, imgDialogVisible, imgDialogSrc
        } = this.state;

        const { list = [] } = historyListData;

        const tempUrl = window.location.origin;

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
              {videoSrc
                ? (
                  <Fragment>
                    <div className={styles.videoHandle}>
                      <EIcon type="myicon-monitoring" />
                      <div>监控点位</div>
                      <EIcon type={`${styles.videoCancelBtn} myicon-cancel`} onClick={this.clearVideo} />
                    </div>
                    <VideoPlayer src={videoSrc} />
                  </Fragment>
                )
                : (
                  <div className={styles.nostatusBox}>
                    <img src={nostatus} alt="" />
                    <p>请双击左侧点位播放监控视频</p>
                  </div>
                )}

            </div>
            <div className={styles.historyList}>
              <div className={styles.historyTitle}>
                <p>
                  实时告警记录
                  <a>历史记录</a>
                </p>
              </div>
              <div className={styles.historyCard}>
                {
                  list.map(item => (
                    <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt="example" src={`${urlPrefix}${item.imageCompress}`} />}
                      onClick={() => this.showImgDialog(item.image)}
                    >
                      <p>
                        {item.algorithmCnName}
                        <span className={styles.historyTime}>{item.resTime}</span>
                      </p>
                    </Card>
                  ))
                }
              </div>
            </div>
            <ImageModal
              visible={imgDialogVisible}
              closeModal={this.closeImgDialog}
              src={`${urlPrefix}${imgDialogSrc}`}
              handleImageError={e => this.handleImageError(e)}
            />
          </div>
        );
      }
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview);
