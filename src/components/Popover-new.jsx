import React, { Component } from 'react';
import { Popover } from 'antd';

import PropTypes from 'prop-types';

import Icon from 'Components/Icon';

class PopoverNew extends Component {
    popover = (form) => {
      const { getFieldValue } = form;
      const value = getFieldValue('password');
      const { passwordHasValidate } = this.state;
      const hasValidate = value === undefined && !passwordHasValidate;
      const { tips } = this.validatePassword();
      const iconData = {
        success: {
          type: 'check-circle-o',
          color: '#52c41a'
        },
        failure: {
          type: 'close-circle-o',
          color: '#f5222d'
        }
      };

      function iconRender(status) {
        let icon = '';
        if (hasValidate) {
          icon = <Icon type="icon-NAT-Gateway" />;
        } else {
          icon = <Icon type="icon-NAT-Gateway" />;
        }
        return icon;
      }
      return (
        <ul styleName="popover">
          {
            tips.map(tip => (
              <li key={tip.title}>
                {iconRender(tip.status, tip.title)}
                {!hasValidate && tip.status === 'failure' ? <span style={{ color: iconData[tip.status].color }}>{tip.title}</span> : tip.title}
              </li>
            ))
          }
        </ul>
      );
    }

    validatePassword = () => {
      const { form } = this.props;
      const { getFieldValue } = form;
      const value = getFieldValue('password') || '';
      const tips = [{
        title: '长度为8~15个字符',
        status: /^.{8,15}$/.test(value) ? 'success' : 'failure'
      }, {
        title: '字母、数字及至少一个特殊符号（#!@）组合',
        status: /^(?=.*[#!@])[0-9a-zA-Z#!@]+$/.test(value) ? 'success' : 'failure'
      },
      {
        title: '需包含大写字母',
        status: /^(?=.*[A-Z]).+$/.test(value) ? 'success' : 'failure'
      }
      ];
      let isValid = true;
      tips.map((tip) => {
        if (tip.status === 'failure') {
          isValid = false;
        }
        return tip;
      });
      return { isValid, tips };
    }


    render() {
      const { form } = this.props;
      return (
        <Popover context={this.popover(form)} />
      );
    }
}


PopoverNew.propTypes = {
  /**
       *调用路由跳转，参数路由地址
       */
  form: PropTypes.shape({}).isRequired,
};

// PopoverNew.defaultProps = {
// };


export default PopoverNew;
