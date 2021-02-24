import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import PropTypes from 'prop-types';
import {
  getFaceList, addFace, editFace, delFace
} from 'Redux/reducer/face';
import {
  message, Button, Modal, Form, Input, Icon, Radio, Upload, List, Card, Tag, Checkbox, Pagination
} from 'antd';
import {
  LoadingOutlined, PlusOutlined, ImportOutlined, SearchOutlined
} from '@ant-design/icons';
import noImg from '@/assets/bg.png';

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
      modalVisible: false,
      modalStatus: 'add',
      textMap: {
        add: '新增人脸数据',
        edit: '编辑人脸数据',
      },
      delModalVisible: false,
      selectedRowKeys: [],
      total: 4,
      pageSize: 10,
      pageNum: 1,
      loading: false,
      faceData: [
        {
          aid: 416099,
          createTimeime: '2021-01-20T17:26:57.000+0800',
          enable: 'y',
          id: 3299604200531968,
          image: 'http://192.168.10.146:8666/images/uid/573ad394c1e4408696223d5d7982ce11',
          name: 'lizhiyonglizhiyonglizhiyonglizhiyong',
          nameList: 1,
          updateTime: '2021-01-20T17:26:58.000+0800',
          checkboxShow: false,
          isChecked: false,
        },
        {
          aid: 532611,
          createTimeime: '2021-01-20T17:34:24.000+0800',
          enable: 'y',
          id: 3299605114097664,
          image: 'http://192.168.10.146:8666/images/uid/456b10457f1138c10fa3a349b394ffb0',
          name: 'lxp',
          nameList: 2,
          updateTime: '2021-01-20T17:34:24.000+0800',
          checkboxShow: false,
          isChecked: false,
        },
        {
          aid: 532612,
          createTimeime: '2021-01-20T17:34:24.000+0800',
          enable: 'y',
          id: 3299605114097665,
          image: 'http://192.168.10.146:8666/images/uid/456b10457f1138c10fa3a349b394ffb0',
          name: 'llll',
          nameList: 2,
          updateTime: '2021-01-20T17:34:24.000+0800',
          checkboxShow: false,
          isChecked: false,
        },
        {
          aid: 532613,
          createTimeime: '2021-01-20T17:34:24.000+0800',
          enable: 'y',
          id: 3299605114097666,
          image: 'http://192.168.10.146:8666/images/uid/456b10457f1138c10fa3a349b394ffb0',
          name: 'hhhh',
          nameList: 2,
          updateTime: '2021-01-20T17:34:24.000+0800',
          checkboxShow: false,
          isChecked: false,
        },
        {
          aid: 532614,
          createTimeime: '2021-01-20T17:34:24.000+0800',
          enable: 'y',
          id: 3299605114097667,
          image: 'http://192.168.10.146:8666/images/uid/456b10457f1138c10fa3a349b394ffb0',
          name: 'lxp',
          nameList: 1,
          updateTime: '2021-01-20T17:34:24.000+0800',
          checkboxShow: false,
          isChecked: false,
        },
        {
          aid: 532615,
          createTimeime: '2021-01-20T17:34:24.000+0800',
          enable: 'y',
          id: 3299605114097668,
          image: 'http://192.168.10.146:8666/images/uid/456b10457f1138c10fa3a349b394ffb0',
          name: 'lxpffff',
          nameList: 1,
          updateTime: '2021-01-20T17:34:24.000+0800',
          checkboxShow: false,
          isChecked: false,
        },
        {
          aid: 532616,
          createTimeime: '2021-01-20T17:34:24.000+0800',
          enable: 'y',
          id: 3299605114097669,
          image: 'http://192.168.10.146:8666/images/uid/456b10457f1138c10fa3a349b394ffb0',
          name: 'lxpffffjjj',
          nameList: 1,
          updateTime: '2021-01-20T17:34:24.000+0800',
          checkboxShow: false,
          isChecked: false,
        }
      ],
      name: '',
      imgaeLoading: false,
      imageUrl: '',
      delName: '',
      delIds: [],


    };

    componentDidMount() {
      this.getTableList();
    }

    getTableList = () => {
      const { getFaceList } = this.props;
      const data = {
        name: this.state.name,
        pageSize: this.state.pageSize,
        pageNo: this.state.pageNum - 1
      };
      this.setState({
        loading: true
      });
      console.log('data', data);
      // 这里要给list 加一个checkbox 显示与否的 flag
    //   getFaceList(data).then((res) => {
    //     this.setState({
    //       faceData: res.list,
    //       total: res.recordsTotal,
    //       pageNum: res.pageNo + 1,
    //       pageSize: res.pageSize,
    //       loading: false
    //     });
    //   });
    };

    queryName = (e) => {
      this.setState({
        name: e.target.value.trim()
      });
    };

    // 添加人脸数据按钮
    handleAddFace = () => {
      this.setState({
        modalVisible: true,
        modalStatus: 'add',
      });
      this.props.form.resetFields();
    };

    handleCancel = () => {
      this.setState({
        modalVisible: false
      });
    };

    // 提交添加人脸数据的表单
    addFace = (e) => {
      const { addFace } = this.props;
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          addFace(values).then(
            (res) => {
              message.success('新增人脸数据成功');
              this.setState({
                addModalVisible: false
              });
              this.getTableList();
            }
          ).catch((err) => {
            // message.warning('添加账户失败')
          });
        }
      });
    };

    // 编辑人脸数据按钮
    handleEditFace = (item) => {
      console.log('点击编辑时得到原item的数据', item);
      const {
        form: { setFieldsValue }
      } = this.props;
      this.setState({
        modalVisible: true,
        modalStatus: 'edit',
      });
      setFieldsValue({
        name: item.name,
        imageUrl: item.image,
        tag: item.nameList
      });
    };

    // 提交编辑人脸数据的表单
    editFace = (e) => {
      const { editFace } = this.props;
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          editFace(values).then(
            (res) => {
              message.success('编辑人脸数据成功');
              this.setState({
                editModalVisible: false
              });
              this.getTableList();
            }
          ).catch((err) => {
            // message.warning('添加账户失败')
          });
        }
      });
    };

    handleDelFace = (item) => {
      const { id } = item;
      let ids;
      let nameTemp;
      if (this.state.selectedRowKeys.length > 0) {
        ids = this.state.selectedRowKeys;
        nameTemp = '';
      } else {
        ids = [id];
        nameTemp = item.name;
      }
      this.setState({
        delModalVisible: true,
        delIds: ids,
        delName: nameTemp
      });
    };

    handleDelCancel = () => {
      this.setState({
        delModalVisible: false,
      });
    };

    delFace = () => {
      const { delFace } = this.props;
      const data = {
        idList: this.state.delIds
      };
      delFace(data).then((res) => {
        message.success('删除成功');
        this.setState({
          delModelVisible: false
        });
        this.getTableList();
      });
    };

    beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    };

    handleChange = (info) => {
      if (info.file.status === 'uploading') {
        this.setState({ imgaeLoading: true });
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        // getBase64(info.file.originFileObj, imageUrl => this.setState({
        //   imageUrl,
        //   imgaeLoading: false,
        // }),);
      }
    };

    renderTableHeaders = () => {
      const {
        name, selectedRowKeys, total, pageSize, pageNum, loading, faceData
      } = this.state;
      return (
        <div className={styles.listHeader}>
          <div className={styles.query}>
            <Input
              placeholder="请输入姓名"
              onChange={this.queryName}
              value={name}
              onPressEnter={this.getTableList}
              suffix={
                <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
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
                <a>批量导入</a>
              </Link>
            </div>
            <div className={styles.del}>
              {
                selectedRowKeys.length > 0
                  ? (
                    <>
                      <Icon type="delete" className={styles.iconActive} />
                      <a onClick={this.handleDelFace}>批量删除</a>
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
      console.log('>>>>>image', e, e.target);
      const image = e.target;
      image.src = noImg;
      image.style.height = '225px';
      image.style.width = '100%';
      image.onerror = null;
    };

    onChange = (item, e) => {
      console.log('>>>>checkbox选中', item, e);
      const { faceData, selectedRowKeys } = this.state;
      let faceDataTemp = [];
      faceDataTemp = faceData.map((i) => {
        if (i.aid === item.aid) {
          i.checkboxShow = true;
          i.isChecked = e.target.checked;
          return i;
        }
        return i;
      });

      if (e.target.checked) {
        selectedRowKeys.push(item.aid);
      } else if (selectedRowKeys.indexOf(item.aid) > -1) {
        const index = selectedRowKeys.indexOf(item.aid);
        selectedRowKeys.splice(index, 1);
      }

      this.setState({
        selectedRowKeys,
        faceData: faceDataTemp
      });

      console.log('选择的批量删除的ids', this.state.selectedRowKeys);
    };

    handleMouseEnter = (item) => {
      console.log('鼠标移入', item);
      const { faceData } = this.state;
      let faceDataTemp = [];
      faceDataTemp = faceData.map((i) => {
        if (i.aid === item.aid) {
          i.checkboxShow = true;
          return i;
        }
        return i;
      });

      this.setState({
        faceData: faceDataTemp
      });
    };

    handleMouseLeave = (item) => {
      console.log('鼠标移出', item);
      const { faceData } = this.state;
      let faceDataTemp = [];
      faceDataTemp = faceData.map((i) => {
        if (i.aid === item.aid) {
          i.checkboxShow = false;
          return i;
        }
        return i;
      });

      this.setState({
        faceData: faceDataTemp
      });
    };

    onPageChange = (current, pageSize) => {
      this.handleListChange({ current, pageSize }, {}, {});
    };

    onShowSizeChange = (current, pageSize) => {
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
        faceData, modalVisible, textMap, modalStatus, imageLoading, imageUrl, delModalVisible, selectedRowKeys, delName, delIds, total, pageNum, pageSize
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
          <div style={{ marginTop: 8 }}>上传</div>
        </div>
      );
      return (
        <div className={styles.mainContanier}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            dataSource={faceData}
            pagination={false}
            renderItem={item => (
              <List.Item>
                {/* <Card bordered={false}>
                  {
                    item.isChecked ? (
                      <div className={styles.imgContainerChecked} onMouseEnter={() => this.handleMouseEnter(item)}>
                        <img src={item.image} onError={e => this.handleImageError(e)} alt="" />
                        {
                          item.checkboxShow ? <Checkbox className={styles.checkbox} onChange={e => this.onChange(item, e)} /> : ''
                        }
                      </div>
                    ) : (
                      <div className={item.checkboxShow ? styles.imgContainerChecked : styles.imgContainer} onMouseEnter={() => this.handleMouseEnter(item)} onMouseLeave={() => this.handleMouseLeave(item)}>
                        <img src={item.image} onError={e => this.handleImageError(e)} alt="" />
                        {
                          item.checkboxShow ? <Checkbox className={styles.checkbox} onChange={e => this.onChange(item, e)} /> : ''
                        }
                      </div>
                    )
                  }
                  {
                    item.isChecked ? (
                      <div>
                        <div className={styles.whiteBlock} />
                        <div className={styles.btn}>
                          <Icon type="edit" className={styles.iconEdit} onClick={() => this.handleEditFace(item)} />
                          <div className={styles.line} />
                          <Icon type="delete" className={styles.iconDel} onClick={() => this.handleDelFace(item)} />
                        </div>
                      </div>
                    ) : (
                      <div className={styles.footerContanier}>
                        {
                          item.checkboxShow ? (
                            <div>
                              <div className={styles.whiteBlock} />
                              <div className={styles.btn}>
                                <Icon type="edit" className={styles.iconEdit} onClick={() => this.handleEditFace(item)} />
                                <div className={styles.line} />
                                <Icon type="delete" className={styles.iconDel} onClick={() => this.handleDelFace(item)} />
                              </div>
                            </div>
                          ) : (
                            <div className={styles.info}>
                              <div title={item.name} className={styles.name}>{item.name}</div>
                              {
                                item.nameList === 1 ? <div className={styles.tagContainer}><Tag color="green">白名单</Tag></div> : <div className={styles.tagContainer}><Tag color="red">黑名单</Tag></div>
                              }
                            </div>
                          )
                        }
                      </div>
                    )
                  }
                </Card> */}


                <Card bordered={false}>
                  {
                    item.isChecked ? (
                      <div onMouseEnter={() => this.handleMouseEnter(item)} className={styles.cardContanierChecked}>
                        <div className={styles.imgContainerChecked}>
                          <img src={item.image} onError={e => this.handleImageError(e)} alt="" />
                          <Checkbox className={styles.checkbox} onChange={e => this.onChange(item, e)} />
                        </div>
                        <div className={styles.btn}>
                          <Icon type="edit" className={styles.iconEdit} onClick={() => this.handleEditFace(item)} />
                          <div className={styles.line} />
                          <Icon type="delete" className={styles.iconDel} onClick={() => this.handleDelFace(item)} />
                        </div>
                        <div className={styles.footerContanier}>
                          <div className={styles.info}>
                            <div title={item.name} className={styles.name}>{item.name}</div>
                            {
                              item.nameList === 1 ? <div className={styles.tagContainer}><Tag color="green">白名单</Tag></div> : <div className={styles.tagContainer}><Tag color="red">黑名单</Tag></div>
                            }
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div onMouseEnter={() => this.handleMouseEnter(item)} onMouseLeave={() => this.handleMouseLeave(item)} className={styles.cardContanier}>
                        {
                          item.checkboxShow ? (
                            <div>
                              <div className={styles.imgContainerChecked}>
                                <img src={item.image} onError={e => this.handleImageError(e)} alt="" />
                                <Checkbox className={styles.checkbox} onChange={e => this.onChange(item, e)} />
                              </div>
                              <div className={styles.btn}>
                                <Icon type="edit" className={styles.iconEdit} onClick={() => this.handleEditFace(item)} />
                                <div className={styles.line} />
                                <Icon type="delete" className={styles.iconDel} onClick={() => this.handleDelFace(item)} />
                              </div>
                              <div className={styles.footerContanier}>
                                <div className={styles.info}>
                                  <div title={item.name} className={styles.name}>{item.name}</div>
                                  {
                                    item.nameList === 1 ? <div className={styles.tagContainer}><Tag color="green">白名单</Tag></div> : <div className={styles.tagContainer}><Tag color="red">黑名单</Tag></div>
                                  }
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className={styles.imgContainer}>
                                <img src={item.image} onError={e => this.handleImageError(e)} alt="" />
                              </div>
                              <div className={styles.footerContanier}>
                                <div className={styles.info}>
                                  <div title={item.name} className={styles.name}>{item.name}</div>
                                  {
                                    item.nameList === 1 ? <div className={styles.tagContainer}><Tag color="green">白名单</Tag></div> : <div className={styles.tagContainer}><Tag color="red">黑名单</Tag></div>
                                  }
                                </div>
                              </div>

                            </div>
                          )
                        }
                      </div>
                    )
                  }

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
                pageSize={pageSize}
                onChange={this.onPageChange}
                onShowSizeChange={this.onShowSizeChange}
              />
            </div>
          </div>
          <Modal
            title={textMap[modalStatus]}
            visible={modalVisible}
            className={styles.addOrEditModal}
            width="600px"
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" onClick={modalStatus === 'add' ? this.addFace : this.editFace}>
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
                    { pattern: new RegExp(/\S/), message: '姓名不能为空' }
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input placeholder="请输入姓名" />
                )
                }
              </FormItem>
              <FormItem label="上传人脸图像" {...formItemLayout} extra="支持.jpg、.png格式图片">
                {getFieldDecorator('imageUrl', {
                  rules: [
                    { required: true, message: '请上传人脸图像' }
                  ],
                  validateTrigger: 'onBlur',
                  valuePropName: 'fileList'
                })(
                  <Upload
                    name="pic"
                    listType="picture-card"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                )
                }
              </FormItem>
              <FormItem label="标签" {...formItemLayout}>
                {getFieldDecorator('tag', {
                  rules: [
                    { required: true, message: '请选择一个标签' }
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Radio.Group>
                    <Radio value={2}>黑名单</Radio>
                    <Radio value={1}>白名单</Radio>
                  </Radio.Group>
                )
                }
              </FormItem>
            </Form>
          </Modal>

          <Modal
            visible={delModalVisible}
            className={styles.delModal}
            width="400px"
            closable={false}
            footer={[
              <Button key="submit" type="primary" onClick={this.delFace}>
                确定
              </Button>,
              <Button key="back" style={{ margin: '0 0 0 20px' }} onClick={this.handleDelCancel}>
                取消
              </Button>,
            ]}
          >
            <div>
              <Icon type="warning" />
              <div>{`您确定要删除${selectedRowKeys.length > 0 ? `这${delIdsLength}个人脸数据吗？` : `${delName}的人脸数据吗？`}`}</div>
            </div>
          </Modal>
        </div>
      );
    };


    render() {
      return (
        <div className={styles.content}>
          {this.renderTableHeaders()}
          {this.renderTable()}
        </div>
      );
    }
}

// Face.propTypes = {
//   face: PropTypes.object.isRequired
// };

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Face));
