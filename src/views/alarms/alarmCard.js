import React, { Component } from 'react';
import {
  Select,
  Result,
} from 'antd';
import { bindActionCreators } from 'redux';
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


/**
 * props
 * @param {*} data
 * @param {*} onDelete
 */
const AlarmCard = ({ data, onDelete }) => {
  const a = 1;
  const {
    name, rule, detail, area
  } = data;
  const type = 'car';
  const hasDetail = true;
  return (
    <div className={styles.AlarmCard}>
      <div className={styles['AlarmCard-imgWrapper']}>
        <img
          src={TestJpg}
          alt="图片"
        />
      </div>
      <div>
        布控规则：
        {rule}
      </div>
      {
        hasDetail ? (
          <React.Fragment>
            {type === 'car' ? <div>车牌：</div> : <div>姓名：</div>}
            <div>归属底库：</div>
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
  );
};

export default AlarmCard;
