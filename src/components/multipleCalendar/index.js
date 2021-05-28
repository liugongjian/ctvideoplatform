/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  message, Modal, Spin, Tree, Table, Input, Button, DatePicker
} from 'antd';
import moment from 'moment';
import styles from './index.less';

const dateFormat = 'YYYY/MM/DD';

// eslint-disable-next-line camelcase
// const customer_holiday = '111001111100111110011111001111100111110011111001111100111110011111001111100111110011111001111100111110011111001111100111110011111001111100111110011111001111100111110011111001111100111110011111001101010111110011111001111100111110011111001111100111110011111001111100111110011111001111100111110011111001111100111010011111001111100111110011111001111110111110011111001111';
class CheckCalendar extends Component {
  state={
    ifshow: true,
    choosedData: [],
    tempDate: []
  }

  componentDidMount() {
    this.strToState();
  }

  strToState=() => {
    const { value } = this.props;
    const yearLen = value.length;
    const monthLen = [
      {
        len: 31,
        mon: '01',
        name: 'january'
      },
      {
        len: yearLen === 366 ? 29 : 28,
        mon: '02',
        name: 'february'
      },
      {
        len: 31,
        mon: '03',
        name: 'march'
      },
      {
        len: 30,
        mon: '04',
        name: 'april'
      },
      {
        len: 31,
        mon: '05',
        name: 'may'
      },
      {
        len: 30,
        mon: '06',
        name: 'june'
      },
      {
        len: 31,
        mon: '07',
        name: 'july'
      },
      {
        len: 31,
        mon: '08',
        name: 'august'
      },
      {
        len: 30,
        mon: '09',
        name: 'september'
      },
      {
        len: 31,
        mon: '10',
        name: 'october'
      },
      {
        len: 30,
        mon: '11',
        name: 'november'
      },
      {
        len: 31,
        mon: '12',
        name: 'december'
      }
    ];

    const temp = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

    const everyMonthLen = monthLen.map(item => item.len);

    const everyMonthName = Object.values(monthLen).map(item => parseInt(item.mon, 10));

    const toYear = new Date().getFullYear();

    const monthData = monthLen.map((item, idx) => {
      const substrDays = everyMonthLen.slice(0, idx);
      const sum = substrDays.reduce((prev, cur) => prev + cur, 0);
      item.chooseDays = value.substr(sum, item.len);
      item.chooseDate = temp.slice(0, item.len).map((val, idx) => {
        if (val < 10) {
          return { [`${toYear}/${item.mon}/0${val}`]: item.chooseDays[idx] };
        }
        return { [`${toYear}/${item.mon}/${val}`]: item.chooseDays[idx] };
      });
      return item;
    });
    const arr = monthData.flatMap(item => item.chooseDate);
    const result = {};
    arr.forEach(item => Object.assign(result, item));
    this.setState({
      choosedData: result,
      tempDate: monthData
    });
  }

  changeDate = (date, dateString) => {
    const { choosedData } = this.state;
    if (choosedData[dateString] === '1') {
      choosedData[dateString] = '0';
    } else if (choosedData[dateString] === '0') {
      choosedData[dateString] = '1';
    }

    this.setState({
      ...choosedData
    }, () => console.log(this.state.choosedData));
  }

  getCls = (cur) => {
    const curDate = moment(cur).format(dateFormat);
    const { choosedData } = this.state;
    const len = choosedData.length;
    if (choosedData[curDate] === '1') {
      return `${styles.dateSpan} ${styles.active}`;
    } if (choosedData[curDate] === '0') {
      return `${styles.dateSpan}`;
    }
    return `${styles.dateSpan} ${styles.disabledChoose}`;
  }

  callback = () => {
    const { onChange } = this.props;
    const { choosedData } = this.state;
    const str = Object.values(choosedData).join('');
    onChange(str, choosedData);
  }

  disabledDate = (cur) => {
    const { readOnly } = this.props;
    if (readOnly) {
      return true;
    }
    const yearFirstDay = moment().startOf('year');
    const yearyLastDay = moment().endOf('year');
    return cur < yearFirstDay || cur > yearyLastDay;
  }

  getCalendarContainer= triggerNode => triggerNode.parentNode.parentNode

  render() {
    const {
      onChange, ifShow, value,
    } = this.props;
    return (
      <DatePicker
        showToday={false}
        format={dateFormat}
        open={ifShow}
        onChange={this.changeDate}
        style={{ opacity: 0 }}
        dropdownClassName={styles.tempCalendar}
        disabledDate={this.disabledDate}
        getCalendarContainer={this.getCalendarContainer}
        dateRender={(cur, today) => {
          const curDate = moment(cur).format(dateFormat).split('/')[2];
          return (
            <span
              key={`${moment(cur).format(dateFormat)}_`}
              className={this.getCls(cur)}
            >
              {curDate}
            </span>
          );
        }}
        renderExtraFooter={() => <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={this.callback}>确定</div>}
      />
    );
  }
}

export default CheckCalendar;
