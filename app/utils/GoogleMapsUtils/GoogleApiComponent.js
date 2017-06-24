import React from 'react';
import cache from './ScriptCache';
import GoogleApi from './GoogleApi';

const defaultMapConfig = {};
export const wrapper = (options) => (WrappedComponent) => {
  const apiKey = options.apiKey;
  const libraries = options.libraries || ['places'];

  class Wrapper extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        loaded: false,
        map: null,
        google: null,
      };
    }

    componentWillMount() {
      // check if window.google.maps is already set
      if (window.google === undefined) {
        this.scriptCache = cache({
          google: GoogleApi({
            apiKey: apiKey, // eslint-disable-line
            libraries: libraries // eslint-disable-line
          }),
        });
      }
    }

    componentDidMount() {
      if (window.google === null) {
        this.scriptCache.google.onLoad((err, tag) => { // eslint-disable-line
          const maps = window.google.maps;
          const props = Object.assign({}, this.props, { // eslint-disable-line
            loaded: this.state.loaded,
          });
          // const mapRef = refs.map;
          const node = this.myMap;
          const center = new maps.LatLng(this.props.lat, this.props.lng);
          const mapConfig = Object.assign({}, defaultMapConfig, {
            center: center, // eslint-disable-line
            zoom: this.props.zoom,
          });
          this.map = new maps.Map(node, mapConfig);
          this.setState({
            loaded: true,
            map: this.map,
            google: window.google,
          });
        });
      } else {
        const maps = window.google.maps;
        const props = Object.assign({}, this.props, { // eslint-disable-line
          loaded: this.state.loaded,
        });
        // const mapRef = refs.map;
        const node = this.myMap;
        const center = new maps.LatLng(this.props.lat, this.props.lng);
        const mapConfig = Object.assign({}, defaultMapConfig, {
          center: center, // eslint-disable-line
          zoom: this.props.zoom,
        });

        this.map = new maps.Map(node, mapConfig);
        this.setState({ //eslint-disable-line
          loaded: true,
          map: this.map,
          google: window.google,
        });
      }
    }

    render() {
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded,
        map: this.state.map,
        google: this.state.google,
        mapComponent: this.myMap,
      });
      return (
        <div>
          <WrappedComponent {...props} />
          <div ref={(ref) => { this.myMap = ref; }} />
        </div>
      );
    }
  }

  Wrapper.propTypes = {
    zoom: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.bool,
    ]),
    lat: React.PropTypes.string,
    lng: React.PropTypes.string,
  };

  return Wrapper;
};


export default wrapper;
