
import React, { Component } from 'react';
import {
  Select,
  Form,
  Input,
  Button,
  Cascader,
  message,
  Spin,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import cameraDetail, {
  getAreaList, getBasicConfig, putBasicConfig
} from 'Redux/reducer/cameraDetail';

import styles from '../index.less';

const { Option } = Select;

const mapStateToProps = state => ({
  cameraDetail: state.cameraDetail
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getAreaList, getBasicConfig, putBasicConfig
  },
  dispatch
);
class BasicSetting extends Component {
  constructor() {
    super();
    this.state = {
      areaData: []
    };
  }

  componentDidMount() {
    const {
      getAreaList
    } = this.props;
    // 获取区域层级
    getAreaList(0).then((areaList) => {
      // 获取基础配置
      this.initData(areaList);
    });
  }


  initData = (areaList) => {
    const {
      getBasicConfig, cameraId,
      form: { setFieldsValue }
    } = this.props;
      // 获取基础配置
    getBasicConfig(cameraId).then((data) => {
      const {
        name, areaId, latitude, longitude
      } = data;
        // 获取当前区域的上层层级
      const areaPathJson = areaList?.find(({ id }) => id === areaId)?.path;
      const areaPath = JSON.parse(areaPathJson);
      areaPath.shift(); // 去掉队头的 0
      // 初始化form
      setFieldsValue({
        name,
        longitude,
        latitude,
        area: [...areaPath, areaId]
      });
    });
  }

  onAreaChange = () => {

  }

  onSubmit = (e) => {
    const {
      form: { validateFields }, putBasicConfig, cameraId, areaList
    } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const {
          name, latitude, longitude, area
        } = values;
        putBasicConfig({
          id: cameraId,
          areaId: area[area.length - 1],
          name,
          latitude,
          longitude,
        }).then((res) => {
          this.initData(areaList);
        });
      }
    });
  }

  backToPre = () => {
    this.props.push('/monitor');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    const {
      cameraId,
      cameraDetail: {
        areaTree,
        areaList,
        areaListLoading,
        basicConfig,
        basicConfigLoading,
      }
    } = this.props;
    return (
      <div className={styles.basicSetting}>
        <Spin spinning={areaListLoading || basicConfigLoading}>
          <Form onSubmit={this.handleSubmit} className={styles.basicSettingForm}>
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
            <Form.Item label="经纬度" style={{ marginBottom: 0 }} className={styles.addItemRequiredIcon}>
              <Form.Item className={styles.locationInputNumber}>
                {getFieldDecorator('longitude', {
                  rules: [
                    {
                      required: true,
                      message: '请输入经度！',
                    },
                    {
                      validator: (rule, val, callback) => {
                        const num = parseFloat(val);
                        if (val < -180 || val > 180) {
                          callback('请输入正确的经度！');
                        }
                        callback();
                      }
                    }
                  ],
                })(<Input
                  type="number"
                />)}
              </Form.Item>
              <span className={styles.locationInputSplit} />
              <Form.Item className={styles.locationInputNumber}>
                {getFieldDecorator('latitude', {
                  rules: [
                    {
                      required: true,
                      message: '请输入纬度',
                    },
                    {
                      validator: (rule, val, callback) => {
                        const num = parseFloat(val);
                        if (val < -90 || val > 90) {
                          callback('请输入正确的纬度！');
                        }
                        callback();
                      }
                    }
                  ],
                })(<Input
                  type="number"
                  onBlur={() => this.props.form.validateFields(['latitude'])}
                />)}
              </Form.Item>
            </Form.Item>
            <Form.Item label="区域详情">
              {getFieldDecorator('area', {
                rules: [
                  {
                    required: true,
                    message: '请选择区域!',
                  },
                ],
              })(
                <Cascader
                  changeOnSelect
                  options={areaTree}
                // onChange={this.onAreaChange}
                />,
              )}
            </Form.Item>
            <Form.Item label=" " colon={false}>
              <Button type="primary" htmlType="submit" onClick={this.onSubmit}>
                保存
              </Button>
              <span className={styles.span20px} />
              <Button onClick={this.backToPre}>
                返回
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    );
  }
}

BasicSetting.propTypes = {
  cameraId: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BasicSetting));
