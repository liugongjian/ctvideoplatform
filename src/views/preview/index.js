import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styles from './index.less';

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push,
  },
  dispatch
);

class Preview extends PureComponent {
    state={
      text: '啊啊啊'
    }

    render() {
      const { text } = this.state;
      return (
        <div>
          123
          <div>{text}</div>
        </div>
      );
    }
}
