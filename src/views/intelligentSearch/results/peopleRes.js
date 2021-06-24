import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  addFace, editFace, delFace
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
    push, addFace, editFace, delFace
  },
  dispatch
);

class Face extends Component {
    state = {
      loading: false,
      // faceData: [
      // ],
    };

    componentDidMount() {
      // console.log('this.props', this.props);
      // this.initData(this.props?.data);
    }

    componentWillReceiveProps(nextProps) {
      // console.log('nextProps', nextProps);
      // if (nextProps && nextProps.data !== this.props.data) {
      //   this.initData(nextProps.data);
      // }
    }

    // initData = (data) => {
    //   const faceData = data.map(item => ({
    //     distance: item.distance, ...item.picInfo
    //   }));
    //   this.setState({ faceData });
    // }

    handleImageError = (e) => {
      const image = e.target;
      image.src = noImg;
      // image.style.height = '109px';
      // image.style.width = '94px';
      // image.style.marginTop = '58px';
      image.onerror = null;
    };

    showTotal = total => (<span className={styles.totalText}>{`总条数： ${total}`}</span>)

    render() {
      const {
        total, current, pageSize
      } = this.props;
      const { data } = this.props;
      console.log('data', data)
      return (
        <div className={styles.faceContent}>
          <div className={styles.faceList}>
            {
              data?.list?.map(item => (
                <div
                  className={styles.cardContanier}
                >
                  <div className={styles.imgContainer}>
                    <img src={`${urlPrefix}/face/displayexist/${item.photoId}?${new Date().getTime()}`} onError={e => this.handleImageError(e)} alt="" />
                    <div className={styles.faceTip}>
                      {' '}
                      相似度：
                      {parseFloat(item.score * 100).toFixed(2)}
                      %
                    </div>
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
              ))
            }
          </div>
          <div className={styles.paginationWrapper}>
            <Pagination
              // size="small"
              total={total}
              current={current}
              // pageSize={pageSize}
              onChange={this.props.handlePageChange}
              onShowSizeChange={this.props.handlePageChange}
              pageSizeOptions={['10', '20', '30', '40']}
              pageSize={pageSize}
              hideOnSinglePage={false}
              showSizeChanger
              showQuickJumper
              showTotal={this.showTotal}
            />
          </div>
        </div>
      );
    }
}


export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Face));
