
import React from 'react';
import { Pagination } from 'antd';
import propTypes from 'prop-types';

import styles from './EPagination.less';

// console.log('...arg', { ...arg });
const EPagination = ({ className, ...arg }) => (
  <Pagination
    className={styles[className]}
    hideOnSinglePage
    size="small"
    showTotal={total => `总条数：${total}`}
    // showSizeChanger
    // showQuickJumper
    {...arg}
  />
);
EPagination.propTypes = {
  className: propTypes.string
};

EPagination.defaultProps = {
  className: 'EMR-pagination'
};

export default EPagination;
