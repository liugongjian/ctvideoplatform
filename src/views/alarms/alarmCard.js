import React, { Component } from 'react';
import {
  Select,
  Result,
} from 'antd';
import { bindActionCreators } from 'redux';
import EIcon from 'Components/Icon';
import { connect } from 'react-redux';
import TestJpg from './test.jpg';
// import { push } from 'react-router-redux';
// import PropTypes from 'prop-types';
// import {
//   getSummary, getMonitorMetric,
// } from 'Redux/reducer/dashboard';

import styles from './index.less';

// const { Option } = Select;

// const mapStateToProps = state => ({ alarms: state.alarms });
// const mapDispatchToProps = dispatch => bindActionCreators(
//   {},
//   dispatch
// );

// class Alarms extends Component {
//   componentDidMount() {
//   }

//   render() {
//     return (
//       <div className={styles.alarms}>
//         告警信息
//       </div>
//     );
//   }
// }

// // Alarms.propTypes = {
// //   dashboard: PropTypes.object.isRequired,
// // };

// export default connect(mapStateToProps, mapDispatchToProps)(Alarms);

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

/**
 * props
 * @param {*} data
 * @param {*} onDelete
 */
const AlarmCard = ({ data, onDelete }) => {
  const a = 1;
  const {
    name, rule, detail, area, time
  } = data;
  const type = 'car';
  const hasDetail = true;
  const showImportDialog = () => {

  };
  return (
    <div className={styles.AlarmCard}>
      <div className={styles['AlarmCard-title']}>
        <img src={getImgUrl('carPersonCheck')} alt="icon" className={styles['AlarmCard-title-icon']} />
        &nbsp;
        <span className={styles['AlarmCard-title-name']}>{name || ''}</span>
        <span className={styles['AlarmCard-title-time']}>{time || ''}</span>
      </div>
      <div className={styles['AlarmCard-imgWrapper']}>
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
              {type === 'car' ? <div>车牌：</div> : <div>姓名：</div>}
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
        <a onClick={showImportDialog}><EIcon type="myicon-import" /></a>
        <span className={styles['AlarmCard-operatorWrapper-split']} />
        <a><EIcon type="myicon-delete" /></a>
      </div>
    </div>
  );
};

export default AlarmCard;
