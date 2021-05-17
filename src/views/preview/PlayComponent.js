import React, { Component } from 'react';
import FlvPlayer from './FlvPlayer';

class PlayComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSquared: 1
    };
  }

  render() {
    const {
      showSquared
    } = this.state;

    return (
      <div>
        <p>1</p>
        <p>4</p>
      </div>
    );
  }
}

export default PlayComponent;
