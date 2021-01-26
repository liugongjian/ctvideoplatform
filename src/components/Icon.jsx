
import React from 'react';
import PropTypes from 'prop-types';

import 'Styles/fonts/style.css';

const Icon = ({ children, type, ...arg }) => (
  <span className={`${type}`} {...arg}>
    {children}
  </span>
);


Icon.propTypes = {
  children: PropTypes.string,
  type: PropTypes.string.isRequired
};

Icon.defaultProps = {
  children: '',
};

export default Icon;
