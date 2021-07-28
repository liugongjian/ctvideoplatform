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
import moment from 'moment';
import { Fragment } from 'react';
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
        let {
          list
        } = res;
        const {
          pageNo, pageSize, pageTotal, recordsTotal
        } = res;
        if (searchParam.searchType) {
          list = list.map(item => ({
            ...item,
            plate: {
              label: item.label,
              licenseNo: item.licenseNo,
            },
            resTime: moment(moment.utc(item.createTime).toDate()).format('YYYY-MM-DD hh:mm:ss')
          }));
        }
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

  renderPlateOption = () => {
    const {
      data: {
        detail, picture, plateNum
      },
    } = this.props;
    const {
      curLicense
    } = this.state;
    return picture
      ? (
        <div className={`${styles.plateWrapper} ${plateNum <= 1 ? styles['plateWrapper-bigImg'] : styles['plateWrapper-smallImg']} ${styles.scrollbar}`}>
          <div className={`${styles.imageWrapper}`}>
            <img src={picture} alt="图片" />
          </div>
          <div className={`${styles.textWrapper}`}>
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
      ) : null;
  }

  renderPlateDetail = () => {
    const {
      data: {
        picture
      },
      searchParam: { searchType }
    } = this.props;
    const {
      listData, listLoading, pageSize, pageNo, total, curLicense
    } = this.state;
    return (
      <div className={`${styles.plateAlarms} ${picture ? '' : styles['plateAlarms-long']}`}>
        <div className={styles.plateAlarmsTitle}>
          {curLicense}
          {' '}
          {`${searchType ? '抓拍' : '告警'}信息`}
        </div>
        <Spin spinning={listLoading} className={`${styles['plateAlarms-listSpin']} ${styles.scrollbar}`}>
          <div className={`${styles['plateAlarms-listWrapper']} ${picture ? '' : styles['plateAlarms-listWrapper-long']}`}>
            {
              listData.length > 0 || listLoading
                ? listData.map(item => (
                  <AlarmCard
                    key={item.id}
                    data={item}
                    // onDelete={this.handleDel}
                    disableOperators
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
    );
  }

  renderNoData = () => (
    <div className={styles.nodataWrapper}>
      <img src={NODATA_IMG} alt="" />
    </div>
  )

  renderResult = () => {
    const { listData } = this.state;
    const {
      data: {
        picture
      }
    } = this.props;
    if (listData.length === 0 && !picture) {
      return this.renderNoData();
    }
    return (
      <Fragment>
        { this.renderPlateOption() }
        { this.renderPlateDetail() }
      </Fragment>
    );
  }

  render() {
    const { listData } = this.state;
    return (
      <div className={styles.carRes}>
        {
          this.renderResult()
        }
      </div>
    );
  }
}

CarRes.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CarRes);
