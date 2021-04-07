
import React from 'react';
import {

} from 'antd';
import nodataIcon from 'Assets/nodata.png';
import styles from './charts.less';

const chartPlaceHolder = (props) => {
  const { width, height, show } = props;
  return (
    <div
      className={styles.noChartWrapper}
      style={{
        display: show ? 'table' : 'none',
        width,
        height,
      }}
    >
      <div className={styles.imgWrapper}>
        <img src={nodataIcon} alt="暂无数据" />
      </div>

    </div>
  );
};

export default chartPlaceHolder;
