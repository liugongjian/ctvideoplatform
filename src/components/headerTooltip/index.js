import React from 'react';
import classNames from 'classnames';
import styles from './headerTooltip.less';

const headerTooltip = (props) => {
  const { children, className, ...restProps } = props;
  return (
    <div
      className={classNames(styles['header-tooltip'], className)}
      {...restProps}
    >
      {children}
    </div>
  );
};
export default headerTooltip;
