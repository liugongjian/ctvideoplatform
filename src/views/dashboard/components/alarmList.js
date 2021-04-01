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
import { urlPrefix } from 'Constants/Dictionary';
import noImage from 'Assets/defaultFace.png';
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
    // this.setInter();
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
    }, 5000);
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

  render() {
    const { alarmData, ifShowModal, modalShowInfo } = this.state;
    const getAlarmDom = () => alarmData.list && alarmData.list.map(item => (
      <div key={item.id} className={styles.alarmDetail}>
        <div className={styles.alramDetailIcon}>
          <img src={getImgUrl(item.algorithmName)} alt="" />
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
          <p>{item.deviceName}</p>
        </div>
        <div className={styles.lookDetail} onClick={() => this.detailModal(item)}>查看</div>
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
            <img src={`${urlPrefix}${modalShowInfo.image}`} onError={this.handleImageError} alt="" />
            <div className={styles.alarmModalName}>{modalShowInfo.algorithmCnName}</div>
          </div>
          <p>
            告警区域：
            <span>{modalShowInfo.areaPath}</span>
          </p>
          <p>
            人员姓名：
            <span>{modalShowInfo.areaPath}</span>
          </p>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AlarmList);
