import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import Icon from './Icon';

import styles from './ESearch.less';

const { Search } = Input;

class ESearch extends React.Component {
  state = {
    value: ''
  };

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    const { value: valueNext } = nextProps;
    if (value !== valueNext) {
      this.setState({
        value: valueNext
      });
    }
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(e.target.value);
    }
  };

  clear = (e) => {
    this.setState({
      value: ''
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(e.target.value);
    }
  };

  render() {
    const { value } = this.state;
    const { disabled, ...arg } = this.props;
    const clearStyles = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-30%)',
      lineHeight: 0,
      right: 28,
      fontSize: 12,
      display: 'none',
      color: '#999',
      cursor: 'pointer'
    };
    if (value && !disabled) {
      clearStyles.display = 'block';
    }
    return (
      <span className={styles['EMR-search']}>
        <Search
          className={styles['EMR-search-input']}
          disabled={disabled}
          {...arg}
          value={value}
          onChange={this.onChange}
        />
        <Icon type="anticon-close2" style={clearStyles} onClick={this.clear} />
      </span>
    );
  }
}
ESearch.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

ESearch.defaultProps = {
  onChange: () => {},
  value: '',
  disabled: false,
};

export default ESearch;
