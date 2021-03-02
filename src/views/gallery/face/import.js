import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  getImportFaceList, submitLabel, saveUploadList
} from 'Redux/reducer/face';
import {
  Form, Steps, Select, Button, Upload, message, List, Card, Tag, Pagination, Modal, Icon
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import noImg from '@/assets/defaultFace.png';
import styles from './import.less';
import { urlPrefix } from '../../../constants/Dictionary';

const { Step } = Steps;
const { Option } = Select;
const { Dragger } = Upload;

const mapStateToProps = state => ({ face: state.face });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getImportFaceList, submitLabel, saveUploadList
  },
  dispatch
);

class ImportFace extends Component {
  state = {
    label: undefined,
    fileList: [],
    stepCurrent: 0,
    uploadStatus: 'todo',
    repeatModalVisible: false,
    repeatNum: 3,
    total: 0,
    pageSize: 12,
    pageNum: 1,
    uploadZipUrl: `${urlPrefix}/face/upload/`,
    faceData: [
    ],
  };

  componentDidMount() {

  }

  getTableList = (isReplaced) => {
    const { getImportFaceList } = this.props;
    const data = {
      pageSize: this.state.pageSize,
      pageNo: this.state.pageNum - 1,
      isReplaced,
    };
    const { stepCurrent } = this.state;
    this.setState({
      loading: true
    });
    console.log('data', data);
    getImportFaceList(data).then((res) => {
      this.setState({
        faceData: res.list,
        total: res.recordsTotal,
        pageNum: res.pageNo + 1,
        pageSize: res.pageSize,
        loading: false,
        stepCurrent: stepCurrent + 1
      });
    });
  };

  selectType = (val) => {
    this.setState({
      label: val
    });
  };

  submitLabel = () => {
    const { submitLabel } = this.props;
    const { label } = this.state;
    const data = {
      label,
    };
    submitLabel(data).then((res) => {
      this.getTableList();
    });
  }

  handleImageError = (e) => {
    const image = e.target;
    image.src = noImg;
    image.style.height = '109px';
    image.style.width = '94px';
    image.style.marginTop = '58px';
    image.onerror = null;
  };

  onPageChange = (current, pageSize) => {
    this.handleListChange({ current, pageSize }, {}, {});
  };

  onShowSizeChange = (current, pageSize) => {
    this.handleListChange({ current, pageSize }, {}, {});
  };

  handleListChange = (pagination, filters, sorter) => {
    this.setState({
      stepCurrent: 1,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    }, () => this.getTableList());
  };

  submit= () => {
    // 导入人脸的最后一步 提交
    const { saveUploadList } = this.props;
    saveUploadList().then((res) => {
      this.props.history.go(-1);
    });
  }

  render() {
    const that = this;
    const {
      uploadZipUrl, fileList, stepCurrent, label, uploadStatus, faceData, total, pageNum, pageSize, repeatModalVisible, repeatNum
    } = this.state;
    const props = {
      name: 'file',
      multiple: false,
      action: uploadZipUrl,
      fileList,
      beforeUpload: file => new Promise((resolve, reject) => {
        const isZip = file.type === 'application/zip';
        if (!isZip) {
          message.error('请上传ZIP格式的压缩包！');
        }
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
          message.error('压缩包大小不得超过50M！');
        }
        if (isZip && isLt50M) {
          return resolve(true);
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject(false);
      }),
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          that.setState({
            uploadStatus: 'done',
          });
        } else if (status === 'error') {
          message.error(`${info.file.name}上传失败！`);
        }
        const fileList = [info.fileList[info.fileList.length - 1]];
        that.setState({ fileList: [...fileList] });
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
                  <Select value={label} onChange={this.selectType}>
                    <Option value={0}>白名单</Option>
                    <Option value={1}>黑名单</Option>
                  </Select>
                </div>

                <div className={styles.nextStep}>
                  {label === 0 || label === 1
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
              <div>
                {
                  stepCurrent === 1 ? (
                    <div className={styles.draggerContainer}>
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
                        {uploadStatus === 'done' && !repeatModalVisible
                          ? (
                            <div className={styles.btn}>
                              <Button type="primary" onClick={this.submitLabel}>下一步</Button>
                              <Button type="button" onClick={() => this.setState({ stepCurrent: stepCurrent - 1 })}>上一步</Button>
                            </div>
                          ) : (
                            <div className={styles.btn}>
                              <Button type="primary" disabled>下一步</Button>
                              <Button type="button" onClick={() => this.setState({ stepCurrent: stepCurrent - 1 })}>上一步</Button>
                            </div>
                          )}
                      </div>

                    </div>

                  ) : (
                    <div className={styles.previewContainer}>
                      <List
                        grid={{
                          gutter: 16,
                          xs: 1,
                          sm: 2,
                          md: 4,
                          lg: 4,
                          xl: 6,
                          xxl: 8,
                        }}
                        dataSource={faceData}
                        pagination={false}
                        renderItem={item => (
                          <List.Item>
                            <Card bordered={false}>
                              <div className={styles.cardContanier}>
                                <div className={styles.imgContainer}>
                                  <img src={`${urlPrefix}/face/displayupload/${item.temporaryId}`} onError={e => this.handleImageError(e)} alt="" />
                                </div>
                                <div className={styles.footerContanier}>
                                  <div className={styles.info}>
                                    <div title={item.name} className={styles.name}>{item.name.split('.')[0]}</div>
                                    {
                                      item.labelCode === 0 ? <div className={styles.tagContainer}><Tag color="green">白名单</Tag></div> : <div className={styles.tagContainer}><Tag color="red">黑名单</Tag></div>
                                    }
                                  </div>
                                </div>
                              </div>

                            </Card>
                          </List.Item>
                        )}
                      />
                      <div className={styles.paginationWrapper}>
                        <span>
                          总条数：
                          {total}
                        </span>
                        <div>
                          <Pagination
                            total={total}
                            current={pageNum}
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['12', '24', '36', '48']}
                            pageSize={pageSize}
                            onChange={this.onPageChange}
                            onShowSizeChange={this.onShowSizeChange}
                          />
                        </div>
                      </div>
                      <div className={styles.btn}>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                        <Button type="button" onClick={() => this.props.history.go(-1)}>取消</Button>
                      </div>
                    </div>
                  )

                }
              </div>

            )
          }
        </div>
        <Modal
          visible={repeatModalVisible}
          className={styles.repeatModal}
          width="400px"
          closable={false}
          footer={[
            <Button key="submit" type="primary" onClick={() => this.getTableList(true)}>
              确定
            </Button>,
            <Button key="back" style={{ margin: '0 0 0 20px' }} onClick={() => { this.setState({ repeatModalVisible: false }, () => { this.getTableList(false); }); }}>
              取消
            </Button>,
          ]}
        >
          <div>
            <Icon type="warning" />
            <div>{`您添加的${repeatNum}条人脸数据已存在，是否要覆盖？`}</div>
          </div>
        </Modal>

      </div>
    );
  }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(ImportFace));
