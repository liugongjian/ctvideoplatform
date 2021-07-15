import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import {
  Tree, Input, Select, Icon, Card, Spin, Modal, Button
} from 'antd';
import echarts from 'echarts';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  getAreaList, getHistoryListTopTen, getVideoSrc,
  getAreaInfo, getPeopleLIne, getCurrentTraffic, getVideoSnap
} from 'Redux/reducer/preview';

import { getAlgorithmList } from 'Redux/reducer/monitor';
import { urlPrefix, imageURI } from 'Constants/Dictionary';

import moment from 'moment';

// import {
//   ImageModal,
// } from 'Views/alarms/Modals';

import nostatus from 'Assets/nostatus.png';
import nodata from 'Assets/nodata.png';
import noImage from 'Assets/defaultFace.png';
import clickandchoose from 'Assets/clickandchoose.png';
import VideoPlayer from './VideoPlayer';
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
    getCurrentTraffic,
    getVideoSnap
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

const dateFormat = 'YYYYMMDD_HHmmss';

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
      pointsInfo: {},
      ifShowMoreDialog: false,
      tempTrafficEntry: -1,
      tempTrafficExit: -1,
      traffiInfoData: {},
      sourceType: 1,
      appliedTraffic: false,
      videoSquare: {},
      showSquaredDom: 1,
      chooseSquare: {},
      squareHistoryID: ''
    };
    this.mychart = null;
  }


  componentDidMount() {
    // 缓存四宫格，离开的时候是四宫格，进来的时候也是四宫格
    // this.changeNowStatus();
    this.getTreeData();
    this.getAlgorithmList();
  }


  componentWillUnmount() {
    const { squareHistoryID, videoSquare, showSquaredDom } = this.state;
    const squareInfo = {
      squareHistoryID,
      videoSquare,
      showSquaredDom
    };
    if (showSquaredDom === 4) {
      window.sessionStorage.setItem('squareInfo', JSON.stringify(squareInfo));
    } else {
      window.sessionStorage.removeItem('squareInfo');
    }
    this.clearTimer();
    // this.setState({
    //   videoSrc: null
    // });
  }

  changeNowStatus = () => {
    const squareInfo = JSON.parse(window.sessionStorage.getItem('squareInfo')) || {};
    const { showSquaredDom, videoSquare, squareHistoryID } = squareInfo;
    if (showSquaredDom && showSquaredDom === 4) {
      this.setState({
        showSquaredDom, videoSquare, squareHistoryID
      }, () => {
        // this.getVideoSrc();
        Object.keys(videoSquare).map(item => this.getVideoSrc(videoSquare[item].id, videoSquare[item].name, 'no', item));
        this.getHistory();
        this.getCurrentDay();
        this.setIntervalTimer();
      });
    }
  }

  changeToFourSquare = () => {
    const squareInfo = JSON.parse(window.sessionStorage.getItem('squareInfo')) || {};
    const { videoSquare = {}, squareHistoryID } = squareInfo;
    const { showSquaredDom } = this.state;
    if (showSquaredDom === 4 && Object.keys(videoSquare).length !== 0) {
      this.setState({
        videoSquare, squareHistoryID
      }, () => {
        // this.getVideoSrc();
        Object.keys(videoSquare).map(item => this.getVideoSrc(videoSquare[item].id, videoSquare[item].name, 'no', item));
        this.getHistory();
        this.getCurrentDay();
        this.setIntervalTimer();
      });
    }
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
      const deviceInfo = JSON.parse(window.sessionStorage.getItem('deviceInfo'));
      if (curDevice) {
        this.doubleClickHandle(undefined, curDevice);
      } else if (deviceInfo) {
        this.doubleClickHandle(undefined, deviceInfo);
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
      const { videoSrcOrder, showSquaredDom } = this.state;
      if (showSquaredDom === 1) {
        if (val.online) {
          this.setState({
            selectAreaKeys: [val.id],
            videoSrc: null,
            tempTotal: -1,
            historyID: val.id,
          }, () => {
            if (Object.keys(val).length > 0) {
              window.sessionStorage.setItem('deviceInfo', JSON.stringify(val));
            }
            this.getHistory();
            this.getPeopleArea(val.id);
            this.getCurrentDay();
            this.getVideoSrc(val.id, val.name);
          });
        } else {
          this.setState({
            selectAreaKeys: [val.id],
            videoSrc: null,
            showText: '设备已离线',
            historyID: val.id,
            tempTotal: -1,
            appliedTraffic: false, // fix 切换到离线设备时仍有上个设备人流信息
          }, () => {
            if (Object.keys(val).length > 0) {
              window.sessionStorage.setItem('deviceInfo', JSON.stringify(val));
            }
            this.getHistory();
            this.getCurrentDay();
            this.getVideoSrc(val.id, val.name);
            // this.getPeopleArea(val.id);
            this.setIntervalTimer();
          });
        }
      } else if (showSquaredDom === 4) {
        const { videoSquare } = this.state;
        if (val.online && videoSrcOrder) {
          // eslint-disable-next-line no-multi-assign
          const temp = {
            [`videoSrc${videoSrcOrder}`]: {
              ...val,
              src: ''
            }
          };
          videoSquare[`videoSrc${videoSrcOrder}`] = temp[`videoSrc${videoSrcOrder}`];
          this.setState({
            selectAreaKeys: [val.id],
            [`videoSrc${videoSrcOrder}`]: null,
            videoSquare: { ...videoSquare },
            tempTotal: -1,
            squareHistoryID: val.id,
            chooseSquare: temp[`videoSrc${videoSrcOrder}`]
          }, () => {
            this.getHistory();
            this.getPeopleArea(val.id);
            this.getCurrentDay();
            this.getVideoSrc(val.id, val.name);
            // this.setIntervalTimer();
          });
        }
      }
    }

    getPeopleArea = (id, val) => {
      const { getAreaInfo } = this.props;
      // 人流量检测算法id为 10
      getAreaInfo(id, 105).then((res) => {
        const { applied } = res;
        this.setState({
          appliedTraffic: applied,
          pointsInfo: res
        }, () => {
          this.setIntervalTimer();
        });
      });
    }

    getHistory = () => {
      const { historyID, showSquaredDom } = this.state;
      const { getHistoryListTopTen } = this.props;

      if (showSquaredDom === 1) {
        const param = {
          pageSize: 10,
          pageNo: 0,
          deviceId: historyID
        };
        if (historyID) {
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
      } else if (showSquaredDom === 4) {
        const { chooseSquare, squareHistoryID } = this.state;
        const param = {
          pageSize: 10,
          pageNo: 0,
          deviceId: squareHistoryID
        };
        getHistoryListTopTen(param).then((res) => {
          this.setState({
            historyListData: res,
            tempTotal: res.recordsTotal
          });
        });
      }
    }

    getCurrentDay = () => {
      const { getCurrentTraffic } = this.props;
      const {
        historyID, showSquaredDom, chooseSquare, squareHistoryID
      } = this.state;
      if (showSquaredDom === 1) {
        getCurrentTraffic(historyID, 105).then((res) => {
          const { tempTrafficEntry, tempTrafficExit } = this.state;
          if (tempTrafficEntry === -1 || tempTrafficExit === -1) {
            this.setState({
              traffiInfoData: res,
              tempTrafficExit: res.exitNo,
              tempTrafficEntry: res.entryNo
            });
          } else if (res.exitNo !== tempTrafficExit || res.entryNo !== tempTrafficEntry) {
            this.setState({
              traffiInfoData: res,
              tempTrafficExit: res.exitNo,
              tempTrafficEntry: res.entryNo
            });
          } else if (!res.exitNo || !res.entryNo) {
            this.setState({
              traffiInfoData: res,
              tempTrafficExit: res.exitNo || 0,
              tempTrafficEntry: res.entryNo || 0
            });
          }
        });
      } else if (showSquaredDom === 4) {
        getCurrentTraffic(squareHistoryID, 105).then((res) => {
          const { tempTrafficEntry, tempTrafficExit } = this.state;
          if (tempTrafficEntry === -1 || tempTrafficExit === -1) {
            this.setState({
              traffiInfoData: res,
              tempTrafficExit: res.exitNo,
              tempTrafficEntry: res.entryNo
            });
          } else if (res.exitNo !== tempTrafficExit || res.entryNo !== tempTrafficEntry) {
            this.setState({
              traffiInfoData: res,
              tempTrafficExit: res.exitNo,
              tempTrafficEntry: res.entryNo
            });
          } else if (!res.exitNo || !res.entryNo) {
            this.setState({
              traffiInfoData: res,
              tempTrafficExit: res.exitNo || 0,
              tempTrafficEntry: res.entryNo || 0
            });
          }
        });
      }
    }

    setIntervalTimer = () => {
      this.clearTimer();
      const { appliedTraffic } = this.state;
      this.state.timer = window.setInterval(() => {
        this.getHistory();
        if (appliedTraffic) {
          this.getCurrentDay();
        }
      }, 3000);
    }

    clearTimer = () => {
      window.clearInterval(this.state.timer);
      this.state.timer = null;
    }


    getVideoSrc = (id, name, condition, order) => {
      const { getVideoSrc } = this.props;
      const { showSquaredDom } = this.state;
      if (showSquaredDom === 1) {
        this.setState({
          showText: '加载中...'
        }, () => {
          getVideoSrc(id).then((res) => {
            if (res && res.flvuri) {
              this.setState({
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
                videoName: name,
                showText: '无信号'
              }, () => {
                window.clearTimeout(this.timer);
                this.timer = null;
              });
            }
          });
        });
      } else if (showSquaredDom === 4) {
        if (condition && condition === 'no') {
          getVideoSrc(id).then((res) => {
            if (res && res.flvuri) {
              const { videoSrcOrder, videoSquare } = this.state;
              const tempObj = {
                [order]: {
                  ...videoSquare[order],
                  showText: '',
                  src: res.flvuri
                }
              };
              videoSquare[order] = tempObj[order];
              this.setState({
                videoSquare: { ...videoSquare },
                videoSrcOrder: '',
                // chooseSquare: {}
              }, () => {

              });
            } else {
              //
            }
          });
        } else {
          const { videoSrcOrder, videoSquare } = this.state;
          const temp = {
            [`videoSrc${videoSrcOrder}`]: {
              ...videoSquare[`videoSrc${videoSrcOrder}`],
              showText: '加载中...'
            }
          };
          videoSquare[`videoSrc${videoSrcOrder}`] = temp[`videoSrc${videoSrcOrder}`];
          this.setState({
            videoSquare: { ...videoSquare }
          }, () => {
            getVideoSrc(id).then((res) => {
              if (res && res.flvuri) {
                const tempObj = {
                  [`videoSrc${videoSrcOrder}`]: {
                    ...videoSquare[`videoSrc${videoSrcOrder}`],
                    showText: '',
                    src: res.flvuri
                  }
                };
                videoSquare[`videoSrc${videoSrcOrder}`] = tempObj[`videoSrc${videoSrcOrder}`];
                this.setState({
                  videoSquare: { ...videoSquare },
                  videoSrcOrder: '',
                  chooseSquare: {}
                }, () => {

                });
              } else {
                // const tempObj = {
                //   [`videoSrc${videoSrcOrder}`]: {
                //     ...videoSquare[`videoSrc${videoSrcOrder}`],
                //     showText: '无信号',
                //     src: ''
                //   }
                // };
                // videoSquare[`videoSrc${videoSrcOrder}`] = tempObj[`videoSrc${videoSrcOrder}`];
                // this.setState({
                //   videoSquare: { ...videoSquare }
                // });
              }
            });
          });
        }

        // console.log('videoSquare=====>', videoSquare);
      }
    }

    clearVideo = (val) => {
      if (val) {
        this.setState(preState => ({
          videoSquare: {
            ...preState.videoSquare,
            [`videoSrc${val}`]: {}
          },
          historyListData: {}
        }), () => {
          this.clearTimer();
          if (val === 1) {
            window.sessionStorage.removeItem('deviceInfo');
          }
        });
      } else {
        this.setState({
          videoSrc: '',
          historyListData: {},
          showText: '无信号',
          historyID: ''
        }, () => {
          this.clearTimer();
          window.sessionStorage.removeItem('deviceInfo');
        });
      }
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
        // if (val.face && val.face.label !== 'OTHER') {
        if (val.face) {
          return (
            <div className={`${styles.alarmDetailInfo} ${styles.historyTextName}`}>
              <EIcon type={`${styles.alarmDetailInfoIcon} myicon-personNameIcon`} />
              <span>
                {val.face.username || '-'}
              </span>
              {this.getTag(LABEL_PERSON[val.face.label], val.face.label)}
            </div>
          );
        }
        // if (val.plate && val.plate.label !== 'OTHER') {
        if (val.plate) {
          return (
            <div className={`${styles.historyTextName} ${styles.alarmDetailInfo}`}>
              <EIcon type={`${styles.alarmDetailInfoIcon} myicon-vehicleIcon`} />
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
        getPeopleLIne(historyID, 105, sourceType).then((res) => {
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

      changeDomSquared = (showSquaredDom) => {
        this.setState({
          showSquaredDom,
          appliedTraffic: false,
          historyListData: {}
        }, () => {
          // 四宫格切换到一宫格
          if (showSquaredDom === 1) {
            const { videoSquare } = this.state;
            console.log('videoSquare.videoSrc1', videoSquare.videoSrc1);
            if (videoSquare.videoSrc1 && Object.keys(videoSquare.videoSrc1).length !== 0) {
              this.doubleClickHandle(undefined, videoSquare.videoSrc1);
            } else {
              this.doubleClickHandle(undefined, {});
            }
          } else {
            const deviceInfo = JSON.parse(window.sessionStorage.getItem('deviceInfo')) || {};
            if (Object.keys(deviceInfo).length !== 0) {
              const { videoSquare } = this.state;
              videoSquare.videoSrc1 = deviceInfo;
              this.setState({
                videoSquare,
                squareHistoryID: deviceInfo.id,
                chooseSquare: {
                  ...deviceInfo,
                  chooseNum: 1
                }
              }, () => {
                // this.getVideoSrc();
                Object.keys(videoSquare).map(item => this.getVideoSrc(videoSquare[item].id, videoSquare[item].name, 'no', item));
                this.getHistory();
                this.getCurrentDay();
                this.setIntervalTimer();
              });
            }
          }

          this.clearTimer();
          this.changeToFourSquare();
        });
      }

      getImg = () => {
        const { showText } = this.state;
        return (
          <div className={styles.allStatusBox}>
            <p>{showText}</p>
          </div>
        );
      };

      changeVideoOrder = (val) => {
        // const videoSrc = `videoSrc${val}`
        this.setState({
          // [`videoSrc${val}`]
          videoSrcOrder: val,
          chooseSquare: {}
        });
      }

      getAddIconDom = (val) => {
        const { videoSquare, videoSrcOrder, chooseSquare } = this.state;
        console.log('chooseSquare---------->', chooseSquare);
        if (videoSquare[`videoSrc${val}`] && videoSquare[`videoSrc${val}`].src) {
          const getCls = () => (chooseSquare.chooseNum === val ? `${styles.iconBtnWithFocus}` : '');
          return (
            <div className={`${styles.allStatusBox} ${getCls()}`}>
              <div className={styles.videoHandle}>
                <EIcon type={`${styles.videoMonitoring} myicon-monitoring`} />
                <div>
                  监控点位
                  {' '}
                  {videoSquare[`videoSrc${val}`].name}
                </div>
                <span>
                  <EIcon type={`${styles.snapVideoImg} myicon-snapshot`} onClick={() => this.getSnapVideo(videoSquare[`videoSrc${val}`])} />
                  <EIcon type={`${styles.videoCancelBtn} myicon-cancel`} onClick={() => this.clearVideo(val)} />
                </span>
              </div>
              <div className={styles.videoWrapBox}>
                <FlvPlayer
                  src={videoSquare[`videoSrc${val}`].src}
                  ifMask
                  maskClick={this.squareClick}
                  info={videoSquare[`videoSrc${val}`]}
                  key={val}
                  val={val}
                  cls={getCls()}
                  // pointsInfo={pointsInfo}
                  // appliedTraffic={appliedTraffic}
                />
              </div>
            </div>
          );
        }
        const getFocusCls = () => (videoSrcOrder === val ? `${styles.iconBtnWithFocus} ${styles.addVideoIconBtn}` : `${styles.addVideoIconBtn}`);
        return (
          <div className={`${styles.allStatusBox} ${getFocusCls()}`} key={val} onClick={() => { this.changeVideoOrder(val); }}>
            <img src={clickandchoose} alt="双击左侧点位添加摄像头" />
          </div>
        );
      }

      squareClick = (info, val) => {
        this.setState({
          chooseSquare: { ...info, chooseNum: val },
          videoSrcOrder: val,
          squareHistoryID: info.id
        }, () => {
          this.clearTimer();
          this.getHistory();
          this.getCurrentDay();
          this.setIntervalTimer();
        });
      }

      getDomSquared = () => {
        const {
          showSquaredDom, videoSrc, videoName, pointsInfo, appliedTraffic, historyID
        } = this.state;
        if (showSquaredDom === 1) {
          return historyID
            ? (
              <Fragment>
                <div className={styles.videoHandle}>
                  <EIcon type={`${styles.videoMonitoring} myicon-monitoring`} />
                  <div>
                    监控点位
                    {' '}
                    {videoName}
                  </div>

                  <span>
                    <EIcon type={`${styles.snapVideoImg} myicon-snapshot`} onClick={() => this.getSnapVideo(0)} />
                    <EIcon type={`${styles.videoCancelBtn} myicon-cancel`} onClick={() => this.clearVideo(0)} />
                  </span>

                </div>
                {/* <VideoPlayer
        src={videoSrc}
        pointsInfo={pointsInfo}
        appliedTraffic={appliedTraffic}
      /> */}
                <div className={styles.videoWrapBox}>
                  <FlvPlayer
                    src={videoSrc}
                    pointsInfo={pointsInfo}
                    appliedTraffic={appliedTraffic}
                    ifMask={false}
                  />
                </div>
              </Fragment>
            )
            : this.getImg();
        } if (showSquaredDom === 4) {
          const tempArr = [1, 2, 3, 4];
          return (
            <div className={styles.videoSquaredByFour}>
              {tempArr.map(item => this.getAddIconDom(item))}
            </div>
          );
        }
      }

      getSnapVideo = (info) => {
        if (!info) {
          const { getVideoSnap } = this.props;
          const { historyID, videoName } = this.state;
          getVideoSnap(historyID).then((res) => {
            const imgUrl = `data:image/png;base64,${res}`;
            const a = document.createElement('a');
            const imgName = `${videoName}_${moment().format(dateFormat)}`;
            a.href = imgUrl;
            a.setAttribute('download', imgName);
            a.click();
          });
        } else {
          const { getVideoSnap } = this.props;
          const { id, name } = info;
          getVideoSnap(id).then((res) => {
            const imgUrl = `data:image/png;base64,${res}`;
            const a = document.createElement('a');
            const imgName = `${name}_${moment().format(dateFormat)}`;
            a.href = imgUrl;
            a.setAttribute('download', imgName);
            a.click();
          });
        }
      }

      chooseSquareCls = (num) => {
        const { showSquaredDom } = this.state;
        return showSquaredDom === num ? `${styles.activeChoice}` : '';
      }

      getHistoryDom = (data) => {
        if (!data || !data.length) {
          return <div className={styles.noHistoryList}>暂无告警</div>;
        }
        return data.map(item => (
          <div
            className={styles.historyItem}
            onClick={() => this.showImgDialog(item)}
            key={item.id}
          >
            <img src={`${imageURI}${item.imageCompress}`} alt="" />
            <div className={styles.historyTextBox}>
              <span className={styles.historyTextName}>{item.algorithmCnName}</span>
              <span className={styles.historyTime}>{item.resTime}</span>
            </div>
          </div>
        ));
      }

      render() {
        const {
          treeDatas, selectAreaKeys, expandedKeys, algorithmList = [],
          videoSrc, historyListData, imgDialogVisible, imgDialogSrc,
          noVideo, videoName, showText, modalShowInfo, pointsInfo,
          ifShowMoreDialog, traffiInfoData, historyID, sourceType, appliedTraffic,
          showSquaredDom
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
                  size="small"
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
              <div className={styles.videoChooseSquare}>
                <span className={styles.videoChooseSquareText}>分屏：</span>
                <EIcon type={`${styles.videoChooseBtn} ${this.chooseSquareCls(1)} myicon-oneSquare`} onClick={() => this.changeDomSquared(1)} />
                <EIcon type={`${styles.videoChooseBtn} ${this.chooseSquareCls(4)} myicon-fourSquare`} onClick={() => this.changeDomSquared(4)} />
                <EIcon type={`${styles.videoChooseBtn} myicon-intofullscreen ${styles.intoFullScreen}`} />
              </div>
              {this.getDomSquared()}
            </div>
            <div className={styles.historyList}>
              {historyID && appliedTraffic ? (
                <div className={styles.peopleAreaCounts}>
                  <div className={styles.peopleAreaTotal}>
                    <p>
                      今日人流量统计
                      <a onClick={this.showMoreDialog}>更多数据</a>
                    </p>
                  </div>
                  <div className={styles.peopleAreaNum}>
                    <div>
                      <span className={styles.peopleAreaKind}>流入</span>
                      <span className={styles.peopleAreaAll}>{traffiInfoData.entryNo || 0}</span>
                    </div>
                    <div>
                      <span className={styles.peopleAreaKind}>流出</span>
                      <span className={styles.peopleAreaAll}>{traffiInfoData.exitNo || 0}</span>
                    </div>
                  </div>
                </div>
              )
                : null}

              <div className={styles.historyTitle}>
                <p>
                  实时告警记录
                  <a onClick={() => push('/alarms')}>历史记录</a>
                </p>
              </div>
              <div className={styles.historyListCard}>
                {
                  this.getHistoryDom(list)
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
                <img src={`${imageURI}${imgDialogSrc}`} onError={this.handleImageError} alt="" />
                <div className={styles.alarmModalName}>{modalShowInfo.algorithmCnName}</div>
              </div>
              <div className={styles.alarmDetailInfoBox}>
                <div className={styles.alarmDetailInfo}>
                  <EIcon type={`${styles.alarmDetailInfoIcon} myicon-alarmAreaIcon`} />
                  <span>{modalShowInfo.areaPath}</span>
                </div>
                <div className={styles.alarmDetailInfo}>
                  <EIcon type={`${styles.alarmDetailInfoIcon} myicon-alarmTimeIcon`} />
                  <span>{modalShowInfo.resTime}</span>
                </div>
                <div className={styles.alarmDetailInfo}>
                  <EIcon type={`${styles.alarmDetailInfoIcon} myicon-locationIcon`} />
                  <span>{modalShowInfo.deviceName}</span>
                </div>

                {this.getTypeContent(modalShowInfo)}
                {/** <div  className={styles.alarmDetailInfo}>
                <EIcon type="myicon-alarmDetailIcon" />
                <span>{modalShowInfo.controlRule}</span>
          </div> * */}
              </div>
            </Modal>
            <Modal
              title="人流量统计"
              visible={ifShowMoreDialog}
              onCancel={this.closeMoreDialog}
              forceRender
              destroyOnClose
              footer={null}
              wrapClassName={styles.chartsDetailModal}
              width="740px"
              // style={{ height: '400px', width: '560px' }}
            >
              <div className={styles.chartsModalBox}>
                <div className={styles.modalPeopleInfo}>
                  <span onClick={() => this.changeType(1)} className={ifActive(1)}>小时</span>
                  <span onClick={() => this.changeType(2)} className={ifActive(2)}>天</span>
                </div>
                <div className={styles.modalChartsInfo} id="modalChartsInfo" />
              </div>

            </Modal>
          </div>
        );
      }
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview);
