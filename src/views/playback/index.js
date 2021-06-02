/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-nested-ternary */
import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import {
  Tree, Input, Select, Icon, Card, Spin, Modal, Button, Tabs, Tag, DatePicker, Table
} from 'antd';
import echarts from 'echarts';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';


import {
  getAreaList, getHistoryListTopTen, getVideoSrc,
  getAreaInfo, getPeopleLIne, getCurrentTraffic
} from 'Redux/reducer/preview';

import { getAlgorithmList } from 'Redux/reducer/monitor';
import { urlPrefix } from 'Constants/Dictionary';


// import {
//   ImageModal,
// } from 'Views/alarms/Modals';

import nostatus from 'Assets/nostatus.png';
import nodata from 'Assets/nodata.png';
import noImage from 'Assets/defaultFace.png';
import { set } from 'date-fns';
import TimeRange from './slider';
import MiniPlayer from './miniPlayer';
import FlvPlayer from './FlvPlayer';
import styles from './index.less';


const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAreaList,
    getAlgorithmList,
    getHistoryListTopTen,
    getVideoSrc,
    getAreaInfo,
    getPeopleLIne,
    getCurrentTraffic
  },
  dispatch
);

const step = 1000 * 60 * 1;
const now = new Date();
const getTodayAtSpecificTime = (hour = 12, minute = 0, second = 0) => set(now, {
  hours: hour, minutes: minute, seconds: second, milliseconds: 0
});

const selectedInterval = [
  getTodayAtSpecificTime(0),
];

const timelineInterval = [
  getTodayAtSpecificTime(0),
  getTodayAtSpecificTime(24)
];

const disabledIntervals = [
  { start: getTodayAtSpecificTime(16), end: getTodayAtSpecificTime(17) },
  { start: getTodayAtSpecificTime(7), end: getTodayAtSpecificTime(12) },
  { start: getTodayAtSpecificTime(20), end: getTodayAtSpecificTime(24) }
];

// 测试数据
const localvideosrcs = [
  {
    src: '/baseLineVideo/5.mp4',
    sttime: {
      hours: 1, minutes: 0, seconds: 0, milliseconds: 0
    },
    duration: {
      hours: 0, minutes: 13, seconds: 59, milliseconds: 0
    }
  },
  {
    src: '/baseLineVideo/6.mp4',
    sttime: {
      hours: 12, minutes: 0, seconds: 0, milliseconds: 0
    },
    duration: {
      hours: 0, minutes: 13, seconds: 17, milliseconds: 0
    }
  },
  {
    src: '/baseLineVideo/8.mp4',
    sttime: {
      hours: 20, minutes: 0, seconds: 0, milliseconds: 0
    },
    duration: {
      hours: 0, minutes: 9, seconds: 15, milliseconds: 0
    }
  },
];

const list1 = [
  {
    key: '1',
    name: '点位1',
    startTime: '2021年1月3日 12:20',
    duration: '54分钟',
    tag: '紧急',
    address: '/baseLineVideo/5.mp4',
  },
  {
    key: '2',
    name: '点位1',
    startTime: '2021年1月3日 16:40',
    duration: '3分钟',
    tag: '紧急',
    address: '/baseLineVideo/6.mp4',
  }
];
const list2 = [
  {
    key: '3',
    name: '点位3',
    startTime: '2021年1月3日 19:25',
    duration: '26分钟',
    tag: '紧急',
    address: '/baseLineVideo/8.mp4',
  },
];

const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const { Column } = Table;

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
      showText: '请选择摄像头',
      tempTotal: -1,
      historyID: '',
      timer: null,
      modalShowInfo: '',
      pointsInfo: {},
      ifShowMoreDialog: false,
      tempTrafficEntry: -1,
      tempTrafficExit: -1,
      traffiInfoData: {},
      sourceType: 1,
      appliedTraffic: false,
      checked: true,
      isListView: true,
      modalVisible: false,
      playBackAddress: null,
      whichTableList: true,
      videoSrcs: null,
    };
    this.mychart = null;
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
          console.log('res', res);
          const treeDatas = this.dataToTree(res);
          let expendsIds = ['1'];
          if (keyword || algorithmIds.length) {
            expendsIds = res.map(item => item.id);
          }
          this.setState({
            treeDatas,
            expandedKeys: expendsIds
          }, () => this.initCurVideo());
        } else {
          this.setState({
            treeDatas: [],
            expandedKeys: ['1']
          });
        }
      });
    }

    initCurVideo = () => {
      const {
        history: {
          location: {
            state: curDevice
          }
        }
      } = this.props;
      if (curDevice) {
        this.doubleClickHandle(undefined, curDevice);
      }
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
      // 切换列表视图数据——演示用
      this.setState({ whichTableList: !this.state.whichTableList, videoSrcs: localvideosrcs });
      // if (val.online) {
      //   this.setState({
      //     selectAreaKeys: [val.id],
      //     videoSrc: null,
      //     tempTotal: -1,
      //     historyID: val.id
      //   }, () => {
      //     // this.getHistory();
      //     // this.getCurrentDay();
      //     // this.getVideoSrc(val.id, val.name);
      //     // this.getPeopleArea(val.id);
      //     // this.setIntervalTimer();
      //   });
      // } else {
      //   this.setState({
      //     selectAreaKeys: [val.id],
      //     videoSrc: null,
      //     showText: '设备已离线',
      //     historyListData: {}
      //   });
      // }
    }

    getPeopleArea = (id) => {
      const { getAreaInfo } = this.props;
      // 人流量检测算法id为 10
      getAreaInfo(id, 10).then((res) => {
        const { applied } = res;
        this.setState({
          appliedTraffic: applied,
          pointsInfo: res
        });
      });
    }

    getHistory=() => {
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

    getCurrentDay = () => {
      const { getCurrentTraffic } = this.props;
      const { historyID } = this.state;
      getCurrentTraffic(historyID, 10).then((res) => {
        const { tempTrafficEntry, tempTrafficExit } = this.state;
        if (tempTrafficEntry === -1 || tempTrafficExit === -1) {
          this.setState({
            traffiInfoData: res,
            tempTrafficExit: res.exitNo,
            tempTrafficEntry: res.entryNo
          });
        } else if (res.exitNo > tempTrafficExit || res.exitNo > tempTrafficExit) {
          this.setState({
            traffiInfoData: res,
            tempTrafficExit: res.exitNo,
            tempTrafficEntry: res.entryNo
          });
        } else if (res.exitNo === null || res.entryNo === null) {
          this.setState({
            traffiInfoData: res,
            tempTrafficExit: res.exitNo || 0,
            tempTrafficEntry: res.entryNo || 0
          });
        }
      });
    }

    setIntervalTimer = () => {
      this.state.timer = window.setInterval(() => {
        this.getHistory();
        this.getCurrentDay();
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
          if (res && res.flvuri) {
            this.setState({
              // videoSrc: res.m3u8uri,
              videoSrc: res.flvuri,
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
        }, () => {
          this.initChartsData();
        });
      }

      closeMoreDialog = () => {
        this.setState({
          ifShowMoreDialog: false
        });
      }

      initChartsData = () => {
        const { getPeopleLIne } = this.props;
        const { historyID, sourceType } = this.state;
        getPeopleLIne(historyID, 10, sourceType).then((res) => {
          const chartNode = document.getElementById('modalChartsInfo');
          this.mychart = echarts.init(chartNode);
          const { serisDataEntry, serisDateExit, xaxisData } = res;
          const option = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['流入', '流出'],
              bottom: '0'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xaxisData
            },
            yAxis: {
              type: 'value',
              // data:
            },
            color: ['#5B8FF9', '#5AD8A6'],
            series: [
              {
                name: '流入',
                type: 'line',
                data: serisDataEntry
              }, {
                name: '流出',
                type: 'line',
                data: serisDateExit
              }
            ]
          };
          this.mychart.setOption(option);
        });
      }

      changeType = (sourceType) => {
        this.setState({
          sourceType
        }, () => this.initChartsData());
      }

      handleChange = (checked) => {
        this.setState({ checked });
      };

      handleViewType = () => this.setState({ isListView: !this.state.isListView });

      playBack = (address) => {
        this.setState({ playBackAddress: address, modalVisible: true });
      };

      closePlayModal = () => {
        this.setState({ modalVisible: false });
      };

      renderTables = () => {
        if (true) {
          return (
            <Fragment>
              <Table dataSource={this.state.whichTableList ? list1 : list2} pagination={false} rowKey={record => record.key}>
                <Column title="名称" dataIndex="name" />
                <Column title="开始时间" dataIndex="startTime" />
                <Column title="紧急标记" dataIndex="tag" />
                <Column title="录像时长" dataIndex="duration" />
                <Column title="视频地址" dataIndex="address" />
                <Column
                  title="操作"
                  render={(text, record) => (
                    <div className={styles.oprationWrapper}>
                      <a onClick={() => this.playBack(record.address)}>
                        播放
                      </a>
                    </div>
                  )}
                />
              </Table>
            </Fragment>
          );
        }
      }

      renderPlayModal = () => (
        <Modal
          className={styles.miniPlayerModal}
          visible={this.state.modalVisible}
          // title="Title"
          onCancel={this.closePlayModal}
          footer={null}
          destroyOnClose
        >
          <MiniPlayer src={this.state.playBackAddress} />
        </Modal>
      )

      render() {
        const {
          treeDatas, selectAreaKeys, expandedKeys, algorithmList = [],
          videoSrc, historyListData, imgDialogVisible, imgDialogSrc,
          noVideo, videoName, showText, modalShowInfo, pointsInfo,
          ifShowMoreDialog, traffiInfoData, historyID, sourceType, appliedTraffic, videoSrcs
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

        const emptyCallback = () => {};
        const getImg = () => (
          <Fragment>
            <div className={styles.allStatusBox}>
              <p>{showText}</p>
            </div>
            <div className={styles.emptySlider}>
              {/* <Slider marks={marks} included={false} defaultValue={37} /> */}
              <TimeRange
                mode={1}
                ticksNumber={24}
                selectedInterval={selectedInterval}
                timelineInterval={timelineInterval}
                onUpdateCallback={emptyCallback}
                onChangeCallback={emptyCallback}
                onSlideStart={emptyCallback}
                onSlideEnd={emptyCallback}
                // disabledIntervals={playableIntervals}
                disabled
              />
            </div>
          </Fragment>
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

        const ifActive = type => (sourceType === type ? `${styles.btnActive}` : '');

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
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.85)' }}>
                视频回放-
                {this.state.isListView ? '时间轴模式' : '列表模式' }
              </div>
              <div className={styles.switchBox}>
                <div>
                  <DatePicker />
                  <Button onClick={this.handleViewType} type="primary">
                    <Icon type="export" />
                    {this.state.isListView ? '列表视图' : '时间轴视图' }
                  </Button>
                </div>
              </div>
              {this.state.isListView
                ? (
                  videoSrcs ? (
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
                      {/* <VideoPlayer
                      src={videoSrc}
                      pointsInfo={pointsInfo}
                      appliedTraffic={appliedTraffic}
                    /> */}
                      <FlvPlayer
                        src={videoSrc}
                        lsrc={videoSrcs}
                        pointsInfo={pointsInfo}
                        appliedTraffic={appliedTraffic}
                      />
                    </Fragment>
                  )
                    : getImg()) : this.renderTables()}
            </div>
            {this.renderPlayModal()}
          </div>
        );
      }
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview);
