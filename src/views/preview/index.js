import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import {
  Tree, Input, Select, Icon, Card, Spin, Modal
} from 'antd';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  getAreaList, getHistoryListTopTen, getVideoSrc, getAreaInfo
} from 'Redux/reducer/preview';

import { getAlgorithmList } from 'Redux/reducer/monitor';
import { urlPrefix } from 'Constants/Dictionary';

// import {
//   ImageModal,
// } from 'Views/alarms/Modals';

import nostatus from 'Assets/nostatus.png';
import nodata from 'Assets/nodata.png';
import noImage from 'Assets/defaultFace.png';
import VideoPlayer from './VideoPlayer';
import styles from './index.less';

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAreaList,
    getAlgorithmList,
    getHistoryListTopTen,
    getVideoSrc,
    getAreaInfo
  },
  dispatch
);

const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

const LABEL_PERSON = {
  WHITE: '白名单', BLACK: '黑名单', OTHER: '陌生人'
};

const LABEL_CAR = {
  WHITE: '白名单', BLACK: '黑名单', OTHER: '其他'
};


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
      imgDialogVisible: false,
      algorithmIds: [],
      showText: '无信号',
      tempTotal: -1,
      historyID: '',
      timer: null,
      modalShowInfo: '',
      pointsInfo: [],
      ifShowMoreDialog: false
    };
  }


  componentDidMount() {
    this.getTreeData();
    this.getAlgorithmList();
  }

  componentWillUnmount() {
    this.clearTimer();
  }


    getTreeData = () => {
      const { getAreaList } = this.props;
      const { keyword, algorithmIds } = this.state;
      const param = {
        keyword,
        algorithmIds
      };
      getAreaList(param).then((res) => {
        if (res) {
          const treeDatas = this.dataToTree(res);
          let expendsIds = ['1'];
          if (keyword || algorithmIds.length) {
            expendsIds = res.map(item => item.id);
          }
          this.setState({
            treeDatas,
            expandedKeys: expendsIds
          });
        } else {
          this.setState({
            treeDatas: [],
            expandedKeys: ['1']
          });
        }
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
      this.clearTimer();
      if (val.online) {
        this.setState({
          selectAreaKeys: [val.id],
          videoSrc: null,
          tempTotal: -1,
          historyID: val.id
        }, () => {
          this.getHistory();
          this.setIntervalTimer();
          this.getVideoSrc(val.id, val.name);
          this.getPeopleArea();
        });
      } else {
        this.setState({
          selectAreaKeys: [val.id],
          videoSrc: null,
          showText: '设备已离线',
          historyListData: {}
        });
      }
    }

    getPeopleArea = () => {
      const { getAreaInfo } = this.props;
      const tempData = {
        applied: true,
        area: {
          type: 0,
          name: 'line',
          imageWidth: 1920,
          imageHeight: 1080,
          points: [
            {
              x: 10,
              y: 10
            },
            {
              x: 20,
              y: 20
            },
          ]
        }
      };
      this.setState({
        pointsInfo: tempData
      });
    }

    getHistory=(id) => {
      const { historyID } = this.state;
      const { getHistoryListTopTen } = this.props;
      const param = {
        pageSize: 10,
        pageNo: 0,
        deviceId: historyID
      };
      getHistoryListTopTen(param).then((res) => {
        const { tempTotal } = this.state;
        if (tempTotal === -1) {
          this.setState({
            historyListData: res,
            tempTotal: res.recordsTotal
          });
        } else if (res.recordsTotal > tempTotal) {
          this.setState({
            historyListData: res,
            tempTotal: res.recordsTotal
          });
        } else {
          // this.timer = window.setInterval(getTopTenList, 5000);
        }
      });
    }

    setIntervalTimer = () => {
      this.state.timer = window.setInterval(() => {
        this.getHistory();
      }, 5000);
    }

    clearTimer = () => {
      window.clearInterval(this.state.timer);
      this.state.timer = null;
    }


    getVideoSrc = (id, name) => {
      const { getVideoSrc } = this.props;
      this.setState({
        showText: '加载中...'
      }, () => {
        getVideoSrc(id).then((res) => {
          if (res && res.m3u8uri) {
            this.setState({
              videoSrc: res.m3u8uri,
              noVideo: false,
              videoName: name,
              showText: '无信号'
            }, () => {
              window.clearTimeout(this.timer);
              this.timer = null;
            });
          } else {
            this.setState({
              videoSrc: '',
              noVideo: true,
              videoName: '',
              showText: '无信号'
            }, () => {
              window.clearTimeout(this.timer);
              this.timer = null;
            });
          }
        });
      });
    }

    clearVideo = () => {
      this.setState({
        videoSrc: '',
        historyListData: {},
        showText: '无信号'
      });
    }

    renderTreeNodes = data => data.map((item, index) => {
      const { checkedId } = this.state;
      const getTitle = (val) => {
        if (val.type === 1) {
          return (
            <span
              onDoubleClick={e => this.doubleClickHandle(e, val)}
              className={styles.treeNameById}
            >
              {val.name}
            </span>
          );
        }
        return val.name;
      };
      const getIcon = (val) => {
        if (val.type === 1) {
          return (
            <EIcon type={val.online ? `${styles.monitorOnline} myicon-monitorIcon` : `${styles.monitorOffline} myicon-monitorOff`} />
          );
        }
        return (<Icon type="folder" />);
      };

      const getFolderICon = (val) => {
        if (val.pid === '0') {
          return (<Icon type="apartment" />);
        }
        return (<EIcon type="myicon-folderopen" />);
      };

      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.id.toString()}
            title={item.name}
            className={styles.treenode}
            // icon={<EIcon type="myicon-folderopen" />}
            icon={getFolderICon(item)}
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

    showImgDialog = (value) => {
      this.setState({
        imgDialogVisible: true,
        imgDialogSrc: value.image,
        modalShowInfo: value
      });
    }

      closeImgDialog = () => {
        this.setState({ imgDialogVisible: false });
      }

      handleImageError = (e) => {
        const image = e.target;
        image.src = noImage;
        image.className = styles.historyTopnoImage;
        image.onerror = null;
      };

      getTag = (title, type) => (
        <span
          className={`${styles.AlarmCardTag} ${styles[`AlarmCardTag-${type}`]}`}
        >
          {title}
        </span>
      )


      getTypeContent = (val) => {
        if (val.face && val.face.label !== 'OTHER') {
          return (
            <div className={styles.historyTextName}>
              <span>姓名：</span>
              <span>
                {val.face.username || '-'}
              </span>
              {this.getTag(LABEL_PERSON[val.face.label], val.face.label)}
            </div>
          );
        }
        if (val.plate && val.plate.label !== 'OTHER') {
          return (
            <div className={styles.historyTextName}>
              <span>车牌：</span>
              <span>
                {val.plate.licenseNo || '-'}
              </span>
              {this.getTag(LABEL_CAR[val.plate.label], val.plate.label)}
            </div>
          );
        }
        return false;
        // (
        //   <div className={styles.historyTextName}>
        //     <span>姓名：</span>
        //     <span>70 陈丽君</span>
        //     {this.getTag('白名单', 'BLACK')}
        //   </div>
        // );
      }

      showMoreDialog = () => {
        this.setState({
          ifShowMoreDialog: true
        });
      }

      render() {
        const {
          treeDatas, selectAreaKeys, expandedKeys, algorithmList = [],
          videoSrc, historyListData, imgDialogVisible, imgDialogSrc,
          noVideo, videoName, showText, modalShowInfo, pointsInfo
        } = this.state;

        const { preview: { loading }, push } = this.props;

        const { list = [] } = historyListData;

        const tempUrl = window.location.origin;

        const drawAlgorithmList = () => algorithmList.map(item => (
          <Option value={item.id} key={item.id} label={item.cnName}>
            <span aria-label={item.id}>
              {item.cnName}
            </span>
          </Option>
        ));

        const getImg = () => (
          <div className={styles.allStatusBox}>
            <p>{showText}</p>
          </div>
        );
        // if (noVideo) {
        //   return (
        //     <div className={styles.nodataBox}>
        //       <img src={nodata} alt="" />
        //     </div>
        //   );
        // }
        // return (
        //   <div className={styles.nostatusBox}>
        //     <img src={nostatus} alt="" />
        //     <p>请双击左侧点位播放监控视频</p>
        //   </div>
        // );


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
                      selectedKeys={selectAreaKeys}
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
                      <EIcon type={`${styles.videoMonitoring} myicon-monitoring`} />
                      <div>
                        监控点位
                        {' '}
                        {videoName}
                      </div>
                      <EIcon type={`${styles.videoCancelBtn} myicon-cancel`} onClick={this.clearVideo} />
                    </div>
                    <VideoPlayer src={videoSrc} pointsInfo={pointsInfo} />
                  </Fragment>
                )
                : getImg()}

            </div>
            <div className={styles.historyList}>
              <div className={styles.peopleAreaCounts}>
                <div className={styles.peopleAreaTotal}>
                  <p>
                    实时人流量统计
                    <a onClick={this.showMoreDialog}>更多数据</a>
                  </p>
                </div>
                <div className={styles.peopleAreaNum}>
                  <div>
                    <span className={styles.peopleAreaKind}>流入</span>
                    <span className={styles.peopleAreaAll}>111</span>
                  </div>
                  <div>
                    <span className={styles.peopleAreaKind}>流出</span>
                    <span className={styles.peopleAreaAll}>222</span>
                  </div>
                </div>
              </div>
              <div className={styles.historyTitle}>
                <p>
                  实时告警记录
                  <a onClick={() => push('/alarms')}>历史记录</a>
                </p>
              </div>
              <div className={styles.historyCard}>
                {
                  list.map(item => (
                    <Card
                      hoverable
                      style={{ width: 220 }}
                      cover={<img alt="" src={`${urlPrefix}${item.imageCompress}`} onError={this.handleImageError} />}
                      onClick={() => this.showImgDialog(item)}
                      key={item.id}
                      className={styles.historyListCard}
                    >
                      <div className={styles.historyTextBox}>
                        <span>{item.algorithmCnName}</span>
                        <span className={styles.historyTime}>{item.resTime}</span>
                      </div>
                      {this.getTypeContent(item)}

                    </Card>
                  ))
                }
              </div>
            </div>
            {/* <ImageModal
              visible={imgDialogVisible}
              closeModal={this.closeImgDialog}
              src={`${urlPrefix}${imgDialogSrc}`}
              handleImageError={e => this.handleImageError(e)}
            /> */}
            <Modal
              title="告警记录"
              visible={imgDialogVisible}
              onCancel={this.closeImgDialog}
              // className={styles.pswModal}
              forceRender
              destroyOnClose
              width="560px"
              footer={null}
              wrapClassName={styles.alarmDetailModal}
            >
              <div className={styles.alarmListImg}>
                <img src={`${urlPrefix}${imgDialogSrc}`} onError={this.handleImageError} alt="" />
                <div className={styles.alarmModalName}>{modalShowInfo.algorithmCnName}</div>
              </div>
              <p>
                告警时间：
                <span>{modalShowInfo.resTime}</span>
              </p>
              <p>
                告警区域：
                <span>{modalShowInfo.areaPath}</span>
              </p>
              <p>
                告警位置：
                <span>{modalShowInfo.deviceName}</span>
              </p>
              {this.getTypeContent(modalShowInfo)}
              <p>
                告警规则：
                <span>{modalShowInfo.controlRule}</span>
              </p>
            </Modal>
          </div>
        );
      }
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview);
