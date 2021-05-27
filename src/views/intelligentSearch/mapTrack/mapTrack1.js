
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
import {
  Map, Markers, Polyline, InfoWindow
} from 'react-amap';
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
    position: randomPosition(),
    title: '提示文字',
    info: {
      visible: false,
    }
  }))
);

class MapTrack extends Component {
  constructor() {
    super();
    this.state = {
      markers: [
        { position: { latitude: 31, longitude: 121 }, content: '第一个' },
        { position: { latitude: 39, longitude: 101 }, content: '第二个' },
        { position: { latitude: 45, longitude: 112 }, content: '第三个' },
        { position: { latitude: 33, longitude: 90 }, content: '第四个' }
      ],
      center: { latitude: 31, longitude: 121 },
    };
    this.markersEvents = {
      // created:(allMarkers) => {
      //   console.log('All Markers Instance Are Below');
      //   console.log(allMarkers);
      // },
      click: (MapsOption, marker) => {
        const extData = marker.getExtData();
        this.markerClick(extData);
      },
    };
  }

  componentDidMount() {
  }

  markerClick(data) {
    this.setState({
      info: {
        pos: data.position,
        visible: true,
        content: data.content,
      }
    });
  }

  render() {
    const { markers, info } = this.state;
    const mapEvents = {
      created: (el) => {
        this.mapEl = el;
      },
      complete: () => {
        // 地图自适应显示到合适的范围内,点标记全部显示在视野中。
        this.mapEl.setFitView();
      }
    };
    console.log('info', info);
    return (
      <div className={styles.MapTrack}>
        <div style={{ width: '100%', height: '100%' }}>
          {/* <AMap key="112" /> */}
          <Map
            amapkey={AMAP_KEY}
            plugins={['ToolBar']}
            center={this.state.center}
            events={mapEvents}
          >
            <Markers
              markers={markers}
              events={this.markersEvents}
            />
            <Polyline
              path={markers.map(item => (item.position))}
              visible
              draggable={false}
              showDir
              style={{ strokeWeight: 10 }}
            />
            <InfoWindow
              position={info?.pos}
              visible={info?.visible}
              content={info?.content}
              offset={[0, -30]}
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
