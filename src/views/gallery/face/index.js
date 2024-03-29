import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  getFaceList, addFace, editFace, delFace
} from 'Redux/reducer/face';
import {
  message, Button, Modal, Form, Input, Icon, Radio, Upload, List, Spin, Card, Tag, Checkbox,
} from 'antd';
import Pagination from 'Components/EPagination';
import DeleteModal from 'Components/modals/warnModal';
import {
  LoadingOutlined, PlusOutlined, ImportOutlined, SearchOutlined
} from '@ant-design/icons';
import noImg from '@/assets/defaultFace.png';
import { urlPrefix } from 'Constants/Dictionary';

import styles from './index.less';

const FormItem = Form.Item;

const mapStateToProps = state => ({ face: state.face });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push, getFaceList, addFace, editFace, delFace
  },
  dispatch
);

class Face extends Component {
    state = {
      uploadUrl: `${urlPrefix}/face/upload/`,
      modalVisible: false,
      modalStatus: 'add',
      textMap: {
        add: '新增人脸数据',
        edit: '编辑人脸数据',
      },
      delModalVisible: false,
      selectedRowKeys: [],
      total: 0,
      pageSize: document.documentElement.clientWidth >= 1600 ? 16 : 12,
      pageNum: 1,
      loading: false,
      faceData: [
      ],
      name: '',
      imageLoading: false,
      imageUrl: '',
      delName: '',
      delIds: [],
      editId: '',
      submitBtnDis: false,
      editFaceId: '',
      pageSizeOptions: document.documentElement.clientWidth >= 1600 ? ['16', '32', '48', '64'] : ['12', '24', '36', '48'],
      isBigScreen: document.documentElement.clientWidth >= 1600,
    };

    componentDidMount() {
      this.getTableList();
      this.setTimerInterval();
      window.addEventListener('resize', this.resize.bind(this));
    }


    componentWillUnmount() {
      window.removeEventListener('resize', this.resize.bind(this));
      this.clearTimerInterval();
    }

    setTimerInterval = () => {
      const {
        location: {
          state: withRefresh
        }
      } = this.props;
      console.log('withRefresh', withRefresh);
      if (withRefresh) {
        this.props.history.replace('/gallery/face'); // 清除需要URI state中的参数
        this.countTime = 0;
        this.interVal = window.setInterval(() => {
          if (this.countTime > 9) {
            this.clearTimerInterval();
          } else {
            this.countTime++;
            this.getTableList();
          }
        }, 5000);
      }
    }

    clearTimerInterval = () => {
      this.countTime = 0;
      window.clearInterval(this.interVal);
      this.interVal = null;
    }

    resize = () => {
      const screenWidth = document.documentElement.clientWidth;
      if (!this.state.isBigScreen && screenWidth >= 1600) {
        this.setState({
          isBigScreen: true,
          pageNum: 1,
          pageSize: 16,
          pageSizeOptions: ['16', '32', '48', '64']
        }, () => this.getTableList());
      } else if (this.state.isBigScreen && screenWidth < 1600) {
        this.setState({
          pageNum: 1,
          isBigScreen: false,
          pageSize: 12,
          pageSizeOptions: ['12', '24', '36', '48']
        }, () => this.getTableList());
      }
    };


    getTableList = () => {
      const { getFaceList } = this.props;
      const data = {
        name: this.state.name,
        pageSize: this.state.pageSize,
        pageNo: this.state.pageNum - 1
      };
      this.setState({
        loading: true,
        selectedRowKeys: []
      });
      getFaceList(data).then((res) => {
        let faceDataTemp = [];
        faceDataTemp = res?.list && res?.list.map((item) => {
          item.isChecked = false;
          return item;
        });
        this.setState({
          faceData: faceDataTemp,
          total: res?.recordsTotal,
          pageNum: res?.pageNo + 1,
          pageSize: res?.pageSize,
          loading: false
        });
      });
    };

    queryName = (e) => {
      this.setState({
        name: e.target.value.trim()
      });
    };

    // 添加人脸数据按钮
    handleAddFace = () => {
      const { faceData, selectedRowKeys } = this.state;
      if (selectedRowKeys.length > 0) {
        for (let i = 0; i < selectedRowKeys.length; i++) {
          for (let j = 0; j < faceData.length; j++) {
            if (faceData[j].id === selectedRowKeys[i]) {
              faceData[j].isChecked = false;
            }
          }
        }
        this.setState({
          selectedRowKeys: [],
          faceData,
        });
      }
      this.setState({
        modalVisible: true,
        modalStatus: 'add',
        imageUrl: ''
      });
      this.props.form.resetFields();
    };

    handleCancel = () => {
      this.setState({
        modalVisible: false
      });
    };

    // 提交添加人脸数据的表单
    addFace = () => {
      const { addFace } = this.props;
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          this.setState({
            submitBtnDis: true,
            modalVisible: false,
          });
          delete values.imageUrl;
          addFace(values).then(
            (res) => {
              message.success('新增人脸数据成功');
              this.setState({
                pageNum: 1,
                submitBtnDis: false
              }, () => {
                this.getTableList();
              });
            }
          ).catch((err) => {
            this.setState({
              submitBtnDis: false
            }, () => {
              this.getTableList();
            });
          });
        }
      });
    };

    // 编辑人脸数据按钮
    handleEditFace = (item) => {
      const {
        form: { setFieldsValue }
      } = this.props;
      const { faceData, selectedRowKeys } = this.state;
      if (selectedRowKeys.length > 0) {
        for (let i = 0; i < selectedRowKeys.length; i++) {
          for (let j = 0; j < faceData.length; j++) {
            if (faceData[j].id === selectedRowKeys[i]) {
              faceData[j].isChecked = false;
            }
          }
        }
        this.setState({
          selectedRowKeys: [],
          faceData,
        });
      }
      this.setState({
        modalVisible: true,
        modalStatus: 'edit',
        editId: item.id,
      });
      setFieldsValue({
        name: item.name.split('.')[0],
        imageUrl: `${urlPrefix}/face/displayexist/${item.photoId}?${new Date().getTime()}`,
        label: item.labelCode
      });
      this.setState({
        imageUrl: `${urlPrefix}/face/displayexist/${item.photoId}?${new Date().getTime()}`
      });
    };

    // 提交编辑人脸数据的表单
    editFace = (e) => {
      const { editFace } = this.props;
      const { editId, editFaceId } = this.state;
      this.setState({
        submitBtnDis: true,
        modalVisible: false,
      });
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          const data = Object.assign({ id: editId, faceId: editFaceId }, values);
          delete data.imageUrl;
          editFace(data).then(
            (res) => {
              message.success('编辑人脸数据成功');
              this.setState({
                submitBtnDis: false,
              }, () => this.getTableList());
            }
          ).catch((err) => {
            // message.warning('添加账户失败')
          });
        }
      });
    };

    handleDelFace = (isSingleDel, item) => {
      const id = isSingleDel ? item.id : '';
      let ids;
      let nameTemp;
      // 单个删除
      if (isSingleDel) {
        ids = [id];
        nameTemp = item.name;
        const { faceData, selectedRowKeys } = this.state;
        if (selectedRowKeys.length > 0) {
          for (let i = 0; i < selectedRowKeys.length; i++) {
            for (let j = 0; j < faceData.length; j++) {
              if (faceData[j].id === selectedRowKeys[i]) {
                faceData[j].isChecked = false;
              }
            }
          }

          this.setState({
            selectedRowKeys: [],
            faceData,
          });
        }
      } else {
        // 批量删除
        ids = this.state.selectedRowKeys;
        nameTemp = '';
      }
      this.setState({
        delModalVisible: true,
        delIds: ids,
        delName: nameTemp
      });
    };

    // 还原releaseV1.2中遗失代码
    handleDelCancel = () => {
      const { faceData, selectedRowKeys } = this.state;
      for (let i = 0; i < selectedRowKeys.length; i++) {
        for (let j = 0; j < faceData.length; j++) {
          if (faceData[j].id === selectedRowKeys[i]) {
            faceData[j].isChecked = false;
          }
        }
      }
      this.setState({
        delModalVisible: false,
        selectedRowKeys: [],
        faceData,
      });
    };

  delFace = () => {
    const { delFace } = this.props;
    const data = {
      userFaceIdList: this.state.delIds
    };
    this.setState({
      delModalVisible: false,
      loading: true,
    });
    delFace(data).then((res) => {
      message.success('删除成功');
      this.setState({
        pageNum: 1,
        selectedRowKeys: [],
      }, () => this.getTableList());
    });
  };

    beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('仅支持上传.jpg、.png格式图片！');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不得超过5M！');
      }
      return isJpgOrPng && isLt5M;
    };


    handleChange = (info) => {
      if (info.file.status === 'uploading') {
        this.setState({ imageLoading: true });
        return;
      }
      if (info.file.status === 'done' && info.file.response.code === 0) {
        if (info.file.response.data[0].faceId) {
          this.setState({
            imageUrl: `${urlPrefix}/face/displayupload/${info.file.response.data[0].faceId}?${new Date().getTime()}`,
            imageLoading: false,
          });
        }
        if (info.file.response.data[0].faceId && this.state.modalStatus === 'edit') {
          this.setState({
            editFaceId: info.file.response.data[0].faceId
          });
        }
      }
      if (info.file.response.code === -1) {
        message.error(`${info.file.name}上传失败！`);
      }
    };

    renderTableHeaders = () => {
      const {
        name, selectedRowKeys,
      } = this.state;
      return (
        <div className={styles.listHeader}>
          <div className={styles.query}>
            <Input
              placeholder="请输入姓名"
              onChange={this.queryName}
              value={name}
              onPressEnter={() => this.setState({ pageNum: 1 }, () => { this.getTableList(); })}
              suffix={
                <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} onClick={() => this.setState({ pageNum: 1 }, () => { this.getTableList(); })} />
              }
            />
          </div>
          <div className={styles.operationAssets}>
            <div className={styles.add}>
              <Button type="primary" onClick={this.handleAddFace}>+ 新增人脸数据</Button>
            </div>
            <div className={styles.import}>
              <Link to="/gallery/face/import" className={styles.importLink}>
                <ImportOutlined className={styles.iconActive} />
                <span>批量导入</span>
              </Link>
            </div>
            <div className={styles.del}>
              {
                selectedRowKeys.length > 0
                  ? (
                    <>
                      <Icon type="delete" className={styles.iconActive} />
                      <a onClick={() => this.handleDelFace(false)}>批量删除</a>
                    </>
                  ) : (
                    <>
                      <Icon type="delete" className={styles.iconDisabled} />
                      <a disabled>批量删除</a>
                    </>
                  )}
            </div>

          </div>
        </div>
      );
    };

    handleImageError = (e) => {
      const image = e.target;
      image.src = noImg;
      image.style.height = '109px';
      image.style.width = '94px';
      image.style.marginTop = '58px';
      image.onerror = null;
    };

    handleEditImageError = (e) => {
      const image = e.target;
      image.src = noImg;
      image.style.height = '102px';
      image.style.width = '102px';
      image.onerror = null;
    }

    onChange = (item, e) => {
      const { faceData, selectedRowKeys } = this.state;
      let faceDataTemp = [];
      faceDataTemp = faceData.map((i) => {
        if (i.id === item.id) {
          i.isChecked = e.target.checked;
          return i;
        }
        return i;
      });

      if (e.target.checked) {
        selectedRowKeys.push(item.id);
      } else if (selectedRowKeys.indexOf(item.id) > -1) {
        const index = selectedRowKeys.indexOf(item.id);
        selectedRowKeys.splice(index, 1);
      }

      this.setState({
        selectedRowKeys,
        faceData: faceDataTemp
      });
    };

    showTotal = total => (<span className={styles.totalText}>{`总条数： ${total}`}</span>);

    onPageChange = (current, pageSize) => {
      this.handleListChange({ current, pageSize }, {}, {});
    };

    handleListChange = (pagination, filters, sorter) => {
      this.setState({
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }, () => this.getTableList());
    };

    renderTable = () => {
      const {
        loading, uploadUrl, faceData, modalVisible, textMap,
        modalStatus, imageLoading, imageUrl, delModalVisible,
        selectedRowKeys, delName, delIds, total, pageNum, pageSize,
        pageSizeOptions, submitBtnDis
      } = this.state;
      const delIdsLength = delIds.length;
      const {
        form: { getFieldDecorator },
      } = this.props;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };
      const uploadButton = (
        <div>
          {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8, color: '#999999' }}>上传</div>
        </div>
      );
      return (
        <div>
          <div className={styles.mainContanier}>
            <Spin spinning={loading}>
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
                    <Card bordered={false} hoverable>
                      <div
                        className={item.isChecked
                          ? styles.cardContanierChecked : styles.cardContanier}
                      >
                        <div className={styles.imgContainer}>
                          { !loading ? <img src={`${urlPrefix}/face/displayexist/${item.photoId}?${new Date().getTime()}`} onError={e => this.handleImageError(e)} alt="" /> : ''}
                          <Checkbox
                            className={item.isChecked
                              ? styles.checkedbox : styles.checkbox}
                            checked={item.isChecked}
                            onChange={e => this.onChange(item, e)}
                          />
                          {
                            item.syncStatusCode !== 1 ? (
                              <div className={styles.faceTip}>
                                {item.syncStatusCode === 2 ? '人脸录入中' : '人脸录入失败'}
                              </div>
                            ) : ''
                          }
                        </div>
                        <div className={item.isChecked ? styles.btnChecked : styles.btn}>
                          <Icon type="edit" className={styles.iconEdit} onClick={() => this.handleEditFace(item)} />
                          <div className={styles.line} />
                          <Icon type="delete" className={styles.iconDel} onClick={() => this.handleDelFace(true, item)} />
                        </div>
                        <div className={styles.footerContanier}>
                          <div className={styles.info}>
                            <div title={item.name} className={styles.name}>{item.name.split('.')[0]}</div>
                            {
                              item.labelCode === 0 || item.labelCode === 1 ? (
                                <div className={styles.tagContainer}>
                                  {
                                    item.labelCode === 0
                                      ? <Tag color="green">白名单</Tag> : <Tag color="red">黑名单</Tag>
                                  }
                                </div>
                              )
                                : <div className={styles.tagContainer}><Tag color="blue">其他</Tag></div>
                            }
                          </div>
                        </div>
                      </div>

                    </Card>
                  </List.Item>
                )}
              />
            </Spin>
            <Modal
              title={textMap[modalStatus]}
              visible={modalVisible}
              className={styles.addOrEditModal}
              width="600px"
              onCancel={this.handleCancel}
              footer={[
                <Button key="submit" type="primary" onClick={modalStatus === 'add' ? this.addFace : this.editFace} disabled={submitBtnDis}>
                  确定
                </Button>,
                <Button key="back" style={{ margin: '0 0 0 20px' }} onClick={this.handleCancel}>
                  取消
                </Button>,
              ]}
            >
              <Form horizontal="true">
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '姓名不能为空' },
                      { max: 30, message: '姓名不得超过30个字符' },
                      { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '姓名只能是汉字和字母以及数字并且不能包含空字符' }
                    ],
                    validateTrigger: 'onBlur'
                  })(
                    <Input placeholder="请输入姓名" />
                  )
                  }
                </FormItem>
                <FormItem label="上传人脸图像" {...formItemLayout} extra="支持.jpg、.png格式图片，图片大小不得超过5M">
                  {getFieldDecorator('imageUrl', {
                    rules: [
                      { required: true, message: '请上传人脸图像' }
                    ],
                    validateTrigger: 'onChange',
                    valuePropName: 'avatar'
                  })(
                    <Upload
                      name="file"
                      listType="picture-card"
                      multiple={false}
                      showUploadList={false}
                      action={uploadUrl}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange}
                    >
                      {imageUrl ? <img src={imageUrl} alt="" style={{ width: '100%' }} onError={e => this.handleEditImageError(e)} /> : uploadButton}
                    </Upload>
                  )
                  }
                </FormItem>
                <FormItem label="布控标签" {...formItemLayout}>
                  {getFieldDecorator('label', {
                    rules: [
                      { required: true, message: '请选择一个标签' }
                    ],
                    validateTrigger: 'onChange'
                  })(
                    <Radio.Group>
                      <Radio value={0}>白名单</Radio>
                      <Radio value={1}>黑名单</Radio>
                    </Radio.Group>
                  )
                  }
                </FormItem>
              </Form>
            </Modal>
            <DeleteModal
              visible={delModalVisible}
              handleOk={this.delFace}
              closeModal={this.handleDelCancel}
              content={`您确定要删除${selectedRowKeys.length > 0 ? `这${delIdsLength}个人脸数据吗？` : `${delName.split('.')[0]}的人脸数据吗？`}`}
            />

          </div>
          <Pagination
            total={total}
            current={pageNum}
            pageSize={pageSize}
            onChange={this.onPageChange}
            onShowSizeChange={this.onPageChange}
            pageSizeOptions={pageSizeOptions}
            hideOnSinglePage={false}
            showSizeChanger
            showQuickJumper
            showTotal={this.showTotal}
          />
        </div>
      );
    };


    render() {
      return (
        <div className={styles.faceContent}>
          {this.renderTableHeaders()}
          {this.renderTable()}
        </div>
      );
    }
}


export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Face));
