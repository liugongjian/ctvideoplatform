import React, { Component } from 'react';
import {
  Select,
  Spin,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getAlarmDistribute,
} from 'Redux/reducer/dashboard';
import Pie from 'Components/echarts/Pie';
import {
  getSummary, getMonitorMetric,
} from 'Redux/reducer/dashboard';

import styles from './index.less';

const { Option } = Select;

const mapStateToProps = state => ({ dashboard: state.dashboard });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAlarmDistribute
  },
  dispatch
);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: '1'
    };
  }

  componentDidMount() {
    // ajax code
    this.initData();
  }

  initData = () => {
    this.props.getAlarmDistribute({
      period: 3
    }).then((res) => {
      console.log('111', res);
    });
  }

  render() {
    const { test } = this.state;
    const {
      dashboard: {
        alarmDistribute, alarmDistributeLoading
      }
    } = this.props;
    return (
      <div className={styles.VideoDashboard}>
        <div className={styles.panelTop}>
          <div className={styles.panelTopLeft}>
            <div className={styles.PreviewDatas}>
              <div className={styles.PreviewData}>
                <div className={styles['PreviewData-title']}>已接入设备数</div>
                <div className={styles['PreviewData-number']}>345,560</div>
                <div className={styles['PreviewData-split']} />
                <div className={styles['PreviewData-title']}>算法配置占比</div>
                <div className={styles['PreviewData-number']}>78%</div>
                <div className={styles['PreviewData-text']}>已配置算法设备数  12,423</div>
              </div>
              <div className={styles.PreviewData}>
                <div className={styles['PreviewData-title']}>在线设备数</div>
                <div className={styles['PreviewData-number']}>345,560</div>
                <div className={styles['PreviewData-text']}>在线设备率  80%</div>
                <div className={styles['PreviewData-split']} />
                <div className={styles['PreviewData-title']}>离线设备数</div>
                <div className={styles['PreviewData-number']}>40,000</div>
              </div>
              <div className={styles.PreviewData}>
                <div className={styles['PreviewData-title']}>今日告警数</div>
                <div className={styles['PreviewData-number']}>345,560</div>
                <div className={styles['PreviewData-text']}>本周告警数  134，340</div>
                <div className={styles['PreviewData-text']}>累计告警数  1345，340</div>
              </div>
            </div>
            <div className={styles.AlarmStatistics}>
              告警统计
            </div>
          </div>
          <div className={styles.RealtimeAlarms}>
            实时告警
          </div>
        </div>
        <div className={styles.panelBottom}>
          <div className={styles['panelBottom-algoStatus']}>
            算法配置状态
          </div>
          <div className={styles['panelBottom-algoTimes']}>
            <div className={styles.panelTitle}>算法告警分布</div>
            {/* <Spin spinning={alarmDistributeLoading} style={{ height: '100%' }}> */}
            <Pie
              id="123"
              width="100%"
              height="100%"
              data={{ data: alarmDistribute?.distributorPieMap, title: '算法告警分布' }}
              loading={alarmDistributeLoading}
            />
            {/* </Spin> */}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  dashboard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
