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
  searchPlateAlarms
} from 'Redux/reducer/intelligentSearch';
import AlarmCard from 'Views/alarms/alarmCard';
import Pagination from 'Components/EPagination';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    searchPlateAlarms,
  },
  dispatch
);
class CarRes extends Component {
  constructor() {
    super();
    this.state = {
      pageNo: 0,
      pageSize: 12,
      total: 0,
      listLoading: false,
      listData: [],
    };
  }


  componentDidMount() {
    this.getAlarms(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getAlarms(nextProps);
  }

  getAlarms = (props) => {
    const {
      data: { detail }, searchPlateAlarms
    } = props;
    const curPlate = detail && detail[0];
    const { platelicense } = curPlate || {};
    if (!platelicense) {
      return;
    }
    this.setState({
      listLoading: true,
    });
    const {
      pageNo, pageSize
    } = this.state;
    searchPlateAlarms({
      licenseNo: platelicense, pageNo, pageSize // '苏E99G06'
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
    });
  }

  onPageChange = (current, pageSize) => {
    this.setState({
      pageNo: current - 1,
      pageSize,
    }, () => this.getAlarms(this.props));
  }

  showTotal = total => (<span className={styles.totalText}>{`总条数： ${total}`}</span>)

  render() {
    const {
      data: {
        detail, picture
      }
    } = this.props;
    const curPlate = detail && detail[0];
    const {
      platelicense, plate_type, confidence
    } = curPlate || {};
    let color = 'blue';
    switch (plate_type) {
      case '蓝牌':
        color = 'blue';
        break;
      case '黄牌':
        color = 'yellow';
        break;
      case '绿牌':
        color = 'green';
        break;
      case '黑牌':
        color = 'black';
        break;
      case '白牌':
        color = 'white';
        break;
      default:
        break;
    }
    const {
      listData, listLoading, pageSize, pageNo, total
    } = this.state;
    return (
      <div className={styles.carRes}>
        <div className={styles.plateWrapper}>
          <div className={styles.imageWrapper}>
            <img src={picture} alt="图片" />
          </div>
          <div className={styles.textWrapper}>
            <div className={`${styles.plateShow} ${styles[`plateShow-${color}`]}`}>
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
        </div>
        <div className={styles.plateAlarms}>
          <div className={styles.plateAlarmsTitle}>相关告警信息</div>
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
