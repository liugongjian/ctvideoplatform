import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import * as moment from 'moment';
import Icon from 'Components/Icon';
import styles from './EDatepicker.less';

const { RangePicker } = DatePicker;

const changeColor = (props) => {
  const { wrap, icon, color } = props;
  wrap.querySelector('.ant-calendar-input-wrap').style.cssText = `border:1px solid ${color}`;
  icon.style.cssText = `color:${color}`;
};
const hoverColor = (wrap, icon) => () => changeColor({ wrap, icon, color: '#999' });
const outColor = (wrap, icon) => () => changeColor({ wrap, icon, color: '#D8D8D8' });
const focusColor = (wrap, icon) => () => changeColor({ wrap, icon, color: '#2A89E0' });

class EDatepicker extends Component {
    state={
      startval: '',
      endval: '',
      showVal: [],
      isopen: false
    }

    componentDidMount() {
      const { defaultTime: [start, end] } = this.props;
      const startval = moment(start);
      const endval = moment(end);
      this.setState({
        startval: startval.format('YYYY-MM-DD'),
        endval: endval.format('YYYY-MM-DD'),
        showVal: [
          startval,
          endval
        ]
      });
    }

    componentWillReceiveProps(nextProps) {
      const { defaultTime: [start, end] } = this.props;
      const { defaultTime: [startNext, endNext] } = nextProps;
      if ((start !== startNext) || (end !== endNext)) {
        const startval = moment(startNext);
        const endval = moment(endNext);
        this.setState({
          startval: startval.format('YYYY-MM-DD'),
          endval: endval.format('YYYY-MM-DD'),
          showVal: [
            startval,
            endval
          ]
        });
      }
    }

    componentWillUnmount() {
      const wrap = document.querySelector('.datepicker');
      // 某些弹窗关闭后datepicker为null
      if (wrap) {
        const rightBox = wrap.querySelector('.ant-calendar-range-right');
        const leftBox = wrap.querySelector('.ant-calendar-range-left');
        const icon = wrap.querySelector('.anticon-calendar');
        const leftInput = leftBox.querySelector('.ant-calendar-input');
        const rightInput = rightBox.querySelector('.ant-calendar-input');
        const datepickerTo = wrap.querySelector('.datepickerTo');
        datepickerTo.removeEventListener('mouseenter', hoverColor);
        datepickerTo.removeEventListener('mouseleave', outColor);
        rightInput.removeEventListener('mouseenter', hoverColor);
        rightInput.removeEventListener('mouseleave', outColor);
        leftInput.removeEventListener('mouseenter', hoverColor);
        leftInput.removeEventListener('mouseleave', outColor);
        rightInput.removeEventListener('focus', focusColor);
        rightInput.removeEventListener('blur', outColor);
        leftInput.removeEventListener('focus', focusColor);
        leftInput.removeEventListener('blur', outColor);
      }
    }

    // 今天之前不可选
    disabledDate = current => (current && current < moment().subtract(1, 'days'))

    // 今天和今天之前不可选
    // 设置默认值为今天起，昨天就可选，所以设置今天不可选，然后设置今天默认
    disabledDateToday = current => (current && current < moment().endOf('day'))

    changeStartValue = (e) => {
      const eValue = e.target.value;
      this.setState({
        startval: eValue
      }, () => {
        if (eValue.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/) && !Number.isNaN(new Date(eValue).getTime())) {
          const { showVal } = this.state;
          showVal[0] = moment(eValue);
          this.setState({
            showVal
          });
        }
      });
    }

    changeEndValue = (e) => {
      const eValue = e.target.value;
      this.setState({
        endval: eValue
      }, () => {
        if (eValue.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/) && !Number.isNaN(new Date(eValue).getTime())) {
          const { showVal } = this.state;
          showVal[1] = moment(eValue);
          this.setState({
            showVal
          });
        }
      });
    }

    onChange = (value, dateString) => {
      const [startval, endval] = dateString;
      this.setState({
        startval,
        endval,
        showVal: value
      });
    }

    closePicker=() => {
      const { getDate, clsname } = this.props;
      const { startval, endval } = this.state;
      const dateValue = [`${startval} 00:00:00`, `${endval} 23:59:59`];
      const backDate = [moment(dateValue[0]), moment(dateValue[1])];

      this.setState({
        isopen: false
      }, () => {
        getDate(backDate, dateValue);
        document.querySelector(`.${clsname}`).style.cssText = 'opacity: 1;';
      });
    }


    onFocus = () => {
      const { clsname } = this.props;
      this.setState({
        isopen: true
      }, () => {
        if (document.querySelector('.datepicker')) {
          const wrap = document.querySelector('.datepicker');
          const rightBox = wrap.querySelector('.ant-calendar-range-right');
          const leftBox = wrap.querySelector('.ant-calendar-range-left');
          const icon = wrap.querySelector('.anticon-calendar');
          const leftInput = leftBox.querySelector('.ant-calendar-input');
          const rightInput = rightBox.querySelector('.ant-calendar-input');
          const datepickerTo = wrap.querySelector('.datepickerTo');
          const domInput = document.querySelector(`.${clsname}`);
          domInput.style.cssText = 'opacity: 0;';
          rightInput.addEventListener('mouseenter', hoverColor(leftBox, icon));
          datepickerTo.addEventListener('mouseenter', hoverColor(leftBox, icon));
          rightInput.addEventListener('mouseleave', outColor(leftBox, icon));
          datepickerTo.addEventListener('mouseleave', outColor(leftBox, icon));
          leftInput.addEventListener('mouseenter', hoverColor(leftBox, icon));
          leftInput.addEventListener('mouseleave', outColor(leftBox, icon));
          rightInput.addEventListener('focus', focusColor(leftBox, icon));
          rightInput.addEventListener('blur', outColor(leftBox, icon));
          leftInput.addEventListener('focus', focusColor(leftBox, icon));
          leftInput.addEventListener('blur', outColor(leftBox, icon));
        }
      });
    }

    render() {
      const {
        startval, endval, showVal, isopen
      } = this.state;
      const { clsname } = this.props;
      const drawFooter = () => (
        <div className={`${styles['EMR-datepicker-footer']} EDatepicker`}>
          <div className={styles['EMR-datepicker-box']}>
            <input className={styles['EMR-datepicker-input']} value={startval} type="text" onChange={e => this.changeStartValue(e)} />
            <span className={styles['EMR-datepicker-line']}>-</span>
            <input className={styles['EMR-datepicker-input']} value={endval} type="text" onChange={e => this.changeEndValue(e)} />
          </div>
          <div className={styles['EMR-datepicker-button']}>
            <span className={styles['EMR-datepicker-ok']} onClick={this.closePicker}>OK</span>
            <span className={styles['EMR-datepicker-cancel']} onClick={this.closePicker}>Cancel</span>
          </div>
          <span className={`${styles['EMR-datepicker-to']} datepickerTo `}>to</span>
          <Icon type={`${styles['EMR-datepicker-icon']} anticon-calendar`} />
          <div className={styles['EMR-datepicker-nothing']} />
        </div>
      );
      return (
        <div>
          <RangePicker
            ref={(node) => { this.picker = node; }}
            dropdownClassName={`datepicker ${styles['EMR-datepicker']}`}
            // disabledDate={this.disabledDateToday}
            value={showVal}
            onChange={this.onChange}
            renderExtraFooter={drawFooter}
            allowClear={false}
            onFocus={this.onFocus}
            className={clsname}
            onBlur={(e) => {
              e.persist();
              const domInput = document.querySelector(`.${clsname}`);
              if (e.target.classList.contains('ant-calendar-picker')) {
                domInput.style.cssText = 'opacity: 1;';
                this.setState({
                  isopen: false
                });
              }
            }}

            open={isopen}
          />
        </div>
      );
    }
}

EDatepicker.propTypes = {
  defaultTime: PropTypes.arrayOf(PropTypes.number),
  getDate: PropTypes.func,
  clsname: PropTypes.string
};

EDatepicker.defaultProps = {
  defaultTime: [Date.now(), Date.now() + 7 * 86400 * 1000],
  getDate: () => console.log('test Date'),
  clsname: 'ant-calendar-picker'
};

export default EDatepicker;
