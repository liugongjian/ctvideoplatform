import React, { Component } from 'react';
import {
  Select,
  Result,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getSummary, getMonitorMetric,
} from 'Redux/reducer/dashboard';

import styles from './index.less';

const { Option } = Select;

const mapStateToProps = state => ({ alarms: state.alarms });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class Alarms extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className={styles.alarms}>
        告警信息
      </div>
    );
  }
}

// Alarms.propTypes = {
//   dashboard: PropTypes.object.isRequired,
// };

export default connect(mapStateToProps, mapDispatchToProps)(Alarms);
