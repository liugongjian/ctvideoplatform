import React, { Component } from 'react';
import {
  Select,
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

const mapStateToProps = state => ({ dashboard: state.dashboard });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class Dashboard extends Component {
  state = {
    test: '测试什么的'
  }

  componentDidMount() {
    // ajax code
  }

  render() {
    const { test } = this.state;
    const { dashboard } = this.props;
    return (
      <div className={styles.content}>
        456
        {test}
      </div>
    );
  }
}

Dashboard.propTypes = {
  dashboard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
