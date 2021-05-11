import React, { Component } from 'react';
import {
  Select,
  Form,
  Input,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
// import AMap from 'Components/Amap/Amap';
import { Map, Markers, Polyline } from 'react-amap';
import { AMAP_KEY } from '../constants';
import styles from '../index.less';

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

const randomPosition = () => ({
  longitude: 100 + Math.random() * 20,
  latitude: 30 + Math.random() * 20
});
const randomMarker = len => (
  Array(len).fill(true).map((e, idx) => ({
    position: randomPosition()
  }))
);

class MapTrack extends Component {
  constructor() {
    super();
    this.state = {
      markers: randomMarker(7),
      center: randomPosition()
    };
  }

  componentDidMount() {
    // ajax code
  }

  render() {
    const { markers } = this.state;
    return (
      <div className={styles.MapTrack}>
        <div style={{ width: '700px', height: '500px' }}>
          {/* <AMap key="112" /> */}
          <Map amapkey={AMAP_KEY} plugins={['ToolBar']} center={this.state.center} zoom={6}>
            <Markers
              markers={markers}
            />
            <Polyline
              path={markers.map(item => item.position)}
              visible
              draggable
            />
          </Map>
        </div>
      </div>
    );
  }
}

MapTrack.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MapTrack);
