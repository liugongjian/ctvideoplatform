import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import PropTypes from 'prop-types';
import {
} from 'Redux/reducer/face';
import {
  Form, Steps, Select, Button, Upload, message
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import styles from './import.less';

const { Step } = Steps;
const { Option } = Select;
const { Dragger } = Upload;

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
    stepCurrent: 0
  };

  componentDidMount() {

  }

  selectType = (val) => {
    this.setState({
      type: val
    });
  };

  render() {
    const { stepCurrent, type } = this.state;
    const props = {
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div className={styles.content}>
        <div className={styles.importContainer}>
          <Steps current={stepCurrent}>
            <Step title="选择图片标签类型" />
            <Step title="上传图片压缩包" />
            <Step title="人脸图片预览" />
          </Steps>

          {
            stepCurrent === 0 ? (
              <div className={styles.selectContainer}>
                <div className={styles.selectType}>
                  <span className={styles.selectLabel}>选择图片标签类型：</span>
                  <Select value={type} onChange={this.selectType}>
                    <Option value={1}>白名单</Option>
                    <Option value={2}>黑名单</Option>
                  </Select>
                </div>

                <div className={styles.nextStep}>
                  {type
                    ? (
                      <div className={styles.btn}>
                        <Button type="primary" onClick={() => this.setState({ stepCurrent: stepCurrent + 1 })}>下一步</Button>
                        <Button type="button" onClick={() => this.props.history.go(-1)}>返回</Button>
                      </div>
                    ) : (
                      <div className={styles.btn}>
                        <Button type="primary" disabled>下一步</Button>
                        <Button type="button" onClick={() => this.props.history.go(-1)}>返回</Button>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className={styles.draggerContainer}>
                {
                  stepCurrent === 1 ? (
                    <div>
                      <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击或将压缩包拖拽到这里上传</p>
                        <p className="ant-upload-hint">
                          压缩包格式：支持ZIP格式压缩包
                        </p>
                        <p className="ant-upload-hint">
                          图片格式：支持.jpg、.png格式图片
                        </p>
                        <p className="ant-upload-hint">
                          图片命名规则：使用图片中人脸的姓名进行图片命名，如张三.jpg
                        </p>
                      </Dragger>
                      <div className={styles.nextStep}>
                        <div className={styles.btn}>
                          <Button type="primary" onClick={() => this.setState({ stepCurrent: stepCurrent + 1 })}>下一步</Button>
                          <Button type="button" onClick={() => this.setState({ stepCurrent: stepCurrent - 1 })}>上一步</Button>

                        </div>
                      </div>

                    </div>

                  ) : (
                    <div>这是步骤三对应的组件</div>
                  )

                }
              </div>

            )
          }
        </div>

      </div>
    );
  }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(ImportFace));
