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
} from 'Redux/reducer/monitor';

import styles from './index.less';

const { Option } = Select;

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class Monitor extends Component {
  state = {
    test: '测试什么的'
  }

  componentDidMount() {
    // ajax code
  }

  render() {
    const { test } = this.state;
    const { monitor } = this.props;
    return (
      <div className={styles.content}>
        123
        {test}
      </div>
    );
  }
}

Monitor.propTypes = {
  monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
