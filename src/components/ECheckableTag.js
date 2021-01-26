import React from 'react';
import { Tag } from 'antd';
import propTypes from 'prop-types';
import classNames from 'classnames';

import styles from './ECheckableTag.less';

const { CheckableTag } = Tag;

const ECheckableTag = ({
  children, size, disabled, prefixCls, onChange, checked, ...arg
}) => {
  let sizeCls = '';
  switch (size) {
    case 'large':
      sizeCls = 'lg';
      break;
    case 'small':
      sizeCls = 'sm';
      break;
    default:
      break;
  }
  return (
    <span className={styles[prefixCls]}>
      <CheckableTag
        className={classNames([sizeCls], {
          disabled
        })}
        {...arg}
        checked={checked}
        onChange={!disabled && onChange}
      >
        {children}
      </CheckableTag>
    </span>
  );
};

ECheckableTag.propTypes = {
  size: propTypes.oneOf(['large', 'default', 'small']),
  prefixCls: propTypes.string,
  checked: propTypes.bool,
  onChange: propTypes.func,
  disabled: propTypes.bool,
  children: propTypes.shape({}),
};

ECheckableTag.defaultProps = {
  prefixCls: 'EMR-checkabletag',
  size: 'default',
  checked: false,
  onChange: () => {},
  disabled: false,
  children: {},
};

export default ECheckableTag;
