import React, { Component } from 'react';
import { Menu, Icon, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import PageHeader from 'Components/pageHeader';

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

    };
  }

  componentDidMount() {

  }


  render() {
    const { pageHeaderRoute } = this.props;
    return (
      <div>
        <PageHeader routes={pageHeaderRoute} />
      </div>
    );
  }
}


Contents.propTypes = {
  pageHeaderRoute: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
