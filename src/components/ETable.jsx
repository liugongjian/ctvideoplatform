
import React from 'react';
import { Table } from 'antd';
import propTypes from 'prop-types';

import styles from './ETable.less';
import EPagination from './EPagination';

// console.log('...arg', { ...arg });
const ETable = ({ className, pagination, ...arg }) => (
  <div className={styles[`${className}-wrapper`]}>
    <Table className={styles[className]} pagination={false} {...arg} />
    {pagination === false ? '' : <EPagination {...pagination} />}
  </div>
);
ETable.propTypes = {
  className: propTypes.string,
  pagination: propTypes.shape({}),
};

ETable.defaultProps = {
  className: 'EMR-table',
  pagination: {},
};

export default ETable;
