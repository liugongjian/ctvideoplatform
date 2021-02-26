import React, { Component } from 'react';
import {
  Table, Upload , Icon , Button , Pagination , Tag
} from 'antd';
import {Link} from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';
import styles from './index.less';
const { Column } = Table;
const { Dragger } = Upload;

const mapStateToProps = state => ({ role : state.role });
const mapDispatchToProps = dispatch => bindActionCreators(
  { },
  dispatch
);


class AddPlate extends Component {
  state = {
    list:[
      {
        id:1,
        name:'aa',
        createTime:'aa',
        updateTime:'bb'
      },
      {
        id:2,
        name:'aa',
        createTime:'aa',
        updateTime:'bb'
      }
    ]
  };
  componentDidMount() {
  }

  render() {
    const { list } = this.state;
    const uploader = ()=>(         
          <div className={styles.uploadWrapper}>
            <Dragger>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p className="ant-upload-hint">
                  支持的格式：仅支持csv、xlsx、xls格式文件
                </p>
              </Dragger>
              <div className={styles.buttonWrapper}>
                <Button key="submit" type="primary" className={styles.btnNext}>
                  下一步
                </Button>
                <Button key="submit"className={styles.btnBack}>
                  返回
                </Button>
              </div>
          </div>
     );
    
    const confirmer = ()=>(
      <div>
          <Table dataSource={list} pagination={false} rowKey={(record) => record.id}>
          <Column title="车牌号" dataIndex="name" width={'14%'} className="tabble-row" align="center"/>
          <Column title="布控标签" dataIndex="createTime" width={'60%'} align="center"
                render={(text, record) => (
                  <div>
                      <Tag color="green">{text.substring(0,4)}</Tag>
                  </div>
                )}
          />
          <Column title="车牌颜色" dataIndex="updateTime" width={'26%'} align="center"/>
        </Table>
        <div className={styles.paginationWrapper}>
          <span>总条数: {2}</span>
          <div>
            <Pagination
              total={10}
              onChange={(pageNo) => this.onPageNumChange(pageNo)}
              current={1}
              showSizeChanger
              showQuickJumper
              pageSize={10}
              onShowSizeChange={(current,size) => this.onPageSizeChange(current , size)}
            />
          </div>
        </div>
          <div style={{'text-align':'center'}}>
            <Button type="primary" style={{margin:'20px 0 0 100px'}}>提交</Button>
          </div>
        </div>
    )
    return (
      <div className={styles.mainWrapper}>
        {confirmer()}
      </div>
    );
  }
}

// AddPlate.propTypes = {
//   plate: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(AddPlate);
