import React, { Component } from 'react';
import {
  Table, Input, Modal, Button, message, Tooltip, Icon
} from 'antd';
import Pagination from 'Components/EPagination';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getRoleList, deleteRoles } from '@/redux/reducer/role';

import deletePic from '@/assets/role/delete.png';
import deletePic2 from '@/assets/role/delete2.png';
import searchPic from '@/assets/role/search.png';
import warnPic from '@/assets/role/warn.png';

import 'antd/dist/antd.css';
import styles from './index.less';

const { Column } = Table;
const { Search } = Input;


const mapStateToProps = state => ({ role: state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  { getRoleList, deleteRoles },
  dispatch
);


class Role extends Component {
  state = {
    roleListInfo: {
      pageSize: 10,
      pageNo: 0
    },
    selectedRowKeys: [], // Check here to configure the default column
    searchName: '',
    deleteModalVisible: false,
    isDeleting: false,
    deleteItems: []
  };

  componentDidMount() {
    this.props.getRoleList({
      pageNo: 0,
      pageSize: 10
    }).then((data) => {
      this.setState({ roleListInfo: data });
    });
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys, deleteItems: selectedRowKeys });
  };

  onDeleteItems = () => {
    this.setState({ deleteModalVisible: false, isDeleting: false });
    this.props.deleteRoles({
      roleIdlist: this.state.deleteItems,
    }).then((data) => {
      this.setState({ deleteItems: [], selectedRowKeys: [] });
      if (data) {
        message.success('删除成功');
      }
      this.onPageNumChange(this.state.roleListInfo.pageNo + 1);
    }).catch((err) => {
      message.error('删除失败');
      this.setState({ deleteModalVisible: false, isDeleting: false });
    });
  };

  searchRole = () => {
    // console.log(this.state.searchName)
    this.props.getRoleList({
      name: this.state.searchName,
      pageNo: 0,
      pageSize: this.state.roleListInfo.pageSize
    }).then((data) => {
      // console.log(data);
      this.setState({ roleListInfo: data });
    });
  }

  onPageNumChange = (pageNo) => {
    this.props.getRoleList({
      pageNo: pageNo - 1,
      pageSize: this.state.roleListInfo.pageSize
    }).then((data) => {
      this.setState({ roleListInfo: data, deleteItems: [], selectedRowKeys: [] });
    });
  }

  onPageSizeChange = (current, size) => {
    this.props.getRoleList({
      pageNo: 0,
      pageSize: size
    }).then((data) => {
      // console.log(data);
      this.setState({ roleListInfo: data, deleteItems: [], selectedRowKeys: [] });
    });
  }


  render() {
    const { selectedRowKeys, roleListInfo } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.searchContainer}>
          <Link to="/system/role/add"><Button type="primary" className={styles.addBtn}>+ 新增角色</Button></Link>
          {
            this.state.selectedRowKeys.length > 0 ? (
              <a className={styles.deleteBtn} onClick={() => this.setState({ deleteModalVisible: true })}>
                <Icon type="delete" className={styles.deletePic} />
                批量删除
              </a>
            ) : (
              <a disabled className={styles.deleteBtnDisabled}>
                <Icon type="delete" className={styles.deletePic} />
                批量删除
              </a>
            )
          }

          <div className={styles.searchInput}>
            <Search placeholder="请输入角色名称" icon={searchPic} onSearch={() => this.searchRole()} onChange={e => this.setState({ searchName: e.target.value })} />
          </div>
        </div>
        <Table rowSelection={rowSelection} dataSource={roleListInfo.list} pagination={false} rowKey={record => record.id}>
          <Column
            title="角色名称"
            dataIndex="name"
            width="20%"
            className="tabble-row"
            render={
              (text, record) => (
                <div>
                  { text.length > 10
                    ? (
                      <Tooltip title={text}>
                        {' '}
                        {`${text.substring(0, 10)}...`}
                        {' '}
                      </Tooltip>
                    )
                    : text }
                </div>
              )
            }
          />
          <Column title="创建时间" dataIndex="createTime" width="20%" />
          <Column title="修改时间" dataIndex="updateTime" width="22%" />
          <Column
            title="角色描述"
            dataIndex="description"
            width="22%"
            render={
              (text, record) => (
                <div>
                  { text.length > 10
                    ? (
                      <Tooltip title={text}>
                        {' '}
                        {`${text.substring(0, 10)}...`}
                        {' '}
                      </Tooltip>
                    )
                    : text }
                </div>
              )
            }
          />
          <Column
            title="操作"
            key="action"
            width="14%"
            render={(text, record) => (
              <div className={styles.oprationWrapper}>
                <Link to={`/system/role/edit/${record.id}`}>
                  编辑
                </Link>
                <span className={styles.separator}> | </span>
                <span onClick={() => this.setState({ deleteModalVisible: true, deleteItems: [record.id] })}><a>删除</a></span>
              </div>
            )}
          />
        </Table>
        <div className={styles.paginationWrapper}>
          <span>
            总条数:
            {' '}
            {roleListInfo.recordsTotal}
          </span>
          <div>
            <Pagination
              total={roleListInfo.recordsTotal}
              onChange={pageNo => this.onPageNumChange(pageNo)}
              current={roleListInfo.pageNo + 1}
              showSizeChanger
              showQuickJumper
              hideOnSinglePage={false}
              pageSize={this.state.roleListInfo.pageSize}
              showTotal={false}
              onShowSizeChange={(current, size) => this.onPageSizeChange(current, size)}
            />
          </div>
        </div>

        <Modal
          centered
          width={412}
          visible={this.state.deleteModalVisible}
          onCancel={() => this.setState({ deleteModalVisible: false })}
          footer={[
            <Button key="submit" type="primary" disabled={this.state.isDeleting} onClick={() => this.onDeleteItems()} style={{ margin: '0 0 0 5px' }}>
              确定
            </Button>,
            <Button key="back" style={{ margin: '0 0 0 30px' }} disabled={this.state.isDeleting} onClick={() => { this.setState({ deleteModalVisible: false, deleteItems: [], selectedRowKeys: [] }); }}>
              取消
            </Button>,
          ]}
        >
          <div className={styles.deleteModal}>
            <div className={styles.deleteModalImg}>
              <img alt="" src={warnPic} />
            </div>
            <div className={styles.deleteModalInfo}>
              <span>
                你确定要删除所选的
                {this.state.deleteItems.length}
                个角色吗？
              </span>
              <p>此操作将删除选中角色</p>
              <p>如果删除的角色，已有账号关联，则无法被删除！</p>
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
