import React, { Component } from 'react';
import {
  Tabs,
  Input
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
// import { getSummary, getMonitorMetric } from 'Redux/reducer/monitor';
import AlarmList from './alarmList/alarmList';
import MapTrack from './mapTrack/mapTrack';

import styles from './index.less';

const { Search } = Input;
const { TabPane } = Tabs;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class CameraDetail extends Component {
  constructor() {
    super();
    this.state = {
      curTab: 'alarm',
      keyword: '',
    };
  }

  componentDidMount() {
    // ajax code
  }

  onSearch = (value) => {
    console.log('value', value);
    this.getAlarms();
  }

  render() {
    const { curTab, keyword } = this.state;
    // const cameraId = '82808096775c78ad01775c79f3420000';
    const {
      match: { params: { cameraId } }
    } = this.props;
    return (
      <div className={styles.intelligentSearch}>
        <div className={styles['intelligentSearch-filterWrapper']}>
          <span className={styles['intelligentSearch-filterWrapper-btnWrapper']}>
            <Search
              onChange={this.onSearch}
              placeholder="请输入姓名或车牌号"
              value={keyword}
            />
          </span>
        </div>
        <div className={styles['intelligentSearch-contentWrapper']}>
          <MapTrack />
        </div>
      </div>
    );
  }
}

CameraDetail.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraDetail);
