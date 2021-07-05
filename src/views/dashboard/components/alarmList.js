/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Modal
} from 'antd';
import {
  getHistoryListTopTen
} from 'Redux/reducer/preview';
import EIcon from 'Components/Icon';
import { urlPrefix, imageURI } from 'Constants/Dictionary';
import noImage from 'Assets/defaultFace.png';
import nodata from 'Assets/nodata.png';
import styles from './index.less';

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getHistoryListTopTen,
  },
  dispatch
);

const getImgUrl = (name) => {
  const arr = [
    'carPersonCheck', 'faceRecognize', 'plateRecognize', 'areaAlarm', 'stepWallCheck', 'peopleTraffic', 'plateTraffic', 'safetyHat',
    'workingClothes', 'carTypeDetect', 'peopleCrowd', 'fightDetect', 'fallDownDetect', 'roadsideStall', 'wanderTarry', 'maskDetect'
  ];
  if (arr.indexOf(name) > -1) {
    return require(`Assets/algorithmIcons/${name}.png`);
  }
  return require('Assets/algorithmIcons/default.png');
};

const typeToText = {
  PERSON: '行人',
  CAR: '机动车',
  NONVEHICLE: '非机动车',
  OTHER: '其他'
};

const LABEL_PERSON = {
  WHITE: '白名单', BLACK: '黑名单', OTHER: '陌生人'
};

const LABEL_CAR = {
  WHITE: '白名单', BLACK: '黑名单', OTHER: '其他'
};

class AlarmList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmData: {},
      recordsTotal: 0,
      modalShowInfo: '',
      ifShowModal: false
    };
    this.timer = null;
  }

  componentDidMount() {
    this.getAlarmData();
    this.setInter();
  }

  componentWillUnmount() {
    this.clearInter();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // console.log('nextProps', nextProps);
  //   return false;
  // }

  getAlarmData = () => {
    const { getHistoryListTopTen } = this.props;
    // console.log('getHistoryListTopTen', getHistoryListTopTen);
    const param = {
      pageSize: 10,
      pageNo: 0,
    };
    getHistoryListTopTen(param).then((res) => {
      const { recordsTotal } = this.state;
      if (recordsTotal !== res.recordsTotal) {
        this.setState({
          alarmData: res
        });
      }
    });
  }

  setInter = () => {
    this.timer = window.setInterval(() => {
      this.getAlarmData();
    }, 3000);
  }

  clearInter = () => {
    window.clearInterval(this.timer);
    this.timer = null;
  }

  detailModal = (val) => {
    this.setState({
      modalShowInfo: val,
      ifShowModal: true
    });
  }

  closeModal = () => {
    this.setState({
      ifShowModal: false
    });
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
    if (val.face) {
      return (
        <div className={`${styles.historyTextName} ${styles.alarmDetailInfo}`}>
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
  }

  getIconType = (item) => {
    const iconarr = ['carMonitor', 'helmetDetect'];
    const iconmap = {
      carMonitor: 'plateRecognize',
      helmetDetect: 'safetyHat',
    };
    if (item) {
      if (item.algorithmName.indexOf('DS') > -1) {
        const newType = item.algorithmName.substring(0, item.algorithmName.length - 2);
        if (iconarr.indexOf(newType) > -1) {
          return `myicon-algo-${iconmap[newType]}`;
        }
        return `myicon-algo-${newType} ${styles.algorithmIcon}`;
      }
      return `myicon-algo-${item.algorithmName} ${styles.algorithmIcon}`;
    }
    return `${styles.algorithmIcon}`;
  }

  render() {
    const { alarmData, ifShowModal, modalShowInfo } = this.state;
    const getAlarmDom = () => (alarmData.list ? alarmData.list.map(item => (
      <div key={item.id} className={styles.alarmDetail}>
        <div className={styles.alramDetailIcon}>
          {/** <img src={getImgUrl(item.algorithmName)} alt="" /> */}
          <EIcon type={this.getIconType(item)} alt="icon" />
        </div>
        <div className={styles.alarmDetailInfo}>
          <p>
            <span className={styles.alarmDetailName}>
              {item.algorithmCnName}
            </span>
            <span className={styles.alarmDetailType}>
              {typeToText[item.type]}
            </span>
            <span className={styles.alarmDetailTime}>
              {item.resTime}
            </span>
          </p>
          <p className={styles.alarmDetailDeviceName}>{item.deviceName}</p>
        </div>
        <div className={styles.lookDetail} onClick={() => this.detailModal(item)}>查看</div>
      </div>
    )) : (
      <div className={styles.nodataBox}>
        <img src={nodata} alt="" />
      </div>
    ));
    return (
      <div className={styles.alarmListBox}>
        {
          getAlarmDom()
        }
        <Modal
          title="告警记录"
          visible={ifShowModal}
          onCancel={this.closeModal}
          className={styles.pswModal}
          forceRender
          destroyOnClose
          width="560px"
          footer={null}
          wrapClassName={styles.alarmDetailModal}
        >
          <div className={styles.alarmListImg}>
            <img src={`${imageURI}${modalShowInfo.image}`} onError={this.handleImageError} alt="" />
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
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AlarmList);
