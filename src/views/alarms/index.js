import React, { Component } from 'react';
import {
  Select,
  Result,
  DatePicker,
  Cascader,
  Button,
  Pagination,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getSummary, getMonitorMetric,
} from 'Redux/reducer/dashboard';
import AlarmCard from './alarmCard';

import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const mapStateToProps = state => ({ alarms: state.alarms });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class Alarms extends Component {
  constructor() {
    super();
    this.state = {
      listData: [
        {
          id: 1,
          name: '安全帽识别',
          rule: '',
          detail: 'blabla',
          time: '2021/02/30 01:30:30'
        },
        {
          id: 2,
          name: '移动侦测2',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 3,
          name: '移动侦测3',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 4,
          name: '移动侦测4',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 5,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 6,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 7,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 8,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 9,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 10,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 11,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 12,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
        {
          id: 13,
          name: '移动侦测5',
          rule: '',
          detail: 'blabla',

        },
      ]
    };
  }

  componentDidMount() {

  }

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
      const { listData } = this.state;
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
                <Option value="1">移动侦测</Option>
                <Option value="2">人脸布控</Option>
              </Select>
              <span className={styles.span10px} />
              <Cascader
                changeOnSelect
                placeholder="请选择设备"
                popupClassName={styles.cameraCascader}
                options={[]}
                allowClear={false}
              />
              <span className={styles['alarms-filterWrapper-btnWrapper']}>
                <Button type="primary" onClick={this.onSearch}>搜索</Button>
                <span className={styles.span10px} />
                <Button onClick={this.onReset}>重置</Button>
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
