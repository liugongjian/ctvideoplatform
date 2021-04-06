import React, { Component } from 'react';
import {
  Select,
  Spin,
} from 'antd';
import nodataImg from 'Assets/nodata.png';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getAlarmDistribute, getAlgoConfs, getAlarmTrend, getAlgoItems, getDeviceStatus, getAlarmPreview
} from 'Redux/reducer/dashboard';
import math from 'Utils/math';
import Pie from 'Components/echarts/Pie';
import Bar from 'Components/echarts/SimpleBar';
import moment from 'moment';
import EIcon from 'Components/Icon';
import PeriodFilter from './components/periodFilter';
import AlarmList from './components/alarmList';

import styles from './index.less';

const { Option } = Select;
let interval;
const dateFormat = 'YYYY-MM-DD';
const TYPE_ALL_ALGO_STATC = '0';
const mapStateToProps = state => ({ dashboard: state.dashboard });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAlarmDistribute, getAlgoConfs, getAlarmTrend, getAlgoItems, getDeviceStatus, getAlarmPreview
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

  componentWillUnmount() {
    this.clearPolling();
  }

  initData = () => {
    this.polling(() => {
      this.props.getDeviceStatus();
      this.props.getAlarmPreview();
    });
    this.props.getAlgoItems();
    this.getAlarmTrend();
    this.getAlarmDistribute();
    this.props.getAlgoConfs();
  }

  polling = (func) => {
    func();
    interval = setInterval(func, 5000);
  }

  clearPolling = () => {
    clearInterval(interval);
  }

  getAlarmTrend = () => {
    const { type } = this.state;
    this.props.getAlarmTrend(type);
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
    this.setState({ type }, this.getAlarmTrend);
  }

  handlePeriodChange = ({ type, startTime, endTime }) => {
    this.setState({
      period: type,
      startTime,
      endTime
    }, this.getAlarmDistribute);
  }

  getNumberText = (obj, prop) => {
    if (obj && typeof obj[prop] === 'number') return obj[prop];
    return '-';
  }

  render() {
    const {
      period, startTime, endTime, type
    } = this.state;
    const {
      dashboard: {
        alarmDistribute, alarmDistributeLoading,
        algoConfsLoading, algoConfs,
        alarmTrendLoading, alarmTrend,
        algoItemsLoading, algoItems,
        deviceStatusLoading, deviceStatus,
        alarmStatusLoading, alarmStatus,
      }
    } = this.props;
    const algoSelOptions = [{
      name: '总告警量',
      id: TYPE_ALL_ALGO_STATC
    }, ...algoItems];
    return (
      <div className={styles.VideoDashboard}>
        <div className={styles.panelTop}>
          <div className={styles.panelTopLeft}>
            <div className={styles.PreviewDatas}>
              <div className={styles.PreviewData}>
                <div className={styles['PreviewData-title']}>已接入设备</div>
                <div className={styles['PreviewData-number']}>{this.getNumberText(deviceStatus, 'connectedDevicesNums')}</div>
                <div className={styles['PreviewData-split']} />
                <div className={styles['PreviewData-title']}>算法配置占比</div>
                <div className={styles['PreviewData-number']}>
                  {algoConfs?.algorithmicRatio ? parseFloat(algoConfs.algorithmicRatio * 100).toFixed(2) : '-'}
                  %
                </div>
                <div className={styles['PreviewData-text']}>
                  已配置算法设备数
                  {' '}
                  {algoConfs?.algorithmicDevices}
                </div>
              </div>
              <div className={styles.PreviewData}>
                <div className={styles.DeviceStatus}>
                  <div className={`${styles.DeviceStatusIcon} ${styles['DeviceStatusIcon-online']}`}><EIcon type="myicon-dashboardCamera" /></div>
                  <div className={styles.DeviceStatusContent}>
                    <div className={styles['PreviewData-title']}>在线设备数</div>
                    <div className={styles['PreviewData-number']}>{this.getNumberText(deviceStatus, 'onLineDevicesNums')}</div>
                    <div className={styles['PreviewData-text']}>
                      在线设备率
                      {' '}
                      {deviceStatus ? parseFloat(deviceStatus.onLineDevicesRatio * 100).toFixed(2) : '-'}
                      %
                    </div>
                  </div>
                </div>
                <div className={styles['PreviewData-split']} />
                <div className={styles.DeviceStatus}>
                  <div className={`${styles.DeviceStatusIcon}`}><EIcon type="myicon-dashboardCamera" /></div>
                  <div className={styles.DeviceStatusContent}>
                    <div className={styles['PreviewData-title']}>离线设备数</div>
                    <div className={styles['PreviewData-number']}>
                      {this.getNumberText(deviceStatus, 'offLineDevicesNums')}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.PreviewData}>
                <div className={styles['PreviewData-title']}>今日告警数</div>
                <div className={styles['PreviewData-number']}>{this.getNumberText(alarmStatus, 'alarmNumsToday')}</div>
                <div
                  className={styles['PreviewData-text']}
                  style={{ padding: '10px 0' }}
                >
                  本周告警数
                  {' '}
                  {this.getNumberText(alarmStatus, 'alarmNumsThisWeek')}
                </div>
                <div className={styles['PreviewData-text']}>
                  累计告警数
                  {' '}
                  {this.getNumberText(alarmStatus, 'alarmNumsTotal')}
                </div>
              </div>
            </div>
            <div className={styles.AlarmStatistics}>
              <div className={styles.panelTitle}>
                告警统计
                <div className={styles['panelTitle-filter']}>
                  <Select style={{ width: 200 }} onChange={this.staticsTypeChange} value={type}>
                    {
                      algoSelOptions.map(item => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
              <div className={styles.SubContents}>
                <div className={styles['SubContents-AlarmTrend']}>
                  <div className={styles.panelSubTitle}>告警趋势</div>
                  <Bar
                    key="alarmTrend"
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
                  {
                      alarmTrend?.alarmDistributionList?.length > 0 ? (
                        <ul className={styles.alarmRanking}>
                          {alarmTrend.alarmDistributionList.map(({ name, totalCount }, idx) => (
                            <li key={`ditributeRanking-${idx}`}>
                              <span className={styles['alarmRanking-name']} title={name}>{name}</span>
                              <span className={styles['alarmRanking-total']}>{totalCount}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className={styles.noDataImgWrapper}>
                          <img src={nodataImg} alt="暂无数据" />
                        </div>
                      )
                  }
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
            <div className={styles.panelTitle}>算法已配置设备数量</div>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <Bar
                key="algoConfigs"
                id="algoConfigs"
                data={{
                  yAxisData: algoConfs?.seriesData,
                  xAxisData: algoConfs?.xaxisData,
                // yAxisName: '算法已配置设备数/个'
                }}
                loading={algoConfsLoading}
              />
            </div>
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
            <div style={{ width: '100%', height: 'calc(100% - 52px)' }}>
              <Pie
                id="alarmDistribute"
                key="alarmDistribute"
                data={{ data: alarmDistribute?.distributorPieMap, total: alarmDistribute?.alarmTotal, title: '算法告警分布' }}
                loading={alarmDistributeLoading}
              />
            </div>
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
