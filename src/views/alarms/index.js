/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import {
  Select,
  Result,
  DatePicker,
  Cascader,
  Button,
  Pagination,
  Modal,
  Icon,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import EIcon from 'Components/Icon';
import {
  getAlgoList, getDeviceTree
} from 'Redux/reducer/alarms';
import AlarmCard from './alarmCard';

import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const mapStateToProps = state => ({ alarms: state.alarms });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAlgoList, getDeviceTree
  },
  dispatch
);

class Alarms extends Component {
  constructor() {
    super();
    this.state = {
      algoList: [],
      algoListLoading: false,
      deviceList: [],
      deviceTree: [],
      devicesLoading: false,
      listData: [
        {
          id: 1,
          AlgorithmName: '安全帽识别',
          controlRule: 'testtesttest',
          details: 'blablablablablablablablablablablablablablablablablablablabla',
          resTime: '2021/02/30 01:30:30',
          algorithmId: '111',
          imageCompress: '...',
          deviceArea: '区域1/区域2/区域3/区域4/摄像头某某某某某某某某'
        },
        {
          id: 2,
          AlgorithmName: '移动侦测',
          controlRule: '',
          details: 'blabla',
          deviceArea: '区域NNN/区域1/区域2/区域3/区域4/摄像头某某某某某某某某'
        },
        {
          id: 3,
          AlgorithmName: '电子围栏',
          controlRule: '',
          details: 'blabla',

        },
        {
          id: 4,
          AlgorithmName: '人员布控',
          controlRule: '',
          details: 'blabla',

        },
        {
          id: 5,
          AlgorithmName: '电子围栏',
          controlRule: '',
          details: 'blabla',
        },
        {
          id: 6,
          AlgorithmName: '电子围栏',
          controlRule: '',
          details: 'blabla',
        },
        {
          id: 7,
          AlgorithmName: '车辆布控',
          controlRule: '',
          details: 'blabla',
        },
        {
          id: 8,
          AlgorithmName: '移动侦测5',
          controlRule: '',
          details: 'blabla',

        },
        {
          id: 9,
          AlgorithmName: '车辆布控',
          controlRule: '',
          details: 'blabla',

        },
        {
          id: 10,
          AlgorithmName: '车辆布控',
          controlRule: '',
          details: 'blabla',

        },
        {
          id: 11,
          AlgorithmName: '人员布控',
          controlRule: '',
          details: 'blabla',

        },
        {
          id: 12,
          AlgorithmName: '电子围栏',
          controlRule: '',
          details: 'blabla',

        },
        {
          id: 13,
          AlgorithmName: '口罩检测',
          controlRule: '',
          details: 'blabla',

        },
      ]
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
    const setAreaNodeDisabled = (tree) => {
      tree.forEach((item) => {
        if (item.children) {
          setAreaNodeDisabled(item.children);
        } else {
          item.disabled = item.type == 0;
        }
      });
    };
    setAreaNodeDisabled(val);
    return val;
  };

  onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }

    onOk = (value) => {
      console.log('onOk: ', value);
    }

    onSearch = () => {

    }

    onReset = () => {

    }

    showTotal = total => (<span className={styles.totalText}>{`总条数： ${total}`}</span>)

    render() {
      const {
        listData, algoList, algoListLoading, deviceTree
      } = this.state;
      return (
        <div className={styles.alarms}>
          <div className={styles['alarms-filterWrapper']}>
            <div className={styles['alarms-filterWrapper-inner']}>
              <RangePicker
                style={{ width: '310px' }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                onChange={this.onChange}
                onOk={this.onOk}
                allowClear={false}
              />
              <span className={styles.span10px} />
              <Select
                style={{ width: '150px' }}
                placeholder="请选择告警类型"
              >
                {
                  algoList.map(item => (<Option value={item.id}>{item.cnName}</Option>))
                }
              </Select>
              <span className={styles.span10px} />
              <Cascader
                placeholder="请选择设备"
                popupClassName={styles.cameraCascader}
                options={deviceTree}
                allowClear={false}
                // onChange={this.onAreaChange}
              />
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
          <div className={styles['alarms-listWrapper']}>
            {
              listData.map(item => (
                <AlarmCard
                  key={item.id}
                  data={item}
                />
              ))
            }
          </div>
          <div className={styles['alarms-paginationWrapper']}>
            <Pagination
              // size="small"
              total={50}
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
