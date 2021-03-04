/* eslint-disable react/sort-comp */
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
  Spin,
  TimePicker,
  message,
  Button,
} from 'antd';
import math from 'Utils/math';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { getAlgoAreaImage, postAlgoConf } from 'Redux/reducer/cameraDetail';
import CanvasOperator from 'Components/canvasOperator';
import { DRAW_MODES } from 'Components/canvasOperator/constants';
import moment from 'moment';
import { formGetFieldDecorator } from '@/components/FormPopover';
import { times } from 'lodash';
import {
  TRIGGER_ORIGIN,
  ALGO_CONFIG_TRIGGER_RULE,
  ALGO_CONFIG_TRIGGER_TIME_TYPE,
  ALGO_CONFIG_TYPE,
} from '../constants';

import styles from '../index.less';

const { Option } = Select;
const timeFormat = 'HH:mm';

const { TabPane } = Tabs;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
    getAlgoAreaImage,
    addAlgoConf: (deviceId, curAlgo, data) => postAlgoConf(deviceId, [{
      id: curAlgo.id,
      algorithmId: curAlgo.algorithmId,
      // taskId: curAlgo.algorithmId,
      taskName: curAlgo.name,
      action: 'add',
      ...data
    }]),
    updateAlgoConf: (deviceId, curAlgo, data) => postAlgoConf(deviceId, [{
      id: curAlgo.id,
      // algorithmId: curAlgo.algorithmId,
      taskName: curAlgo.name,
      action: 'update',
      ...data
    }]),
  },
  dispatch
);

const ALL_TIME_START = '0:00';
const ALL_TIME_END = '23:59';
const allTimeSetting = {
  start: ALL_TIME_START,
  end: ALL_TIME_END,
};
class CameraDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: [],
      timeSetting: allTimeSetting,
      ruleConfig: '0',
      timeType: ALGO_CONFIG_TRIGGER_TIME_TYPE.ALL_TIME.value,
      imgSrc: null,
      imgLoading: false,
      // areasConfig: undefined,
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('no update algo', nextProps.curAlgo);
  //   if (this.props.curAlgo !== nextProps.curAlgo) {
  //     this.initAlgoConfig(nextProps.curAlgo);
  //     console.log('update algo', nextProps.curAlgo);
  //   }
  // }

  componentDidMount() {
    const {
      configTypes, getAlgoAreaImage, curAlgo, cameraId
    } = this.props;
    if (curAlgo) {
      console.log('curalgo', curAlgo);
      if (curAlgo.isPick) {
        this.initAlgoConfig(curAlgo);
      }
      if (configTypes.indexOf(ALGO_CONFIG_TYPE.AREA) > -1) {
        this.setState({ imgLoading: true });
        getAlgoAreaImage(cameraId)
          .then(imgSrc => this.setState({ imgSrc, imgLoading: false }))
          .catch((e) => {
            this.setState({ imgLoading: false });
          });
      }
    }
  }

  initAlgoConfig = (curAlgo) => {
    const algoConfigs = curAlgo && JSON.parse(curAlgo?.params);
    const {
      triggerType,
      timeSetting,
      areas,
    } = algoConfigs || {};
    const nextState = {};
    if (timeSetting !== undefined) {
      nextState.timeSetting = timeSetting;
      if (timeSetting.start === ALL_TIME_START && timeSetting.end === ALL_TIME_END) {
        nextState.timeType = ALGO_CONFIG_TRIGGER_TIME_TYPE.ALL_TIME.value;
      } else {
        nextState.timeType = ALGO_CONFIG_TRIGGER_TIME_TYPE.BY_SEL.value;
      }
    }
    if (triggerType !== undefined) {
      nextState.ruleConfig = `${triggerType}`;
    }
    if (areas !== undefined) {
      nextState.areas = areas.map((item) => {
        if (item.points && item.points.length) {
          item.points = item.points.map(({ x, y }) => ([x, y]));
        }
        return ({
          ...item,
          shape: 'polygon',
          origin: true, // 代表是原始尺寸
        });
      });
      // 拷贝一份最初版本
      nextState.initalAreas = JSON.parse(JSON.stringify(nextState.areas));
    }
    this.setState(nextState);
  }

  handleOk = () => {
    const {
      areas, timeSetting, ruleConfig, timeType
    } = this.state;
    console.log('areas', areas);
    const {
      curAlgo,
      cameraId,
      addAlgoConf,
      updateAlgoConf,
      configTypes,
    } = this.props;
    const postData = {};
    const { isPick } = curAlgo;
    // 当前已选中则是更新，否则为新增
    const postApi = isPick ? updateAlgoConf : addAlgoConf;
    const configEnable = {};
    for (const config of configTypes) {
      configEnable[config] = true;
    }
    if (configEnable[ALGO_CONFIG_TYPE.AREA]) {
      postData.areas = areas.map(({
        shape, points, ratio, origin, ...otherdata
      }) => {
        if (origin) {
          ratio = 1;
          // return {
          //   points,
          //   ...otherdata
          // };
        }
        if (shape === DRAW_MODES.RECT) {
          const [startPoint, endPoint] = points;
          const point2 = [endPoint[0], startPoint[1]];
          const point4 = [startPoint[0], endPoint[1]];
          points = [startPoint, point2, endPoint, point4];
        }
        // 四舍五入
        const realPoints = points.map(point => ({
          x: math.round(math.multiply(point[0], ratio)),
          y: math.round(math.multiply(point[1], ratio))
        }));
        return {
          points: realPoints,
          ...otherdata,
        };
      });
    }
    if (configEnable[ALGO_CONFIG_TYPE.RULE]) {
      postData.triggerType = ruleConfig;
    }
    if (configEnable[ALGO_CONFIG_TYPE.TIME]) {
      switch (timeType) {
        case ALGO_CONFIG_TRIGGER_TIME_TYPE.BY_SEL.value:
          postData.timeSetting = timeSetting;
          break;
        case ALGO_CONFIG_TRIGGER_TIME_TYPE.ALL_TIME.value:
          postData.timeSetting = allTimeSetting;
          break;
        default:
          break;
      }
    }
    console.log(postData);
    postApi(cameraId, curAlgo, postData).then((res) => {
      console.log(res);
      message.success('提交成功');
      this.props.closeModal();
    }).catch((err) => {
      // todo
    });
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
    const newVal = e.target.value;
    switch (newVal) {
      case ALGO_CONFIG_TRIGGER_TIME_TYPE.BY_SEL.value:
        this.setState({
          timeType: newVal,
        });
        break;
      case ALGO_CONFIG_TRIGGER_TIME_TYPE.ALL_TIME.value:
        this.setState({
          timeSetting: allTimeSetting,
          timeType: newVal,
        });
        break;
      default:
        break;
    }
  }

  onTimeChange = (type, val) => {
    this.setState(({ timeSetting }) => {
      timeSetting[type] = val.format(timeFormat);
      return ({
        timeSetting
      });
    });
  }


  render() {
    const {
      visible, configTypes, curAlgo
    } = this.props;
    const {
      areas = [],
      initalAreas = [],
      ruleConfig,
      timeType,
      imgSrc, imgLoading,
      timeSetting
    } = this.state;
    const configEnable = {};
    for (const config of configTypes) {
      configEnable[config] = true;
    }
    const triggerOrigin = (() => {
      if (curAlgo?.cnName.indexOf('人') > -1) {
        return TRIGGER_ORIGIN.PEOPLE;
      } if (curAlgo?.cnName.indexOf('车') > -1) {
        return TRIGGER_ORIGIN.CAR;
      }
      return '';
    })();
    const footer = (
      <div className={styles.delModalFooter}>
        <Button type="primary" onClick={this.handleOk}>确定</Button>
        <span className={styles.span10px} />
        <Button onClick={this.handleCancel}>取消</Button>
      </div>
    );
    return (
      <Modal
        className={styles.algoConfig}
        title="规则配置"
        visible={visible}
        // onOk={this.handleOk}
        footer={footer}
        onCancel={this.handleCancel}
        width="630px"
      >
        <div className={styles['algoConfig-content']}>
          {
            configEnable[ALGO_CONFIG_TYPE.AREA]
            && (
              <Spin spinning={imgLoading}>
                <div className={styles.areaChooose}>
                  <p>
                    请设置
                    {curAlgo?.cnName}
                    视频区域:
                  </p>
                  <CanvasOperator
                    imgSrc={imgSrc}
                    width="550px"
                    id="1"
                    areas={areas}
                    initalAreas={initalAreas}
                    onAreasChange={this.onAreasChange}
                  />
                </div>
              </Spin>
            )}
          {
            configEnable[ALGO_CONFIG_TYPE.RULE] && (
              <div className={styles.timeChooose}>
                <p>
                  请设置
                  {curAlgo?.cnName}
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
                {curAlgo?.cnName}
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
              {
                timeType === ALGO_CONFIG_TRIGGER_TIME_TYPE.BY_SEL.value && (
                  <div style={{ marginTop: '15px' }}>
                    <TimePicker
                      key="start"
                      allowClear={false}
                      onChange={(...args) => this.onTimeChange('start', ...args)}
                      format={timeFormat}
                      value={moment(timeSetting.start, timeFormat)}
                    />
                    <span className={styles.timeSplit}>—</span>
                    <TimePicker
                      key="end"
                      allowClear={false}
                      onChange={(...args) => this.onTimeChange('end', ...args)}
                      format={timeFormat}
                      value={moment(timeSetting.end, timeFormat)}
                    />
                  </div>
                )}
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
