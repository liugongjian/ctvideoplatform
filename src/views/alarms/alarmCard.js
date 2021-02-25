/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { Component } from 'react';
import {
  Select,
  Result,
} from 'antd';
import { bindActionCreators } from 'redux';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import { random } from 'lodash';
import TestJpg from './test.jpg';
// import { push } from 'react-router-redux';
// import PropTypes from 'prop-types';
// import {
//   getSummary, getMonitorMetric,
// } from 'Redux/reducer/dashboard';

import styles from './index.less';

// const { Option } = Select;


const getImgUrl = (name) => {
  const arr = [
    'carPersonCheck', 'faceRecognize', 'plateRecognize', 'areaAlarm', 'stepWallCheck', 'peopleTraffic', 'plateTraffic', 'safetyHat',
    'workingClothes', 'carTypeDetect', 'peopleCrowd', 'fightDetect', 'fallDownDetect', 'roadsideStall', 'wanderTarry'
  ];
  if (arr.indexOf(name) > -1) {
    return require(`Assets/algorithmIcons/${name}.png`);
  }
  return require('Assets/algorithmIcons/default.png');
};

const Tag = ({
  title, color = '#F5222D', borderColor = '#FFA39E', background = '#FFF1F0'
}) => (
  <span
    className={styles.AlarmCardTag}
    style={{
      color,
      border: `1px solid ${borderColor}`,
      background
    }}
  >
    {title}
  </span>
);

const mapStateToProps = state => ({ alarms: state.alarms });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
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
    };
  }

  componentDidMount() {
  }

  showImportDialog = () => {
    this.setState({ importDialogVisible: true });
  };

  showImgDialog = () => {
    this.setState({ imgDialogVisible: true });
  };

  render() {
    const { data, onDelete } = this.props;
    const {
      name, rule, detail, area, time
    } = data;
    const type = 'car';
    const hasDetail = Math.random() > 0.5;
    const hasImport = Math.random() > 0.5;
    return (
      <div className={styles.AlarmCard}>
        <div className={styles['AlarmCard-title']}>
          {/*
          // 头部空间不足 先删除icon
           <img src={getImgUrl('carPersonCheck')}
          alt="icon" className={styles['AlarmCard-title-icon']} />
        &nbsp; */}
          <span className={styles['AlarmCard-title-name']}>{name || ''}</span>
          <span className={styles['AlarmCard-title-time']}>{time || ''}</span>
        </div>
        <div className={styles['AlarmCard-imgWrapper']} onClick={this.showImgDialog}>
          <img
            src={TestJpg}
            alt="图片"
          />
        </div>
        <div className={styles['AlarmCard-contentWrapper']}>
          <div>
            布控规则：
            {rule}
          </div>
          {
            hasDetail ? (
              <React.Fragment>
                {type === 'car' ? (
                  <div>
                    车牌：
                    <Tag title="黑名单" />
                  </div>
                ) : <div>姓名：</div>}
              </React.Fragment>
            ) : (
              <div>
                告警详情：
                {detail}
              </div>
            )
          }
          <div>
            设备区域：
            {area}
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
          <a><EIcon type="myicon-delete" /></a>
        </div>
      </div>
    );
  }
}

// AlarmCard.propTypes = {
//   dashboard: PropTypes.object.isRequired,
// };

export default connect(mapStateToProps, mapDispatchToProps)(AlarmCard);

/**
 * props
 * @param {*} data
 * @param {*} onDelete
 */
// const AlarmCard = ({ data, onDelete }) => {
// };

// export default AlarmCard;
