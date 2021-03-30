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
  getAlarmDistribute, getAlgoConfs, getAlarmTrend, getAlgoItems
} from 'Redux/reducer/dashboard';
import Pie from 'Components/echarts/Pie';
import Bar from 'Components/echarts/SimpleBar';
import moment from 'moment';
import PeriodFilter from './components/periodFilter';
import AlarmList from './components/alarmList';

import styles from './index.less';

const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';
const TYPE_ALL_ALGO_STATC = '1';
const mapStateToProps = state => ({ dashboard: state.dashboard });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAlarmDistribute, getAlgoConfs, getAlarmTrend, getAlgoItems
  },
  dispatch
);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      period: 1,
      startTime: moment(),
      endTime: moment(),
      type: TYPE_ALL_ALGO_STATC,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    this.props.getAlgoItems();
    this.getAlarmTrend();
    this.getAlarmDistribute();
    this.props.getAlgoConfs();
  }

  getAlarmTrend = () => {
    this.props.getAlarmTrend(1);
  }

  getAlarmDistribute=() => {
    const { period, startTime, endTime } = this.state;
    this.props.getAlarmDistribute({
      period,
      startTime: moment(startTime).format(dateFormat),
      endTime: moment(endTime).format(dateFormat),
    });
  }

  staticsTypeChange = (type) => {
    this.setState({ type });
  }

  handlePeriodChange = ({ type, startTime, endTime }) => {
    this.setState({
      period: type,
      startTime,
      endTime
    }, this.getAlarmDistribute);
  }

  render() {
    const { period, startTime, endTime } = this.state;
    const {
      dashboard: {
        alarmDistribute, alarmDistributeLoading,
        algoConfsLoading, algoConfs,
        alarmTrendLoading, alarmTrend,
        algoItemsLoading, algoItems,
      }
    } = this.props;
    algoItems.unshift({
      name: '总告警量',
      id: TYPE_ALL_ALGO_STATC
    });
    return (
      <div className={styles.VideoDashboard}>
        <div className={styles.panelTop}>
          <div className={styles.panelTopLeft}>
            <div className={styles.PreviewDatas}>
              <div className={styles.PreviewData}>
                <div className={styles['PreviewData-title']}>已接入设备</div>
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
                <div
                  className={styles['PreviewData-text']}
                  style={{ padding: '10px 0' }}
                >
                  本周告警数  134，340
                </div>
                <div className={styles['PreviewData-text']}>累计告警数  1345，340</div>
              </div>
            </div>
            <div className={styles.AlarmStatistics}>
              <div className={styles.panelTitle}>
                告警统计
                <div className={styles['panelTitle-filter']}>
                  <Select style={{ width: 200 }} onChange={this.staticsTypeChange}>
                    {
                      algoItems.map(item => (
                        <Option value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
              <div className={styles.SubContents}>
                <div className={styles['SubContents-AlarmTrend']}>
                  <div className={styles.panelSubTitle}>告警趋势</div>
                  <Bar
                    id="alarmTrend"
                    width="100%"
                    height="calc(100% - 22px)"
                    data={{
                      yAxisData: alarmTrend?.seriesData,
                      xAxisData: alarmTrend?.xaxisData,
                      // yAxisName: '告警数/个'
                    }}
                    loading={alarmTrendLoading}
                  />
                </div>
                <div className={styles['SubContents-AlarmDist']}>
                  <div className={styles.panelSubTitle}>近两周摄像头告警分布</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.RealtimeAlarms}>
            <div className={styles.panelTitle}>实时告警</div>
            <AlarmList />
          </div>
        </div>
        <div className={styles.panelBottom}>
          <div className={styles['panelBottom-algoStatus']}>
            <div className={styles.panelTitle}>算法配置状态</div>
            <Bar
              id="algoConfigs"
              width="100%"
              height="calc(100% - 40px)"
              data={{
                yAxisData: algoConfs?.seriesData,
                xAxisData: algoConfs?.xaxisData,
                yAxisName: '算法已配置设备数/个'
              }}
              loading={algoConfsLoading}
            />
          </div>
          <div className={styles['panelBottom-algoTimes']}>
            <div className={styles.panelTitle}>
              算法告警分布
              <div className={styles['panelTitle-filter']}>
                <PeriodFilter
                  value={{ type: period, startTime, endTime }}
                  onChange={this.handlePeriodChange}
                />
              </div>
            </div>
            <Pie
              id="alarmDistribute"
              width="100%"
              height="calc(100% - 52px)"
              data={{ data: alarmDistribute?.distributorPieMap, title: '算法告警分布' }}
              loading={alarmDistributeLoading}
            />
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
