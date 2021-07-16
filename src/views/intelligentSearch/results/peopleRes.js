import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  message, Button, Modal, Form, Input, Icon, Radio, Upload, List, Spin, Card, Tag, Checkbox,
} from 'antd';
import Pagination from 'Components/EPagination';
import DeleteModal from 'Components/modals/warnModal';
import {
  LoadingOutlined, PlusOutlined, ImportOutlined, SearchOutlined
} from '@ant-design/icons';
import noImg from '@/assets/defaultFace.png';
import { urlPrefix, imageURI } from 'Constants/Dictionary';

import styles from './peopleRes.less';

const FormItem = Form.Item;

const mapStateToProps = state => ({ face: state.face });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
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

    renderLabel = (item) =>{
      if(item.labelCode !== undefined){
        switch (item.labelCode) {
          case 0:
            return <Tag color="green">白名单</Tag>
          case 1:
            return <Tag color="red">黑名单</Tag>
          case 2:
            <Tag color="blue">陌生人</Tag>
          default:
            break;
        }
      }
      else if(item.label !== undefined){
        switch (item.label) {
          case 'WHITE':
            return <Tag color="green">白名单</Tag>
          case 'BLACK':
            return <Tag color="red">黑名单</Tag>
          case 'OTHER':
            return <Tag color="blue">陌生人</Tag>
          default:
            break;
        }
      }
      return null;
    }
    render() {
      const {
        total, current, pageSize
      } = this.props;
      const { data } = this.props;
      return (
        <div className={styles.faceContent}>
          <div className={styles.faceList}>
            {
              data?.list?.map(item => (
                <div
                  className={styles.cardContanier}
                >
                  <div className={styles.imgContainer}>
                    <img src={item.photoId ? `${urlPrefix}/face/displayexist/${item.photoId}?${new Date().getTime()}`:`${imageURI}${item.imageCompress}`} onError={e => this.handleImageError(e)} alt="" />
                    <div className={styles.faceTip}>
                      {parseFloat(item.score * 100).toFixed(2)}
                      %
                    </div>
                  </div>
                  <div className={styles.footerContanier}>
                    <div className={styles.info}>
                      <div title={item.name} className={styles.name}>{item.name || item.username || '-'}</div>
                        <div className={styles.tagContainer}>
                        {this.renderLabel(item)}
                        </div>            
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
              pageSizeOptions={['15', '30', '45']}
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
