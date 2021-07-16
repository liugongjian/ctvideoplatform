/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  Tabs,
  Input,
  Select,
  Spin,
} from 'antd';
import NODATA_IMG from 'Assets/nodata.png';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {
  searchPlateAlarms, searchPlateCaptures
} from 'Redux/reducer/intelligentSearch';
import AlarmCard from 'Views/alarms/alarmCard';
import Pagination from 'Components/EPagination';
import { getPlateColor } from '../utils';
import styles from './carRes.less';

const { Search } = Input;
const { Option } = Select;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    searchPlateAlarms, searchPlateCaptures
  },
  dispatch
);
class CarRes extends Component {
  constructor() {
    super();
    this.state = {
      pageNo: 0,
      pageSize: 12,
      curLicense: undefined,
      total: 0,
      listLoading: false,
      listData: [],
      // searchParam: null,
    };
  }


  componentDidMount() {
    this.getAlarms(this.props);
    // this.setState({ searchParam: this.props.searchParam }, () => this.getAlarms(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.getAlarms(nextProps);
    // this.setState({ searchParam: nextProps.searchParam }, () => this.getAlarms(nextProps));
  }

  getAlarms = (props) => {
    const {
      data: { detail }, searchPlateAlarms, searchPlateCaptures,
      searchParam
    } = props;
    const {
      curLicense
    } = this.state;
    const curPlate = detail && detail[0];
    const { platelicense } = curPlate || {};
    // const getDataProxyFunc = this.state.searchParam.searchType ? searchPlateCaptures : searchPlateAlarms;
    const getDataProxyFunc = searchParam.searchType ? searchPlateCaptures : searchPlateAlarms;
    if (!platelicense) {
      return;
    }
    const nextState = { listLoading: true };
    if (!curLicense) {
      nextState.curLicense = platelicense;
    }

    this.setState(nextState, () => {
      const {
        pageNo, pageSize, curLicense
      } = this.state;
      // const searchParamTemp = searchParam;
      // if (searchParam.searchType) {
      //   delete searchParamTemp.searchType;
      // }
      getDataProxyFunc({
        ...searchParam, licenseNo: curLicense || searchParam.lisenceNo, pageNo, pageSize, // '苏E99G06'
      }).then((res) => {
        const {
          list, pageNo, pageSize, pageTotal, recordsTotal
        } = res;
        this.setState({
          listData: list,
          listLoading: false,
          pageSize,
          pageNo,
          total: recordsTotal,
        });
      }).catch((err) => {
        this.setState({
          listData: [],
          listLoading: false,
        });
        console.log(err);
      });
    });
  }

  onPageChange = (current, pageSize) => {
    this.setState({
      pageNo: current - 1,
      pageSize,
    }, () => this.getAlarms(this.props));
  }

  showTotal = total => (<span className={styles.totalText}>{`总条数： ${total}`}</span>)

  onPlateChoose = (platelicense) => {
    this.setState({
      curLicense: platelicense
    }, () => this.getAlarms(this.props));
  }

  render() {
    const {
      data: {
        detail, picture, plateNum
      },
      searchParam: { searchType }
    } = this.props;
    // const curPlate = detail && detail[0];
    // const {
    //   platelicense, plate_type, confidence
    // } = curPlate || {};
    const {
      listData, listLoading, pageSize, pageNo, total, curLicense
    } = this.state;
    return (
      <div className={styles.carRes}>
        <div className={`${styles.plateWrapper} ${plateNum <= 1 ? styles['plateWrapper-bigImg'] : styles['plateWrapper-smallImg']}`}>
          <div className={`${styles.imageWrapper}`}>
            {picture ? <img src={picture} alt="图片" /> : <img src={NODATA_IMG} alt="" className={`${styles.nopic} `} />}
          </div>
          <div className={`${styles.textWrapper} `}>
            {
              picture ? detail.map(({ platelicense, plate_type, confidence }) => (
                <div className={styles.plateInfo}>
                  <div
                    className={`${styles.plateShow} ${styles[`plateShow-${getPlateColor(plate_type)}`]} ${curLicense === platelicense ? styles['plateShow-selected'] : ''}`}
                    onClick={() => this.onPlateChoose(platelicense)}
                  >
                    {platelicense}
                  </div>
                  <div>
                    车牌号：
                    {platelicense}
                  </div>
                  <div>
                    车牌颜色：
                    {plate_type}
                  </div>
                  <div>
                    置信度：
                    {parseFloat(confidence * 100).toFixed(2)}
                    %
                  </div>
                </div>
              )) : null
            }
          </div>

        </div>
        <div className={styles.plateAlarms}>
          <div className={styles.plateAlarmsTitle}>
            {curLicense}
            {' '}
            {`${searchType ? '抓拍' : '告警'}信息`}
          </div>
          <Spin spinning={listLoading} className={styles['plateAlarms-listSpin']}>
            <div className={styles['plateAlarms-listWrapper']}>
              {
                listData.length > 0 || listLoading
                  ? listData.map(item => (
                    <AlarmCard
                      key={item.id}
                      data={item}
                      // onDelete={this.handleDel}
                      disableOperators
                      widthUtilized
                    />
                  ))
                  : (
                    <div className={styles['plateAlarms-listWrapper-nodata']}>
                      <img src={NODATA_IMG} alt="" />
                    </div>
                  )
              }
            </div>
          </Spin>
          <div className={styles['plateAlarms-paginationWrapper']}>
            <Pagination
              // size="small"
              total={total}
              current={pageNo + 1}
              // pageSize={pageSize}
              defaultPageSize={12}
              onChange={this.onPageChange}
              onShowSizeChange={this.onPageChange}
              pageSizeOptions={['12', '24', '36']}
              pageSize={pageSize}
              hideOnSinglePage={false}
              showSizeChanger
              showQuickJumper
              showTotal={this.showTotal}
            />
          </div>
        </div>
      </div>
    );
  }
}

CarRes.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CarRes);
