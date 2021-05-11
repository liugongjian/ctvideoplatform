/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import {
  Select,
  DatePicker,
  Spin,
  message,
  Input,
} from 'antd';
// import Map from 'Components/echarts/map';
import { bindActionCreators } from 'redux';
import math from 'Utils/math';
import { connect } from 'react-redux';
import {
  getAlgoList, getDeviceTree, getAlarmList, delAlarmInfo
} from 'Redux/reducer/alarms';
import moment from 'moment';
import NODATA_IMG from 'Assets/nodata.png';
import Pagination from 'Components/EPagination';
import AlarmCard from './alarmCard';
import styles from '../index.less';

const mapStateToProps = state => ({ alarms: state.alarms });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAlgoList, getDeviceTree, getAlarmList, delAlarmInfo
  },
  dispatch
);

const initialVals = () => ({
  startTime: moment().subtract('days', 7),
  endTime: moment(),
  deviceVal: [],
  algoVal: [],
  pageSize: 12,
  current: 1,
});

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
class Alarms extends Component {
  constructor() {
    super();
    this.state = {
      algoList: [],
      algoListLoading: false,
      deviceList: [],
      deviceTree: [],
      devicesLoading: false,
      listData: [],
      listLoading: false,
      total: 0,
      algorithmIdList: undefined,
      keyword: '',
      ...initialVals(),
    };
  }

  componentDidMount() {
    this.setState({
      algoListLoading: true,
      devicesLoading: true,
    });
    this.props.getAlgoList().then((res) => {
      this.setState({
        algoListLoading: false,
        algoList: res,
      });
    }).catch((err) => {
      this.setState({
        algoListLoading: false,
      });
    });
    this.getAlarms();
  }

  getAlarms = () => {
    this.setState({
      listLoading: true,
    });
    const {
      current,
      pageSize,
      algorithmIdList,
      startTime, endTime, algoVal, deviceVal, deviceList
    } = this.state;

    const params = {
      pageNo: current - 1,
      pageSize,
      algorithmIdList: algoVal,
      startTime: startTime.startOf('minute').format(timeFormat),
      endTime: endTime.startOf('minute').format(timeFormat),
    };
    const deviceOrAreaId = deviceVal ? deviceVal[deviceVal.length - 1] : undefined;
    const item = deviceOrAreaId ? deviceList.find(({ id }) => id == deviceOrAreaId) : {};
    if (item && item.type == 0) {
      params.areaId = deviceOrAreaId;
    } else if (item && item.type == 1) {
      params.deviceId = deviceOrAreaId;
    }
    this.props.getAlarmList(params).then((res) => {
      console.log('getAlarmList', res);
      const {
        list, recordsTotal, pageNo, pageSize, pageTotal,
      } = res;
      let current = pageNo + 1;
      const maxPage = recordsTotal === 0
        ? 1 : math.ceil(math.divide(recordsTotal, pageSize));
      if (!list?.length && current > maxPage) {
        current = maxPage;
        this.onPageChange(current, pageSize);
      }
      this.setState({
        listData: list,
        total: recordsTotal,
        listLoading: false,
      });
    }).catch((err) => {
      console.log('getAlarmList-Error', err);
      this.setState({
        listLoading: false,
      });
    });
  }

  handleDel = (id) => {
    this.props.delAlarmInfo(id).then((res) => {
      message.success('删除成功');
      this.getAlarms();
    }).catch((err) => {
      console.log('err', err);
    });
  }

  onDeviceChange = (val) => {
    console.log('deviceChange: ', val);
    this.setState({ deviceVal: val });
  }

  onAlgoChange = (val) => {
    console.log('onAlgoChange: ', val);
    this.setState({ algoVal: val });
  }

    onTimeChange = (value) => {
      console.log('timeChange: ', value);
      this.setState({
        startTime: value[0],
        endTime: value[1]
      });
    }

    onSearch = (value) => {
      console.log('value', value);
      this.getAlarms();
    }

    onReset = () => {
      this.setState(initialVals(), this.getAlarms);
    }

    showTotal = total => (<span className={styles.totalText}>{`总条数： ${total}`}</span>)

    onPageChange = (current, pageSize) => {
      this.setState({
        current,
        pageSize,
      }, this.getAlarms);
    }

    render() {
      const {
        listData, listLoading,
        algoList, algoListLoading,
        deviceTree, devicesLoading,
        total, current, pageSize,
        startTime, endTime, algoVal, deviceVal, keyword
      } = this.state;
      return (
        <div>
          <Spin spinning={listLoading} className={styles['intelligentSearch-listSpin']}>
            <div className={styles['intelligentSearch-listWrapper']}>
              {
                listData.length > 0 || listLoading
                  ? listData.map(item => (
                    <AlarmCard
                      key={item.id}
                      data={item}
                      onDelete={this.handleDel}
                    />
                  ))
                  : (
                    <div className={styles['intelligentSearch-listWrapper-nodata']}>
                      <img src={NODATA_IMG} alt="" />
                    </div>
                  )
              }
            </div>
          </Spin>
          <div className={styles['intelligentSearch-paginationWrapper']}>
            <Pagination
              // size="small"
              total={total}
              current={current}
              // pageSize={pageSize}
              defaultPageSize={initialVals().pageSize}
              onChange={this.onPageChange}
              onShowSizeChange={this.onPageChange}
              pageSizeOptions={['12', '24', '36', '48']}
              pageSize={pageSize}
              hideOnSinglePage={false}
              showSizeChanger
              showQuickJumper
              showTotal={this.showTotal}
            />
          </div>
        </div>
      );
    }
}

// Alarms.propTypes = {
//   dashboard: PropTypes.object.isRequired,
// };

export default connect(mapStateToProps, mapDispatchToProps)(Alarms);
