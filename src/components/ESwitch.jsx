
import React from 'react';
import { Switch } from 'antd';
import PropTypes from 'prop-types';

import styles from './ESwitch.less';

const ESwitch = ({ className, ...arg }) => {
  console.log('...arg', { ...arg });
  return <span className={styles['EMR-switch']}><Switch {...arg} /></span>;
};
ESwitch.propTypes = {
  className: PropTypes.shape({}).isRequired,
};
export default ESwitch;
