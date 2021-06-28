/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  Tabs,
  Input,
  Select
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  searchPlateAlarms
} from 'Redux/reducer/intelligentSearch';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    searchPlateAlarms,
  },
  dispatch
);
class CarRes extends Component {
  constructor() {
    super();
    this.state = {
    };
  }


  componentDidMount() {
  }

  render() {
    const {
      data: {
        detail, picture
      }
    } = this.props;
    const curPlate = detail && detail[0];
    const {
      platelicense, plate_type, confidence
    } = curPlate || {};
    let color = 'blue';
    switch (plate_type) {
      case '蓝牌':
        color = 'blue';
        break;
      case '黄牌':
        color = 'yellow';
        break;
      case '绿牌':
        color = 'green';
        break;
      case '黑牌':
        color = 'black';
        break;
      case '白牌':
        color = 'white';
        break;
      default:
        break;
    }
    return (
      <div className={styles.carRes}>
        <div className={styles.plateWrapper}>
          <div className={styles.imageWrapper}>
            <img src={picture} alt="图片" />
          </div>
          <div className={styles.textWrapper}>
            <div className={`${styles.plateShow} ${styles[`plateShow-${color}`]}`}>
              {platelicense}
            </div>
            <div>
              车牌号：
              {platelicense}
            </div>
            <div>
              车牌颜色：
              {plate_type}
            </div>
            <div>
              置信度：
              {parseFloat(confidence * 100).toFixed(2)}
            </div>
          </div>
        </div>
        <div className={styles.alarmsWrapper}>
          相关告警信息
        </div>
      </div>
    );
  }
}

CarRes.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CarRes);
