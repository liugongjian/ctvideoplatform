/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import {
  Select,
  Tabs,
  Form,
  Input,
  Modal,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { getSummary, getMonitorMetric } from 'Redux/reducer/monitor';
import CanvasOperator from 'Components/canvasOperator';

import styles from '../index.less';

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
      a: 0,
    };
  }

  componentDidMount() {

  }

  handleOk = () => {
    this.props.closeModal();
  }

  handleCancel = () => {
    this.props.closeModal();
  }

  render() {
    const {
      title,
      visible,
    } = this.props;
    return (
      <Modal
        className={styles.algoConfig}
        title="算法配置"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="800px"
      >
        <div>
          <CanvasOperator
            width="750px"
            id="1"
          />
        </div>
      </Modal>
    );
  }
}

CameraDetail.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
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
