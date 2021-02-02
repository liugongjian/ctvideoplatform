/* eslint-disable no-restricted-syntax */
/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import {
  Select,
  Tabs,
  Form,
  Input,
  Modal,
  Radio,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { getSummary, getMonitorMetric } from 'Redux/reducer/monitor';
import CanvasOperator from 'Components/canvasOperator';
import {
  TRIGGER_ORIGIN,
  ALGO_CONFIG_TRIGGER_RULE,
  ALGO_CONFIG_TRIGGER_TIME_TYPE,
  ALGO_CONFIG_TYPE,
} from '../constants';

import styles from '../index.less';

const { Option } = Select;

const { TabPane } = Tabs;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class CameraDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: [],
      timeConfig: '00:00-23:59',
      ruleConfig: 2,
      timeType: 0,
      // areasConfig: undefined,
    };
  }

  componentDidMount() {

  }

  handleOk = () => {
    console.log('areas', this.state.areas);
    this.props.closeModal();
  }

  handleCancel = () => {
    this.props.closeModal();
  }

  onAreasChange = (areas) => {
    this.setState({ areas });
  }

  onRuleChange = (ruleConfig) => {
    console.log('onRuleChange', ruleConfig);
    this.setState({
      ruleConfig
    });
  }

  onTimeTypeChange = (e) => {
    console.log('onTimeTypeChange', e);
    this.setState({ timeType: e.target.value });
  }


  render() {
    const {
      visible, configTypes, curAlgo
    } = this.props;
    const {
      areas,
      timeConfig,
      ruleConfig,
      timeType,
    } = this.state;
    const configEnable = {};
    for (const config of configTypes) {
      configEnable[config] = true;
    }
    const triggerOrigin = (() => {
      if (curAlgo?.title.indexOf('人')) {
        return TRIGGER_ORIGIN.PEOPLE;
      } if (curAlgo?.title.indexOf('车')) {
        return TRIGGER_ORIGIN.CAR;
      }
      return '';
    })();
    return (
      <Modal
        className={styles.algoConfig}
        title="规则配置"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="600px"
      >
        <div className={styles['algoConfig-content']}>
          {
            configEnable[ALGO_CONFIG_TYPE.AREA] && (
              <div className={styles.areaChooose}>
                <p>请设置电子围栏视频区域:</p>
                <CanvasOperator
                  width="550px"
                  id="1"
                  areas={areas}
                  onAreasChange={this.onAreasChange}
                />
              </div>
            )}
          {
            configEnable[ALGO_CONFIG_TYPE.RULE] && (
              <div className={styles.timeChooose}>
                <p>
                  请设置
                  {curAlgo?.title}
                  算法触发规则：
                </p>
                <div>
                  <Select style={{ width: 390 }} onChange={this.onRuleChange} value={ruleConfig}>
                    {
                      Object.values(ALGO_CONFIG_TRIGGER_RULE).map(({ value, title }) => (
                        <Option key={value} value={value}>{title[triggerOrigin]}</Option>
                      ))
                    }
                  </Select>
                </div>

              </div>
            )}
          { configEnable[ALGO_CONFIG_TYPE.TIME] && (
            <div className={styles.timeChooose}>
              <p>
                请设置
                {curAlgo?.title}
                算法触发时间段：
              </p>
              <div>
                <Radio.Group onChange={this.onTimeTypeChange} value={timeType}>
                  {
                    Object.values(ALGO_CONFIG_TRIGGER_TIME_TYPE).map(({ value, label }) => (
                      <Radio key={value} value={value}>{label}</Radio>
                    ))
                  }
                </Radio.Group>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

CameraDetail.propTypes = {
  curAlgo: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  configTypes: PropTypes.array.isRequired,
};

// var ReactPropTypes = {
//   array: createPrimitiveTypeChecker('array'),
//   bool: createPrimitiveTypeChecker('boolean'),
//   func: createPrimitiveTypeChecker('function'),
//   number: createPrimitiveTypeChecker('number'),
//   object: createPrimitiveTypeChecker('object'),
//   string: createPrimitiveTypeChecker('string'),
//   symbol: createPrimitiveTypeChecker('symbol'),
//   any: createAnyTypeChecker(),
//   arrayOf: createArrayOfTypeChecker,
//   element: createElementTypeChecker(),
//   elementType: createElementTypeTypeChecker(),
//   instanceOf: createInstanceTypeChecker,
//   node: createNodeChecker(),
//   objectOf: createObjectOfTypeChecker,
//   oneOf: createEnumTypeChecker,
//   oneOfType: createUnionTypeChecker,
//   shape: createShapeTypeChecker,
//   exact: createStrictShapeTypeChecker,

export default connect(mapStateToProps, mapDispatchToProps)(CameraDetail);
