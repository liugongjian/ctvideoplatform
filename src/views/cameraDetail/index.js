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
// import { getSummary, getMonitorMetric } from 'Redux/reducer/monitor';
import BasicSettings from './basic/basicSettings';
import AlgorithmSettings from './algorithm/algorithmSettings';

import styles from './index.less';

const { TabPane } = Tabs;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class CameraDetail extends Component {
  constructor() {
    super();
    this.state = {
      curTab: 'basic',
    };
  }

  componentDidMount() {
    // ajax code
  }

  render() {
    const { curTab } = this.state;
    const algoId = '82808096775c78ad01775c79f3420000';
    return (
      <div className={styles.cameraDetail}>
        <Tabs activeKey={curTab} onChange={curTab => this.setState({ curTab })}>
          <TabPane tab="基础配置" key="basic">
            <BasicSettings algoId={algoId} />
          </TabPane>
          <TabPane tab="算法配置" key="algo">
            <AlgorithmSettings />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

CameraDetail.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraDetail);
