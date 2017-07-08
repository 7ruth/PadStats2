import React from 'react';
import PropTypes from 'prop-types';

import { camelize } from '../../utils/GoogleMapsUtils/String';
// const evtNames = ['mouseover', 'click', 'recenter', 'dragend'];

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

export class Marker extends React.Component {

  componentDidMount() {
    this.markerPromise = wrappedPromise();
    this.renderMarker();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map) ||
      (this.props.position !== prevProps.position)) {
      if (this.marker) {
        this.marker.setMap(null);
      }
      this.renderMarker();
    }
  }

  componentWillUnmount() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  getMarker() {
    return this.markerPromise;
  }

  handleEvent(evt) {
    return (e) => {
      const evtName = `on${camelize(evt)}`;
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.marker, e);
      }
    };
  }

  renderMarker() {
    let {
      map, google, position, mapCenter, icon, label, draggable, title, //eslint-disable-line
    } = this.props;
    if (!google) {
      return null;
    }

    const pos = position || mapCenter;
    if (!(pos instanceof google.maps.LatLng)) {
      position = new google.maps.LatLng(pos.lat, pos.lng);
    }

    const pref = {
      map: map, //eslint-disable-line
      position: position, //eslint-disable-line
      icon: icon, //eslint-disable-line
      label: label, //eslint-disable-line
      title: title, //eslint-disable-line
      draggable: draggable, //eslint-disable-line
    };
    this.marker = new google.maps.Marker(pref);

    // evtNames.forEach((e) => {
    //   this.marker.addListener(e, this.handleEvent(e));
    // });

    return this.markerPromise.resolve(this.marker);
  }

  render() {
    return null;
  }
}

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
};

// evtNames.forEach((e) => Marker.propTypes[e] = PropTypes.func); //eslint-disable-line

Marker.defaultProps = {
  name: 'Marker',
};

export default Marker;
