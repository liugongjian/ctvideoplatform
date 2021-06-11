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
      image.style.height = '109px';
      image.style.width = '94px';
      image.style.marginTop = '58px';
      image.onerror = null;
    };

    render() {
      const {
        loading,
      } = this.state;
      const { data } = this.props;
      let faceData = [];
      if (data && data.map) {
        faceData = data.map(item => ({
          distance: item.distance, ...item.picInfo
        }));
      }
      return (
        <div className={styles.faceContent}>
          <Spin spinning={loading}>
            <div className={styles.faceList}>
              {
                faceData.map(item => (
                  <div
                    className={styles.cardContanier}
                  >
                    <div className={styles.imgContainer}>
                      { !loading ? <img src={`${urlPrefix}/face/displayexist/${item.photoId}?${new Date().getTime()}`} onError={e => this.handleImageError(e)} alt="" /> : ''}
                      <div className={styles.faceTip}>
                        {' '}
                        相似度：
                        {parseFloat(item.distance * 100).toFixed(2)}
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
          </Spin>
        </div>
      );
    }
}


export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Face));
