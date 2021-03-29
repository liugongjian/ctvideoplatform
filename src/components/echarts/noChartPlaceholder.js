
import React from 'react';
import {

} from 'antd';
import nodataIcon from 'Assets/nodata.png';
import './charts.less';

const chartPlaceHolder = (props) => {
  const { width, height, show } = props;
  return (
    <div
      className="nochart-placeholder"
      style={{
        display: show ? 'block' : 'none', width, height, lineHeight: height
      }}
    >
      <div className="nochart-icon">
        <img src={nodataIcon} alt="暂无数据" />
      </div>
    </div>
  );
};

export default chartPlaceHolder;
