import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import PropTypes from 'prop-types';
import {
} from 'Redux/reducer/face';
import {
  Form,
} from 'antd';

import styles from './import.less';

const mapStateToProps = state => ({ face: state.face });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
  },
  dispatch
);

class ImportFace extends Component {
  state = {

  };

  componentDidMount() {

  }

  render() {
    return (
      <div className={styles.content}>
        <div>批量导入人脸</div>
      </div>
    );
  }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(ImportFace));
