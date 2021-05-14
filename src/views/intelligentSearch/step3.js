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
// import { getSummary, getMonitorMetric } from 'Redux/reducer/monitor';
import { getMarkers } from 'Redux/reducer/intelligentSearch';
import AlarmList from './alarmList/alarmList';
import MapTrack from './mapTrack/mapTrack';

import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getMarkers
  },
  dispatch
);

const searchTypes = [
  {
    value: 1,
    label: '姓名'
  },
  {
    value: 2,
    label: '车牌号'
  }
];
class SearchStep3 extends Component {
  constructor() {
    super();
    this.state = {
      keyword: '',
      searchType: 1,
    };
  }

  componentDidMount() {
    // ajax code
    // this.props.getMarkers();
  }

  onSearch = (e) => {
    console.log('value', e.target.value);
    this.setState({
      keyword: e.target.value,
    });
  }

  onSelectChange = (val) => {
    this.setState({
      searchType: val,
    });
  }

  render() {
    const { keyword, searchType } = this.state;
    return (
      <div className={styles.intelligentSearch}>
        <div className={styles['intelligentSearch-filterWrapper']}>
          <span className={styles['intelligentSearch-filterWrapper-btnWrapper']}>
            <Select onChange={this.onSelectChange} value={searchType} style={{ width: '100px' }}>
              {
                searchTypes.map(
                  item => <Option key={item.value} value={item.value}>{item.label}</Option>
                )
              }
            </Select>
            <span style={{ display: 'inline-block', width: '10px' }} />
            <Search
              style={{ width: '300px' }}
              onChange={this.onSearch}
              placeholder={`请输入${searchTypes.find(item => item.value === searchType)?.label}`}
              value={keyword}
            />
          </span>
        </div>
        <div className={styles['intelligentSearch-contentWrapper']}>
          <div className={styles['intelligentSearch-contentWrapper-leftPart']}>
            <div className={styles.subTitle}>轨迹追踪</div>
            <MapTrack />
          </div>
          <div className={styles['intelligentSearch-contentWrapper-rightPart']}>
            <div className={styles.subTitle}>告警信息</div>
            <AlarmList />
          </div>
        </div>
      </div>
    );
  }
}

SearchStep3.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchStep3);
