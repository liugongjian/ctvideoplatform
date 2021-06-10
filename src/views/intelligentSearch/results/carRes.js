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

import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {

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
    return (
      <div className={styles.carRes}>
        <div className={styles.imageWrapper}>
          <img src={picture} alt="图片" />
        </div>
        <div className={styles.textWrapper}>
          <div>
            车牌号：
            {platelicense}
          </div>
          <div>
            车牌颜色：
            {plate_type}
          </div>
          <div>
            相似度：
            {parseFloat(confidence * 100).toFixed(2)}
          </div>
        </div>
      </div>
    );
  }
}

CarRes.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CarRes);
