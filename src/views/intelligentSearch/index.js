import React, { Component } from 'react';
import {
  Tabs,
  Input,
  Select,
  Steps,
  Button,
  message
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
const { Step } = Steps;

const steps = [
  {
    title: '搜索条件',
    content: <Step1 />,
  },
  {
    title: '搜索结果',
    content: <Step3 />,
  },
];

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
      // keyword: '',
      // searchType: 1,
      current: 0,
    };
  }

  componentDidMount() {
    // ajax code
  }

  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
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
    const { current } = this.state;
    return (
      <div className={styles.intelligentSearchWrapper}>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className={styles['steps-content']}>{steps[current].content}</div>
        <div className={styles['steps-action']}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          )}
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              上一步
            </Button>
          )}
        </div>
      </div>
    );
  }
}

IntelligentSearch.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(IntelligentSearch);
