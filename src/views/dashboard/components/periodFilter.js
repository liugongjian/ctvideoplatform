import React, { PureComponent } from 'react';
import {
  DatePicker
} from 'antd';
import moment from 'moment';

import styles from './index.less';

const { RangePicker } = DatePicker;

const PeriodFilter = (props) => {
  const {
    value: {
      type, startTime, endTime
    } = {}, onChange
  } = props;
  const onTimeChange = (arr) => {
    onChange({ type: 0, startTime: arr[0], endTime: arr[1] });
  };
  const handleTypeChange = (type) => {
    const period = {};
    switch (type) {
      case 1:
        period.startTime = moment();
        period.endTime = moment();
        break;
      case 2:
        period.startTime = moment().subtract('days', 7);
        period.endTime = moment();
        break;
      case 3:
        period.startTime = moment().subtract('days', 30);
        period.endTime = moment();
        break;
      case 4:
        period.startTime = moment().subtract('days', 365);
        period.endTime = moment();
        break;
      default:
        break;
    }
    onChange({ type, ...period });
  };
  const PeriodTags = ['今日', '本周', '本月', '本年'];
  return (
    <span className={styles.PeriodFilter}>
      {
        PeriodTags.map((text, idx) => (
          <span
            id={`PeriodTag-${idx}`}
            className={`${styles.PeriodTag} ${idx + 1 === type ? styles['PeriodTag-chosen'] : ''}`}
            onClick={() => handleTypeChange(idx + 1)}
          >
            {text}
          </span>
        ))
      }
      <RangePicker
        style={{ width: '240px' }}
        format="YYYY-MM-DD"
        onChange={onTimeChange}
        disabledDate={current => current && current > moment().endOf('day')}
        value={[startTime, endTime]}
        onOk={onTimeChange}
        allowClear={false}
      />
    </span>
  );
};
export default PeriodFilter;
