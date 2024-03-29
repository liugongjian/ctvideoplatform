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
import { urlPrefix, imageURI } from 'Constants/Dictionary';
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
  LABEL_PERSON,
  LABEL_CAR,
  Tag,
} from './constants';
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
    // image.className = 'AlarmCard-noImage';
    image.onerror = null;
    console.log('image.src', image.src);
    this.setState({ imageErr: true });
  };

  render() {
    const {
      data, onDelete, isLicenseExist, disableOperators
    } = this.props;
    const {
      importDialogVisible, imgDialogVisible, delVisible,
      imageErr,
    } = this.state;
    const {
      deviceName,
      algorithmName, algorithmCnName, imageCompress, image,
      controlRule, details, resTime, areaPath,
      type, plate, face, labelNames
    } = data;
    let recognizeType = '';
    if (plate) recognizeType = 'car';
    if (face) recognizeType = 'person';
    const detailExp = AlgoConfigs[algorithmName]?.alarmDetail;
    const hasImport = AlgoConfigs[algorithmName]?.carImport;
    let detail = null;
    const labels = labelNames?.length > 0 ? labelNames.split(',') : [];
    if (detailExp) {
      const reg = /\{(\w+)\}/g;
      detail = detailExp.replace(reg, (match, matchStr, index, stringObj) => ALARM_DETAIL_TYPE[type] || '未知目标');
    }
    return (
      <div className={`AlarmCard ${disableOperators ? 'AlarmCard-DisableOperators' : ''}`}>
        {
          disableOperators ? null : (
            <React.Fragment>
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
            </React.Fragment>
          )
        }
        <ImageModal
          visible={imgDialogVisible}
          closeModal={this.closeImgDialog}
          // src={`${imageURI}${image}`}
          data={data}
          handleImageError={e => this.handleImageError(e)}
        />
        <div className="AlarmCard-title">
          {/* // 头部空间不足 先删除icon */}
          {/* <img
            src={getImgUrl(algorithmName)}
            alt="icon"
            className={styles['AlarmCard-title-icon']}
          /> */}
        &nbsp;
          <span className="AlarmCard-title-name">{algorithmCnName || ''}</span>
          <span className="AlarmCard-title-time" title={resTime || ''}>
            {resTime || ''}
          </span>
        </div>
        <div className={`AlarmCard-imgWrapper ${imageErr ? '' : 'AlarmCard-imgWrapper-cursor'}`} onClick={imageErr ? () => {} : this.showImgDialog}>
          <div className="AlarmCard-imgWrapper-title" title={deviceName}>
            {deviceName}
          </div>
          <img
            src={`${imageURI}${imageCompress}`}
            alt="图片"
            onError={e => this.handleImageError(e)}
            className={imageErr ? 'AlarmCard-noImage' : ''}
          />
        </div>
        <div className="AlarmCard-contentWrapper">
          {/* <div>
            布控规则
            <EIcon type="myicon-alarmDetailIcon" />
            <span className={styles.span5px} />
            <span title={controlRule}>{controlRule}</span>
          </div> */}
          {/* {
            detail ? (
              <div>
                告警详情：
                <EIcon type="myicon-alarmDetailIcon" />
                <span className={styles.span5px} />
                <span title={detail}>{detail}</span>
              </div>
            ) : null
          } */}
          {
            recognizeType === '' ? null
              : (
                <React.Fragment>
                  {recognizeType === 'car' ? (

                    <div>
                      {/* 车牌： */}
                      <EIcon type="myicon-vehicleIcon" />
                      <span className={styles.span5px} />
                      {plate?.licenseNo || '-'}
                      <React.Fragment>
                        {
                          plate.label && LABEL_CAR[plate.label]
                            ? (<Tag title={LABEL_CAR[plate.label]} type={plate.label} />)
                            : null}
                      </React.Fragment>
                    </div>
                  ) : (
                    <div>
                      {/* 姓名： */}
                      <EIcon type="myicon-personNameIcon" />
                      <span className={styles.span5px} />
                      {face?.username || '-'}
                      <React.Fragment>
                        {
                        face?.label && LABEL_PERSON[face.label]
                          ? <Tag title={LABEL_PERSON[face.label]} type={face.label} />
                          : null}
                      </React.Fragment>
                    </div>
                  )}
                </React.Fragment>
              )
          }
          <div>
            {/* 设备区域： */}
            <EIcon type="myicon-alarmAreaIcon" />
            <span className={styles.span5px} />
            <span title={areaPath}>{areaPath}</span>
          </div>
          <div>
            {/* 抓拍点位（设备名称）： */}
            <EIcon type="myicon-locationIcon" />
            <span className={styles.span5px} />
            <span>{deviceName}</span>
          </div>
          <div>
            {/* 人车非标签 */}
            {
              labels.map(name => (<span className="AlarmCard-label">{name}</span>))
            }
          </div>
        </div>
        <div className="AlarmCard-operatorWrapper">
          {
            hasImport ? (
              <React.Fragment>
                <a onClick={this.showImportDialog}><EIcon type="myicon-import" /></a>
                <span className="AlarmCard-operatorWrapper-split" />
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
