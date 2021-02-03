import React, { Component } from 'react';
import {
  Table, Input, Modal, Pagination, Button
} from 'antd';
import {Link} from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getRoleList } from '@/redux/reducer/role'

import deletePic from '@/assets/role/delete.png'
import searchPic from '@/assets/role/search.png'
import warnPic from '@/assets/role/warn.png'

import styles from './index.less';

const { Column } = Table;
const { Search } = Input;


const mapStateToProps = state => ({ role : state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  { getRoleList },
  dispatch
);


class Role extends Component {
  state = {
    roleListInfo:{},
    selectedRowKeys : [], // Check here to configure the default column
    searchName:"",
    deleteModalVisible : false,
    recordNumTodelete:null,
    deleteItems:[]
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onDeleteOneItem = (record) => {
    this.setState({deleteModalVisible:true,recordNumTodelete:1,deleteItems:[{...record}]});
  };

  searchRole = () => {
    // console.log(this.state.searchName)
    this.props.getRoleList({
      name : this.state.searchName,
      pageNo : 0,
      pageSize : this.state.roleListInfo.pageSize
    }).then((data)=>{
      console.log(data);
      this.setState({roleListInfo : data})
    })
  }

  handleDeleteItems = () => {

  }

  onPageNumChange = (pageNo) => {
    this.props.getRoleList({
      pageNo : pageNo-1,
      pageSize : this.state.roleListInfo.pageSize
    }).then((data)=>{
      this.setState({roleListInfo : data})
    })
  }

  onPageSizeChange = (current , size) => {
    this.props.getRoleList({
      pageNo : 0,
      pageSize : size
    }).then((data)=>{
      console.log(data);
      this.setState({roleListInfo : data})
    })
  }

  componentDidMount() {
    this.props.getRoleList({
      pageNo : 0,
      pageSize : 2
    }).then((data)=>{
      this.setState({roleListInfo : data})
    })
  }

  render() {
    const { selectedRowKeys , roleListInfo } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <div className={styles.searchContainer}>
          <Link to={'/system/role/add'}><Button type="primary" className={styles.addBtn}>+ 新增角色</Button></Link>
          <a className={styles.deleteBtn} onClick={()=>this.setState({deleteModalVisible:true})}>
            <img src={deletePic}className={styles.deletePic}/>
            批量删除
          </a>
          <div className={styles.searchInput}>
            <Search placeholder="请输入角色名称" icon={searchPic} onSearch={() => this.searchRole()} onChange={(e) => this.setState({searchName:e.target.value})}/>
          </div>
        </div>
        <Table rowSelection={rowSelection} dataSource={roleListInfo.list} pagination={false}>
            <Column title="角色名称" dataIndex="name" key="name" />
            <Column title="创建时间" dataIndex="createTime" key="createTime" />
            <Column title="修改时间" dataIndex="updateTime" key="updateTime" />
            <Column title="角色描述" dataIndex="description" key="description" />
            <Column
                title="操作"
                key="action"
                render={(text, record) => (
                  <div className={styles.oprationWrapper}>
                    <Link to={`/system/role/edit/${record.id}`}>
                      编辑
                    </Link>
                    <span className={styles.separator}> | </span>
                    <span onClick={() => this.onDeleteOneItem([record.id])}><a>删除</a></span>
                  </div>
                )}
              />
        </Table>
        <div className={styles.paginationWrapper}>
          <span>总条数: {roleListInfo.recordsTotal}</span>
          <div>
            <Pagination
              total={roleListInfo.recordsTotal}
              onChange={(pageNo) => this.onPageNumChange(pageNo)}
              current={roleListInfo.pageNo+1}
              showSizeChanger
              showQuickJumper
              defaultPageSize={2}
              pageSizeOptions={[2,3,6,20]}
              onShowSizeChange={(current,size) => this.onPageSizeChange(current , size)}
            />
          </div>
        </div>
        
        <Modal
          centered
          visible={this.state.deleteModalVisible}
          // onOk={() => this.setState({deleteModalVisible:false})}
          // onCancel={() => this.setState({deleteModalVisible:false})}
          footer={[    
            <Button key="submit" type="primary" onClick={() => this.deleteConfirm()} style={{float:'left',margin:'0 0 0 150px'}}>
            确定
           </Button>,        
            <Button key="back" style={{margin:'0 150px 0 0'}} onClick={() => {this.setState({deleteModalVisible:false,recordNumTodelete:null,deleteItems:[]})}}>
              取消
            </Button>,

          ]}
        >
          <div className={styles.deleteModal}>
            <div className={styles.deleteModalImg}>
              <img src={warnPic}/>
            </div>
            <div className={styles.deleteModalInfo}>
              <span>你确定要删除所选的{this.state.recordNumTodelete}个角色吗？</span>
              <p>此操作将删除选中角色</p>
              <p>角色删除后，使用删除角色的账号将无法登录系统</p>
            </div>
          </div>
        </Modal>

        

      </div>
    );
  }
}

Role.propTypes = {
  role: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Role);
