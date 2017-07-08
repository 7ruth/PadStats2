import React from 'react';
import PropTypes from 'prop-types';

import { camelize } from '../../utils/GoogleMapsUtils/String';
// const evtNames = ['mouseover', 'click', 'recenter'];

const wrappedPromise = () => {
  const wrappedPromise = {}, //eslint-disable-line
    promise = new Promise((resolve, reject) => {
      wrappedPromise.resolve = resolve;
      wrappedPromise.reject = reject;
    });
  wrappedPromise.then = promise.then.bind(promise);
  wrappedPromise.catch = promise.catch.bind(promise);
  wrappedPromise.promise = promise;
  return wrappedPromise;
};

export class HeatMap extends React.Component {

  componentDidMount() {
    this.heatMapPromise = wrappedPromise();
    this.renderHeatMap();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map) ||
      (this.props.position !== prevProps.position)) {
      if (this.heatMap) {
        this.heatMap.setMap(null);
        this.renderHeatMap();
      }
    }
  }

  componentWillUnmount() {
    if (this.heatMap) {
      this.heatMap.setMap(null);
    }
  }

  getHeatMap() {
    return this.heatMapPromise;
  }

  handleEvent(evt) {
    return (e) => {
      const evtName = `on${camelize(evt)}`;
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.heatMap, e);
      }
    };
  }

  renderHeatMap() {
    let {
      map, google, positions, mapCenter, icon, gradient, radius, opacity //eslint-disable-line
    } = this.props;

    if (!google) {
      return null;
    }

    positions = positions.map((pos) => { //eslint-disable-line
      return new google.maps.LatLng(pos.lat, pos.lng);
    });

    const pref = {
      map: map, //eslint-disable-line
      data: positions,
    };

    this.heatMap = new google.maps.visualization.HeatmapLayer(pref);

    this.heatMap.set('gradient', gradient);

    this.heatMap.set('radius', radius === undefined ? 20 : radius);

    this.heatMap.set('opacity', opacity === undefined ? 0.2 : opacity);

    // evtNames.forEach((e) => {
    //   this.heatMap.addListener(e, this.handleEvent(e));
    // });

    return this.heatMapPromise.resolve(this.heatMap);
  }

  render() {
    return null;
  }
}

HeatMap.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
  icon: PropTypes.string,
};

// evtNames.forEach(e => HeatMap.propTypes[e] = PropTypes.func) //eslint-disable-line

HeatMap.defaultProps = {
  name: 'HeatMap',
};

export default HeatMap;
