import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

import styles from './ERadio.less';

const ERadio = ({ children, ...arg }) => (
  <Radio className={styles['EMR-radio']} {...arg}>
    {children}
  </Radio>
);
ERadio.propTypes = {
  children: PropTypes.string.isRequired,
};
export default ERadio;
