import React, { Component } from 'react';
import {
  Table, Input, Modal, Pagination, Button , message ,Tooltip , Icon , Tag , Form , Select , Radio
} from 'antd';
import {Link} from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPlateList } from '@/redux/reducer/plate'

import searchPic from '@/assets/role/search.png'
import warnPic from '@/assets/role/warn.png'

import 'antd/dist/antd.css';
import styles from './index.less';

const { Column } = Table;
const { Search } = Input;


const mapStateToProps = state => ({ plate : state.plate });
const mapDispatchToProps = dispatch => bindActionCreators(
  { getPlateList },
  dispatch
);


class Plate extends Component {
  state = {
    plateListInfo:{
      pageSize:10,
      pageNo:0
    },
    selectedRowKeys : [], // Check here to configure the default column
    searchName:"",
    deleteModalVisible : false,
    isDeleting : false,
    deleteItems : [],
    plateModalVisible : false, 
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys , deleteItems:selectedRowKeys });
  };

  // onDeleteItems = () => {
  //   this.setState({deleteModalVisible:false , isDeleting : false });
  //   this.props.deleteRoles({
  //     roleIdlist : this.state.deleteItems,
  //   }).then((data) => {
  //     this.setState({deleteItems:[] , selectedRowKeys:[]})
  //     if (data) {
  //       message.success('删除成功');
  //     }
  //     this.onPageNumChange(this.state.roleListInfo.pageNo + 1);
  //   }).catch(err => {
  //     message.error('删除失败');
  //     this.setState({deleteModalVisible:false , isDeleting : false});
  //   });
  // };

  // searchRole = () => {
  //   // console.log(this.state.searchName)
  //   this.props.getRoleList({
  //     name : this.state.searchName,
  //     pageNo : 0,
  //     pageSize : this.state.roleListInfo.pageSize
  //   }).then((data)=>{
  //     // console.log(data);
  //     this.setState({roleListInfo : data})
  //   })
  // }

  // onPageNumChange = (pageNo) => {
  //   this.props.getRoleList({
  //     pageNo : pageNo-1,
  //     pageSize : this.state.roleListInfo.pageSize
  //   }).then((data)=>{
  //     this.setState({roleListInfo : data})
  //   })
  // }

  // onPageSizeChange = (current , size) => {
  //   this.props.getRoleList({
  //     pageNo : 0,
  //     pageSize : size
  //   }).then((data)=>{
  //     // console.log(data);
  //     this.setState({roleListInfo : data})
  //   })
  // }

  componentDidMount() {
    this.props.getPlateList({
      pageNo : 0,
      pageSize : 10
    }).then((data)=>{
      console.log('plate data:',data)
      this.setState({plateListInfo:data})
    })
  }

  render() {
    const { selectedRowKeys , plateListInfo } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.searchContainer}>
          <Button type="primary" className={styles.addBtn} onClick={()=>this.setState({plateModalVisible:true})}>+ 新增车牌数据</Button>
          <Link to='/gallery/carLicense/import' className={styles.deleteBtn}>
              <Icon type="export" className={styles.deletePic}/>
              批量导入
          </Link>
          {
            this.state.selectedRowKeys.length > 0 ? (
              <a className={styles.deleteBtn} onClick={()=>this.setState({deleteModalVisible:true})}>
              <Icon type="delete" className={styles.deletePic}/>
              批量删除
              </a>
            ):(
              <a disabled className={styles.deleteBtnDisabled}>
              <Icon type="delete" className={styles.deletePic}/>
              批量删除
              </a>
            )
          }

          <div className={styles.searchInput}>
            <Search placeholder="请输入车牌号" icon={searchPic} onSearch={() => this.searchRole()} onChange={(e) => this.setState({searchName:e.target.value})}/>
          </div>
        </div>
        <Table rowSelection={rowSelection} dataSource={plateListInfo.list} pagination={false} rowKey={(record) => record.id}>
            <Column title="车牌号" dataIndex="licenseNo" width={'27%'} className="tabble-row"/>
            <Column title="布控标签" dataIndex="label" width={'31%'}
                  render={(text, record) => (
                    <div>
                      {
                        text==="WHITE" ? (<Tag color="green">白名单</Tag>) : (<Tag color="red">黑名单</Tag>)
                      }          
                    </div>
                  )}
            />
            <Column title="车牌颜色" dataIndex="color" width={'33%'}/>
            <Column
                title="操作"
                key="action"
                width={'14%'}
                render={(text, record) => (
                  <div className={styles.oprationWrapper}>
                    <Link to={`/system/role/edit/${record.id}`}>
                      编辑
                    </Link>
                    <span className={styles.separator}> | </span>
                    <span onClick={() => this.setState({deleteModalVisible:true,deleteItems:[record.id]})}><a>删除</a></span>
                  </div>
                )}
              />
        </Table>
        <div className={styles.paginationWrapper}>
          <span>总条数: {plateListInfo.recordsTotal}</span>
          <div>
            <Pagination
              total={plateListInfo.recordsTotal}
              onChange={(pageNo) => this.onPageNumChange(pageNo)}
              current={plateListInfo.pageNo+1}
              showSizeChanger
              showQuickJumper
              pageSize={this.state.plateListInfo.pageSize}
              onShowSizeChange={(current,size) => this.onPageSizeChange(current , size)}
            />
          </div>
        </div>


        <Modal
        className={styles.LicenseImport}
        title="新增车牌数据"
        visible={this.state.plateModalVisible}
        width="500px"
        >
        <div className={styles['LicenseImport-formWrapper']}>
          <Form>
            <Form.Item label="车牌号" style={{ marginBottom: 0 }} className={styles.addItemRequiredIcon}>
              <Form.Item className={styles.licenseSel}>
                {getFieldDecorator('licenseProvince', {
                  rules: [
                    {
                      validator: (rule, val, callback) => {
                        if (!val || !form.getFieldValue('licenseNo')) {
                          callback('请补充车牌号！');
                        }
                        callback();
                      }
                    }
                  ],
                })(
                  <Select
                    onSelect={() => { form.validateFields(['licenseNo']); }}
                    placeholder="-"
                  >
                    <Select.Option value="浙">浙</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <span className={styles.licenseSplit}>&nbsp;</span>
              <Form.Item className={styles.licenseInput}>
                {getFieldDecorator('licenseNo', {
                  rules: [
                    {
                      required: true,
                      message: ' ',
                    },
                    {
                      validator: (rule, val, callback) => {
                        form.validateFields(['licenseProvince']);
                        if (!val || !form.getFieldValue('licenseProvince')) {
                          callback(' ');
                        }
                        callback();
                      }
                    }
                  ],
                })(<Input
                  placeholder="请输入车牌号"
                />)}
              </Form.Item>
            </Form.Item>
            <Form.Item label="布控标签">
              {getFieldDecorator('label', {
                rules: [
                  {
                    required: true,
                    message: '请选择布控标签!',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value={1}>白名单</Radio>
                  <Radio value={2}>黑名单</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="车牌颜色">
              {getFieldDecorator('color', {
                rules: [
                  {
                    required: true,
                    message: '请选择车牌颜色!',
                  },
                ],
              })(
                <Select>
                  <Select.Option value="蓝色">蓝色</Select.Option>
                  <Select.Option value="绿色">绿色</Select.Option>
                  <Select.Option value="黄色">黄色</Select.Option>
                  <Select.Option value="白色">白色</Select.Option>
                  <Select.Option value="黑色">黑色</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </div>
      </Modal>


        
        <Modal
          centered
          width={412}
          visible={this.state.deleteModalVisible}
          onCancel={() => this.setState({deleteModalVisible:false})}
          footer={[    
            <Button key="submit" type="primary" disabled={this.state.isDeleting} onClick={() => this.onDeleteItems()} style={{margin:'0 0 0 5px'}}>
            确定
           </Button>,        
            <Button key="back" style={{margin:'0 0 0 30px'}} disabled={this.state.isDeleting} onClick={() => {this.setState({deleteModalVisible:false,deleteItems:[]})}}>
              取消
            </Button>,
          ]}
        >
          <div className={styles.deleteModal}>
            <div className={styles.deleteModalImg}>
              <img src={warnPic}/>
            </div>
            <div className={styles.deleteModalInfo}>
              <span>你确定要删除所选的{this.state.deleteItems.length}个角色吗？</span>
              <p>此操作将删除选中角色</p>
              <p>如果删除的角色，已有账号关联，则无法被删除！</p>
            </div>
          </div>
        </Modal>

        

      </div>
    );
  }
}

Plate.propTypes = {
  // plate: PropTypes.object.isRequired
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Plate));
