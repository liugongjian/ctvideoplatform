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
import Step3 from './step3';
import Step1 from './step1';

import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  { },
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
class IntelligentSearch extends Component {
  constructor() {
    super();
    this.state = {
      keyword: '',
      searchType: 1,
    };
  }

  componentDidMount() {
    // ajax code
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
      <div className={styles.intelligentSearchWrapper}>
        <Step1 />
      </div>
    );
  }
}

IntelligentSearch.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(IntelligentSearch);
