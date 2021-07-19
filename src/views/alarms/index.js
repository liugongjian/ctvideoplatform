/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import {
  Select,
  Result,
  DatePicker,
  Cascader,
  Button,
  // Pagination,
  Modal,
  Icon,
  Spin,
  message,
} from 'antd';
import { bindActionCreators } from 'redux';
import math from 'Utils/math';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import EIcon from 'Components/Icon';
import {
  getAlgoList, getDeviceTree, getAlarmList, delAlarmInfo
} from 'Redux/reducer/alarms';
import moment from 'moment';
import NODATA_IMG from 'Assets/nodata.png';
import Pagination from 'Components/EPagination';
import AlarmCard from './alarmCard';
import styles from './index.less';
import { AlgoConfigs } from './constants';

const { RangePicker } = DatePicker;
const { Option } = Select;

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
  algoVal: undefined, // 算法改成单选
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
      // algorithmIdList: undefined,
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
    this.props.getDeviceTree().then((res) => {
      console.log('getDeviceTree', res);
      const tree = this.dataToTree(res);
      console.log('DeviceTree', tree);
      this.setState({
        devicesLoading: false,
        deviceList: res,
        deviceTree: tree
      });
    }).catch((err) => {
      this.setState({
        devicesLoading: false,
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
      // algorithmIdList,
      startTime, endTime, algoVal, deviceVal, deviceList,
      algoList,

    } = this.state;

    const params = {
      pageNo: current - 1,
      pageSize,
      algorithmId: algoVal, // 算法改成单选
      startTime: startTime.startOf('minute').format(timeFormat),
      endTime: endTime.startOf('minute').format(timeFormat),

    };
    const chosenAlgoEnName = algoList?.find(item => item.id === algoVal)?.name;
    const moreFilter = AlgoConfigs[chosenAlgoEnName]?.moreFilter;
    if (moreFilter) {
      moreFilter.forEach(({ key }) => {
        if (this.state[key]) {
          params[key] = this.state[key];
        }
      });
    }
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

  dataToTree = (data) => {
    // 下面的forEach写法会改变原数组，所以深度拷贝一次
    const copy = JSON.parse(JSON.stringify(data));
    const map = {};
    copy.forEach((item) => {
      item.label = item.name;
      // if (item.type == 0) {
      //   item.label = item.name;
      // } else {
      //   item.label = (
      //     <span>
      //       <EIcon type="myicon-monitorIcon" />
      //       {item.name}
      //     </span>
      //   );
      // }
      item.value = item.id;
      map[item.id] = item;
    });
    const val = [];
    copy.forEach((item) => {
      const parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        val.push(item);
      }
    });
    // 子节点为区域，不是设备，不可选
    // const setAreaNodeDisabled = (tree) => {
    //   tree.forEach((item) => {
    //     if (item.children) {
    //       setAreaNodeDisabled(item.children);
    //     } else {
    //       item.disabled = item.type == 0;
    //     }
    //   });
    // };
    // setAreaNodeDisabled(val);
    return val;
  };

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

    onSearch = () => {
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

    onMoreFilterChange = (key, val) => {
      this.setState({ [key]: val });
    }

    renderMoreFilter = moreFilter => (
      <React.Fragment>
        {
          moreFilter.map(({
            key, name, selection, mutiple
          }) => {
            const options = {
              key,
              placeholder: name,
              onChange: val => this.onMoreFilterChange(key, val),
              style: { width: '170px' },
              allowClear: true,
              value: this.state[key]
            };
            if (mutiple) {
              options.mode = 'multiple';
              options.maxTagCount = 1;
              options.maxTagTextLength = 2;
            }
            return (
              <Select {...options}>
                {
                  selection.map(item => (
                    <Option value={item.value}>{item.label}</Option>
                  ))
                }
              </Select>
            );
          })
        }
      </React.Fragment>
    )

    render() {
      const {
        listData, listLoading,
        algoList, algoListLoading,
        deviceTree, devicesLoading,
        total, current, pageSize,
        startTime, endTime, algoVal, deviceVal
      } = this.state;

      const chosenAlgoEnName = algoList?.find(item => item.id === algoVal)?.name;

      return (
        <div className={styles.alarms}>
          <div className={styles['alarms-filterWrapper']}>
            <div className={styles['alarms-filterWrapper-inner']}>
              <RangePicker
                style={{ width: '310px' }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                onChange={this.onTimeChange}
                value={[startTime, endTime]}
                onOk={this.onTimeChange}
                allowClear={false}
              />
              <span className={styles.span10px} />
              <Select
                style={{ width: '150px' }}
                // mode="multiple" // 算法改成单选
                placeholder="请选择告警类型"
                value={algoVal}
                onChange={this.onAlgoChange}
                // maxTagCount={1} // 算法改成单选
                // maxTagTextLength={2} // 算法改成单选
              >
                {
                  algoList?.map(item => (<Option value={item.id}>{item.cnName}</Option>))
                }
              </Select>
              <span className={styles.span10px} />
              <Cascader
                changeOnSelect
                placeholder="请选择设备"
                popupClassName={styles.cameraCascader}
                options={deviceTree}
                allowClear={false}
                value={deviceVal}
                onChange={this.onDeviceChange}
              />
              <span className={styles.span10px} />
              {
                AlgoConfigs[chosenAlgoEnName]?.moreFilter
                  ? this.renderMoreFilter(AlgoConfigs[chosenAlgoEnName]?.moreFilter)
                  : null
              }
              <span className={styles['alarms-filterWrapper-btnWrapper']}>
                <Button type="primary" onClick={this.onSearch}>搜索</Button>
                <span className={styles.span10px} />
                <Button onClick={this.onReset}>
                  <Icon type="redo" />
                  重置
                </Button>
              </span>
            </div>
          </div>
          <Spin spinning={listLoading} className={styles['alarms-listSpin']}>
            <div className={styles['alarms-listWrapper']}>
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
                    <div className={styles['alarms-listWrapper-nodata']}>
                      <img src={NODATA_IMG} alt="" />
                    </div>
                  )
              }
            </div>
          </Spin>
          <div className={styles['alarms-paginationWrapper']}>
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
