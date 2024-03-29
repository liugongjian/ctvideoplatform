/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
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
import L from 'leaflet';
import { AMAP_KEY } from '../constants';
import styles from '../index.less';

const mapStateToProps = state => ({ monitor: state.monitor });
const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch
);

class MapTrack extends Component {
  constructor() {
    super();
    this.map = null;
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
    this.map = L.map('mymap').setView([39.9788, 116.30226], 14);
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 2,
      // maxZoom: 16,
      attribution: '&copy; OpenStreetMap'
    });
    this.map.addLayer(osm);
    const latlngs = [
      [31, 121],
      [39, 120],
      [45, 112],
      [33, 90],
    ];
    // 添加轨迹
    const polyline = L.polyline(latlngs, {
      color: '#1890ff',
      weight: 3,
    }).addTo(this.map);
    for (const i in latlngs) {
      const popupContent = `<p>这是第${i}个Marker<br />相关信息相关信息.</p>`;
      L.marker(latlngs[i]).addTo(this.map)
        .bindPopup(popupContent);
    }
    // 自适应地图视图比例
    this.map.fitBounds(polyline.getBounds());
  }

  render() {
    const { markers, info } = this.state;
    return (
      <div className={styles.MapTrack}>
        <div id="mymap" style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
}

MapTrack.propTypes = {
//   monitor: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MapTrack);
