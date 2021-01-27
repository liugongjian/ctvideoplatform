import React, { Component } from 'react';
import {
  Select,
  Tabs,
  Form,
  Input,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { getSummary, getMonitorMetric } from 'Redux/reducer/monitor';
import BasicSettings from './basicSettings';

import styles from './index.less';

const { TabPane } = Tabs;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class Monitor extends Component {
  constructor() {
    super();
    this.state = {
      curTab: 1,
    };
  }

  componentDidMount() {
    // ajax code
  }

  render() {
    const { curTab } = this.state;
    return (
      <div className={styles.content}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="基础配置" key="1">
            <BasicSettings />
          </TabPane>
          <TabPane tab="算法配置" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

Monitor.propTypes = {
  monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
