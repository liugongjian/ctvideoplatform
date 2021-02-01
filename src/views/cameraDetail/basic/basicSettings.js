
import React, { Component } from 'react';
import {
  Select,
  Form,
  Input,
  Button,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  getSummary, getMonitorMetric,
} from 'Redux/reducer/monitor';

import styles from '../index.less';

const { Option } = Select;

const mapStateToProps = state => ({
  // monitor: state.monitor
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);


const LocationInput = ({ value, onChange }) => {
  let longitude = 0;
  let latitude = 0;
  if (value && value.length) {
    [longitude, latitude] = value?.split(',');
  }
  return (
    <>
      <Input
        type="number"
        className={styles.locationInputNumber}
        value={longitude}
        onChange={(e) => { onChange(`${e.target.value},${latitude}`); }}
      />
      <span className={styles.locationInputSplit}>&nbsp;,</span>
      <Input
        type="number"
        className={styles.locationInputNumber}
        value={latitude}
        onChange={(e) => { onChange(`${longitude},${e.target.value}`); }}
      />
    </>
  );
};
class BasicSetting extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {
    // ajax code
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <div className={styles.basicSetting}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="摄像头名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入摄像头名称!',
                },
                {
                  max: 30,
                  message: '请勿输入超过30个字符!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="经纬度">
            {getFieldDecorator('longitude', { // longitude and latitude;
              rules: [
                {
                  required: true,
                  message: '请输入经纬度',
                }
              ],
            })(<LocationInput />)}
          </Form.Item>
          <Form.Item label="区域详情">
            {getFieldDecorator('area', {
              rules: [
                {
                  required: true,
                  message: '请选择区域!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <span className={styles.span10px} />
            <Button>
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

BasicSetting.propTypes = {
  monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BasicSetting));
