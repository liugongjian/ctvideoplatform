/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { message, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import { random } from 'lodash';
import {
  importLicense, isLicenseExist
} from 'Redux/reducer/alarms';
import { urlPrefix } from 'Constants/Dictionary';
import noImage from 'Assets/defaultFace.png';
import DeleteModal from 'Components/modals/warnModal';
import moment from 'moment';
import {
  LicenseImportModal,
  ImageModal,
} from './Modals';
import {
  AlgoConfigs,
  ALARM_DETAIL_TYPE,
  LABEL,
} from './constants';
import TestJpg from './test.jpg';
// import { push } from 'react-router-redux';
// import PropTypes from 'prop-types';
// import {
//   getSummary, getMonitorMetric,
// } from 'Redux/reducer/dashboard';
import styles from './index.less';

// const { Option } = Select;
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const showFormat = 'YYYY/MM/DD HH:mm:ss';

const getImgUrl = (name) => {
  const arr = [
    'carPersonCheck', 'faceRecognize', 'plateRecognize', 'areaAlarm', 'stepWallCheck', 'peopleTraffic', 'plateTraffic', 'safetyHat',
    'workingClothes', 'carTypeDetect', 'peopleCrowd', 'fightDetect', 'fallDownDetect', 'roadsideStall', 'wanderTarry', 'maskDetect',
    'sleepDetect', 'fireDetect', 'dutyDetect', // 'fireEngineBlock'
  ];
  if (arr.indexOf(name) > -1) {
    return require(`Assets/algorithmIcons/${name}.png`);
  }
  return require('Assets/algorithmIcons/default.png');
};

const Tag = ({
  title,
  // color = '#F5222D', borderColor = '#FFA39E', background = '#FFF1F0'
  type
}) => (
  <span
    className={`${styles.AlarmCardTag} ${styles[`AlarmCardTag-${type}`]}`}
    // style={{
    //   color,
    //   border: `1px solid ${borderColor}`,
    //   background
    // }}
  >
    {title}
  </span>
);

const mapStateToProps = state => ({ alarms: state.alarms });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    importLicense, isLicenseExist
  },
  dispatch
);
/**
 * props
 * @param {*} data
 * @param {*} onDelete
 */
class AlarmCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importDialogVisible: false,
      imgDialogVisible: false,
      delVisible: false,
      imageErr: false,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps?.data?.imageCompress !== this.props?.data?.imageCompress) {
      this.setState({
        imageErr: false,
      });
    }
  }

  showImportDialog = () => {
    this.setState({ importDialogVisible: true });
  };

  handleImport = (data) => {
    this.props.importLicense(data).then((res) => {
      console.log('import', res);
      this.closeImportDialog();
      message.success('导入成功');
    }).catch((err) => {
      console.log('import-err', err);
    });
  }

  closeImportDialog = () => {
    this.setState({ importDialogVisible: false });
  };

  showDelDialog = () => {
    this.setState({ delVisible: true });
  };

  handleDelete = () => {
    // 1.删除操作 2.刷新列表（外部传入？emit？
    const { data, onDelete, isLicenseExist } = this.props;
    onDelete(data?.id);
  }

  closeDelDialog = () => {
    this.setState({ delVisible: false });
  };

  showImgDialog = () => {
    this.setState({ imgDialogVisible: true });
  };

  closeImgDialog = () => {
    this.setState({ imgDialogVisible: false });
  };

  handleImageError = (e) => {
    const image = e.target;
    image.src = noImage;
    image.className = styles['AlarmCard-noImage'];
    image.onerror = null;
    this.setState({ imageErr: true });
  };

  render() {
    const { data, onDelete, isLicenseExist } = this.props;
    const {
      importDialogVisible, imgDialogVisible, delVisible,
      imageErr,
    } = this.state;
    const {
      deviceName,
      algorithmName, algorithmCnName, imageCompress, image,
      controlRule, details, resTime, areaPath,
      type, plate, face
    } = data;
    let recognizeType = '';
    if (plate) recognizeType = 'car';
    if (face) recognizeType = 'person';
    const detailExp = AlgoConfigs[algorithmName]?.alarmDetail;
    const hasImport = AlgoConfigs[algorithmName]?.carImport;
    let detail = null;
    if (detailExp) {
      const reg = /\{(\w+)\}/g;
      detail = detailExp.replace(reg, (match, matchStr, index, stringObj) => ALARM_DETAIL_TYPE[type] || '未知目标');
    }
    return (
      <div className={styles.AlarmCard}>
        <LicenseImportModal
          visible={importDialogVisible}
          handleImport={this.handleImport}
          closeModal={this.closeImportDialog}
          isLicenseExist={isLicenseExist}
          initailVal={plate}
        />
        <DeleteModal
          visible={delVisible}
          content="您确定要删除该条告警信息吗？"
          handleOk={this.handleDelete}
          closeModal={this.closeDelDialog}
        />
        <ImageModal
          visible={imgDialogVisible}
          closeModal={this.closeImgDialog}
          src={`${urlPrefix}${image}`}
          handleImageError={e => this.handleImageError(e)}
        />
        <div className={styles['AlarmCard-title']}>
          {/* // 头部空间不足 先删除icon */}
          {/* <img
            src={getImgUrl(algorithmName)}
            alt="icon"
            className={styles['AlarmCard-title-icon']}
          /> */}
        &nbsp;
          <span className={styles['AlarmCard-title-name']}>{algorithmCnName || ''}</span>
          <span className={styles['AlarmCard-title-time']} title={resTime || ''}>
            {resTime || ''}
          </span>
        </div>
        <div className={`${styles['AlarmCard-imgWrapper']} ${imageErr ? '' : styles['AlarmCard-imgWrapper-cursor']}`} onClick={imageErr ? () => {} : this.showImgDialog}>
          <div className={styles['AlarmCard-imgWrapper-title']} title={deviceName}>
            {deviceName}
          </div>
          <img
            src={`${urlPrefix}${imageCompress}`}
            alt="图片"
            onError={e => this.handleImageError(e)}
          />
        </div>
        <div className={styles['AlarmCard-contentWrapper']}>
          <div>
            布控规则：
            <span title={controlRule}>{controlRule}</span>
          </div>
          {
            detail ? (
              <div>
                告警详情：
                <span title={detail}>{detail}</span>
              </div>
            ) : null
          }
          {
            recognizeType === '' ? null
              : (
                <React.Fragment>
                  {recognizeType === 'car' ? (
                    plate?.licenseNo ? (
                      <div>
                        车牌：
                        {plate?.licenseNo || '-'}
                        <React.Fragment>
                          {
                            plate.label && LABEL[plate.label]
                              ? (<Tag title={LABEL[plate.label]} type={plate.label} />)
                              : null}
                        </React.Fragment>
                      </div>
                    ) : null
                  ) : (
                      face?.username ? (
                        <div>
                          姓名：
                          {face?.username || '-'}
                          <React.Fragment>
                            {
                        face?.label && LABEL[face.label]
                          ? <Tag title={LABEL[face.label]} type={face.label} />
                          : null}
                          </React.Fragment>
                        </div>
                      ) : null
                  )}
                </React.Fragment>
              )
          }
          <div>
            设备区域：
            <span title={areaPath}>{areaPath}</span>
          </div>
        </div>
        <div className={styles['AlarmCard-operatorWrapper']}>
          {
            hasImport ? (
              <React.Fragment>
                <a onClick={this.showImportDialog}><EIcon type="myicon-import" /></a>
                <span className={styles['AlarmCard-operatorWrapper-split']} />
              </React.Fragment>
            ) : null
          }
          <a onClick={this.showDelDialog}>
            {/* <Icon type="anticon-delete" /> */}
            <EIcon type="myicon-delete" />
          </a>
        </div>
      </div>
    );
  }
}

// AlarmCard.propTypes = {
//   dashboard: PropTypes.object.isRequired,
// };

export default connect(mapStateToProps, mapDispatchToProps)(AlarmCard);
