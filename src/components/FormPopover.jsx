import React, { Component } from 'react';
import { Popover, Icon } from 'antd';
import PropTypes from 'prop-types';
import { timingSafeEqual } from 'crypto';
import styles from './FormPop.less';

export default class FormPopover extends Component {
    state = { popoverVisible: false }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //   if (snapshot) {
    //     this.state.popoverVisible = snapshot; // 显示
    //   }
    // }

    // getSnapshotBeforeUpdate(prevProps, prevState) {
    //   const { popoverVisible } = this.state;
    //   const { visible } = this.props;

    //   if (popoverVisible !== prevState.popoverVisible) { // 优先内部操作
    //     this.setState({ popoverVisible });
    //     return popoverVisible;
    //   }


    //   return visible;
    // }


    validateType=() => {
      const { form, name } = this.props;
      const { getFieldValue } = form;
      const value = getFieldValue(name);
      const { tips = [] } = this.props;
      let isValid = true;
      tips.map((tip) => {
        const item = tip;
        if (item.valid) {
          if (value === '' || value === undefined) {
            item.status = '-';
          } else if (value) {
            item.status = item.valid.test(value) ? 'success' : 'failure';
          } else {
            item.status = 'failure';
          }
        } else {
          item.status = '-';
        }
        if (item.status === 'failure') {
          isValid = false;
        }
        return item;
      });
      return { isValid, tips };
    }

    popover = () => {
      const { firstValue, passwordHasValidate } = this.state;
      const hasValidate = firstValue === '' && !passwordHasValidate;
      const { tips } = this.validateType();
      const {
        successColor, successIcon, failureColor, failureIcon, defaultColor
      } = this.props;
      const iconData = {
        '-': {
          type: '',
          color: defaultColor
        },
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

    render() {
      const { children } = this.props;
      const { popoverVisible } = this.state;
      if (React.Children.count(children) !== 1) {
        throw new Error('只能传一个子组件');
      }
      return (
        <Popover
          {...this.props}
          content={this.popover()}
          onFocus={() => { this.setState({ popoverVisible: true }); }}
          onBlur={() => { this.setState({ popoverVisible: false }); }}
          visible={popoverVisible}
        >
          {children}
        </Popover>
      );
    }
}

FormPopover.propTypes = {
  tips: PropTypes.arrayOf(PropTypes.shape({ a: PropTypes.array })).isRequired,
  form: PropTypes.arrayOf(PropTypes.shape({ a: PropTypes.array })).isRequired,
  children: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  successColor: PropTypes.string,
  successIcon: PropTypes.string,
  failureColor: PropTypes.string,
  failureIcon: PropTypes.string,
  defaultColor: PropTypes.string,
};

FormPopover.defaultProps = {
  successColor: '#52c41a',
  successIcon: 'check-circle',
  failureColor: '#ff8833',
  failureIcon: 'action-state-delete',
  defaultColor: '#333'
};


export const formGetFieldDecorator = (form) => {
  const { getFieldDecorator } = form;

  return (name, config) => {
    const { validator, rules } = config;
    let validatorFun;
    if (!validator) {
      throw new Error('必须自定义校验');
    } else {
      validatorFun = (rule, value, callback) => {
        for (let i = 0; i < validator.length; i += 1) {
          const { valid, message } = validator[i];
          if (!valid.test(value)) {
            callback(message);
            return;
          }
        }
        callback();
      };
    }

    const newConfig = { ...config, rules: [...rules, { validator: validatorFun }] };
    const ct = children => (
      <FormPopover
        tips={validator}
        placement="right"
        form={form}
        name={name}
        visible
      >
        {getFieldDecorator(name, newConfig)(children)}
      </FormPopover>
    );

    return ct;
  };
};
