/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Modal, Button, Table, Tag, Divider
} from 'antd';
import {
  getHistoryListTopTen
} from 'Redux/reducer/preview';
import { urlPrefix } from 'Constants/Dictionary';
import styles from './index.less';

const mapStateToProps = state => ({ preview: state.preview });
const mapDispatchToProps = dispatch => bindActionCreators(
  {
  },
  dispatch
);


class InnerTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        <Link to="/tenants/add"><Button type="primary" className={styles.addBtn}>+ 新增租户</Button></Link>
        <Table columns={this.props.columns} dataSource={this.props.data} />
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(InnerTable);
