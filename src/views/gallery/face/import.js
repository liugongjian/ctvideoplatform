import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import PropTypes from 'prop-types';
import {
} from 'Redux/reducer/face';
import {
  Form, Steps, Select, Button
} from 'antd';
import styles from './import.less';

const { Step } = Steps;
const { Option } = Select;

const mapStateToProps = state => ({ face: state.face });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
  },
  dispatch
);

class ImportFace extends Component {
  state = {
    type: undefined,
    stepCurrent: 1
  };

  componentDidMount() {

  }

  selectType = (val) => {
    this.setState({
      type: val,
      stepCurrent: 2,
    });
  };

  render() {
    const { stepCurrent, type } = this.state;
    return (
      <div className={styles.content}>
        {/* <div>批量导入人脸</div> */}
        <Steps current={stepCurrent}>
          <Step title="步骤一" description="选择图片标签类型" />
          <Step title="步骤二" description="上传图片压缩包" />
          <Step title="步骤三" description="人脸图片预览" />
        </Steps>

        <div className={styles.selectType}>
          <span className={styles.queryLabel}>选择图片标签类型：</span>
          <Select value={type} onChange={this.selectType}>
            <Option value={1}>白名单</Option>
            <Option value={2}>黑名单</Option>
          </Select>
        </div>

        <div className={styles.nextStep}>
          {
            type ? <Button type="primary">下一步</Button> : ''
          }


        </div>
      </div>
    );
  }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(ImportFace));
