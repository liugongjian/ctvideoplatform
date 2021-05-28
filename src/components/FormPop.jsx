import React, { Component } from 'react';
import { Popover, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './FormPop.less';

class FormPop extends Component {
    state = {
      ifPop: false,
      firstValue: '',
      secondValue: '',
      passwordHasValidate: false,
      wrongShow: false
    }

    popover = () => {
      const { firstValue, passwordHasValidate } = this.state;
      const hasValidate = firstValue === '' && !passwordHasValidate;
      const { tips } = this.validateType();
      const {
        successColor, successIcon, failureColor, failureIcon
      } = this.props;
      const iconData = {
        success: {
          type: successIcon,
          color: successColor
        },
        failure: {
          type: failureIcon,
          color: failureColor
        }
      };

      function iconRender(status) {
        let icon = '';
        // 不传validate时 status为空 不展示Icon
        icon = status ? <Icon type={iconData[status].type} style={{ color: iconData[status].color, fontSize: '14px' }} /> : '';
        return icon;
      }

      function textRender(tip) {
        const { status, message } = tip;
        if (!hasValidate) {
          if (status) {
            return <span style={{ color: iconData[status].color }}>{message}</span>;
          }
          return <span>{message}</span>;
        }
        return <span>{message}</span>;
      }

      return (
        <ul className={styles['EMR-formpop-ul']}>
          {
            tips.map(tip => (
              <li key={tip.message}>
                {!hasValidate && iconRender(tip.status)}
                {textRender(tip)}
              </li>
            ))
          }
        </ul>
      );
    }

    // 根据传入的validate来验证input内容并输出传入的message
    validateType=() => {
      const { firstValue } = this.state;
      const { tips = [] } = this.props;
      let isValid = true;
      tips.map((tip) => {
        const item = tip;
        if (item.validate) {
          item.status = item.validate.test(firstValue) ? 'success' : 'failure';
        } else {
          item.status = '';
        }
        if (item.status === 'failure') {
          isValid = false;
        }
        return item;
      });
      return { isValid, tips };
    }

    sureBtn=() => {
      const { callback } = this.props;
      const { tips } = this.validateType();
      const { firstValue, secondValue } = this.state;
      tips.every((item) => {
        if (item.status === 'failure') {
          this.password.focus();
          return false;
        } if (secondValue !== firstValue) {
          this.setState({
            wrongShow: true
          }, () => {
            this.confirm.focus();
          });
          return false;
        }
        return item;
      });
      return callback && callback(firstValue, tips);
    }

    render() {
      const {
        type, hasSure, text, btnText, position
      } = this.props;
      const {
        wrongShow,
        firstValue,
        secondValue,
        ifPop
      } = this.state;
      return (
        <div className={styles['EMR-formpop']}>
          <label htmlFor="password2" className={styles['EMR-formpop-label']}>
            <span>设置密码:</span>
            <Popover content={this.popover()} placement={position} trigger="focus" visible={ifPop}>
              <input
                id="password2"
                className={styles['EMR-formpop-input']}
                type={type}
                ref={(input) => { this.password = input; }}
                onFocus={() => { this.setState({ ifPop: true }); }}
                onBlur={() => { this.setState({ ifPop: false }); }}
                autoComplete="off"
                value={firstValue}
                placeholder={text}
                onChange={(e) => {
                  this.setState({ firstValue: e.target.value, wrongShow: false });
                }
                }
              />
            </Popover>
          </label>
          {
            type === 'password' && hasSure
              ? (
                <label htmlFor="confirm2" className={styles['EMR-formpop-label']}>
                  <span>重复密码:</span>
                  <input
                    id="confirm2"
                    className={wrongShow ? `${styles['EMR-formpop-input']} ${styles['EMR-formpop-input-wrong']}` : styles['EMR-formpop-input']}
                    type={type}
                    value={secondValue}
                    placeholder="请重复输入一次密码"
                    autoComplete="off"
                    ref={(input) => { this.confirm = input; }}
                    onChange={(e) => {
                      this.setState({ secondValue: e.target.value, wrongShow: false });
                    }
                    }
                  />
                  {
                    wrongShow ? (
                      <div className={styles['EMR-formpop-wrong']}>
                        <Icon type="exclamation-circle" theme="filled" />
                        两次输入不一致
                      </div>
                    ) : null
                  }
                </label>
              ) : null
          }
          <Button type="primary" onClick={this.sureBtn}>{btnText}</Button>
        </div>
      );
    }
}


FormPop.propTypes = {
  tips: PropTypes.arrayOf(PropTypes.shape({ a: PropTypes.array })).isRequired,
  callback: PropTypes.func,
  successColor: PropTypes.string,
  successIcon: PropTypes.string,
  failureColor: PropTypes.string,
  failureIcon: PropTypes.string,
  type: PropTypes.string,
  hasSure: PropTypes.bool,
  text: PropTypes.string,
  btnText: PropTypes.string,
  position: PropTypes.string,
};

FormPop.defaultProps = {
  callback: null,
  successColor: '#52c41a',
  successIcon: 'check-circle',
  failureColor: '#f5222d',
  failureIcon: 'close-circle',
  type: 'password',
  hasSure: false,
  text: '请输入密码',
  btnText: 'Log in',
  position: 'left'

};


export default FormPop;
