import React, { Component } from 'react';
import { Menu, Button, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
// import Icon from 'Components/Icon';
import PageHeader from 'Components/pageHeader';
import styles from './pageHeader.less';

const mapStateToProps = state => ({
  pageHeaderRoute: state.pageHeader.pageHeaderRoute || []
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    push
  },
  dispatch
);

class Contents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  componentDidMount() {

  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    }, () => {
      const { collapsed } = this.state;
      const { changeCollapsed } = this.props;
      changeCollapsed(collapsed);
    });
  }

  render() {
    const { pageHeaderRoute } = this.props;
    const { collapsed } = this.state;
    return (
      <div className={styles.pageHeaderBox}>
        <Button type="primary" onClick={this.toggleCollapsed}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <PageHeader routes={pageHeaderRoute} />
      </div>
    );
  }
}


Contents.propTypes = {
  pageHeaderRoute: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
