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
      areas: [],
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

  render() {
    const {
      title,
      visible,
    } = this.props;
    const {
      areas
    } = this.state;
    return (
      <Modal
        className={styles.algoConfig}
        title="规则配置"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="600px"
      >
        <div>
          <CanvasOperator
            width="550px"
            id="1"
            areas={areas}
            onAreasChange={this.onAreasChange}
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
