import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { camelize } from '../../utils/GoogleMapsUtils/String';
import { makeCancelable } from '../../utils/GoogleMapsUtils/cancelablePromise';
import mapStyles from './GoogleMapTemplateStyles';
import rainbow from "./utils";

function diff(array1, array2) {
  return array1.filter((i) => array2.indexOf(i) < 0);
}

export const defaultCategories = {
  convenience_store: ["Convenience Store", "#cc0099"],
  gym: ["Gym", "#d29fdb"],
  grocery_or_supermarket: ["Grocery", "#2095f2"],
  subway_station: ["Metro", "#00bbd3"],
  school: ["School", "#009587"],
  meal_takeaway: ["Takeout", "#4bae4f"],
  restaurant: ["Restaurant", "#fec006"],
  library: ["Library", "#785447"],
  museum: ["Museum", "#c1c1c1"],
  store: ["Store", "rgb(0, 0, 0)"],
  transit_station: ["Transit Station", "#6639b6"]
}

// const mapStyles = {
//   container: {
//     position: 'relative',
//     minWidth: '400px',
//     minHeight: '400px',
//   },
//   map: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     top: 0,
//   },
// };

// const evtNames = [
//   'ready',
//   'click',
//   'dragend',
//   'recenter',
//   'bounds_changed',
//   'center_changed',
//   'dblclick',
//   'dragstart',
//   'heading_change',
//   'idle',
//   'maptypeid_changed',
//   'mousemove',
//   'mouseout',
//   'mouseover',
//   'projection_changed',
//   'resize',
//   'rightclick',
//   'tilesloaded',
//   'tilt_changed',
//   'zoom_changed',
// ];

export { Marker } from '../../components/GoogleMapMarker/Marker';
export { InfoWindow } from '../../components/GoogleMapInfoWindow/InfoWindow';
export { HeatMap } from '../../components/GoogleMapHeatMap/HeatMap';

let directionsRendererObj = {};
let markerObject={};
let infowindow;
let infoWindowObject={};

export class Map extends React.Component {
  constructor(props) {
    super(props);

    invariant(Object.prototype.hasOwnProperty.call(props, 'google'),
                'You must include a `google` prop.');

    this.listeners = {};
    this.state = {
      currentLocation: {
        lat: this.props.initialCenter.lat,
        lng: this.props.initialCenter.lng,
      },
    };
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        this.geoPromise = makeCancelable(
          new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          })
        );

        this.geoPromise.promise.then((pos) => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude,
            },
          });
        }).catch((e) => e);
      }
    }
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (this.props.visible !== prevProps.visible) {
      this.restyleMap();
    }
    if (this.props.zoom !== prevProps.zoom) {
      this.map.setZoom(this.props.zoom);
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
    if (this.props.center !== prevProps.center) {
      // new address will trigger initial look up of all the routes
      this.setState({ //eslint-disable-line
        currentLocation: this.props.center,
      });
    }
    if (this.props.directionResults !== prevProps.directionResults) {
console.log("DIRECTIONS PROPS HAVE CHANGED")
      // if directions changed, calculate distance and time
      this.setDirections(this.props.directionResults);
    }
    if (this.props.categories !== prevProps.categories) {
console.log("CATEGORIES PROPS HAVE CHANGED")
      this.setDirections();
    }
  }

  componentWillUnmount() {
    const { google } = this.props;
    if (this.geoPromise) {
      this.geoPromise.cancel();
    }
    Object.keys(this.listeners).forEach((e) => {
      google.maps.event.removeListener(this.listeners[e]);
    });
  }

  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;

      const node = this.myMap;
      const curr = this.state.currentLocation;
      const center = new maps.LatLng(curr.lat, curr.lng);

      const mapTypeIds = this.props.google.maps.MapTypeId || {};
      const mapTypeFromProps = String(this.props.mapType).toUpperCase();

      const mapConfig = Object.assign({}, {
        mapTypeId: mapTypeIds[mapTypeFromProps],
        center: center, //eslint-disable-line
        zoom: this.props.zoom,
        maxZoom: this.props.maxZoom,
        minZoom: this.props.minZoom,
        clickableIcons: this.props.clickableIcons,
        disableDefaultUI: this.props.disableDefaultUI,
        zoomControl: this.props.zoomControl,
        mapTypeControl: this.props.mapTypeControl,
        scaleControl: this.props.scaleControl,
        streetViewControl: this.props.streetViewControl,
        panControl: this.props.panControl,
        rotateControl: this.props.rotateControl,
        scrollwheel: this.props.scrollwheel,
        draggable: this.props.draggable,
        keyboardShortcuts: this.props.keyboardShortcuts,
        disableDoubleClickZoom: this.props.disableDoubleClickZoom,
        noClear: this.props.noClear,
        styles: this.props.styles,
        gestureHandling: this.props.gestureHandling,
      });

      Object.keys(mapConfig).forEach((key) => {
        // Allow to configure mapConfig with 'false'
        if (mapConfig[key] === null || mapConfig[key] === undefined) {
          delete mapConfig[key];
        }
      });

      this.map = new maps.Map(node, mapConfig);

      // evtNames.forEach((e) => {
      //   this.listeners[e] = this.map.addListener(e, this.handleEvent(e));
      // });
      maps.event.trigger(this.map, 'ready');
      this.forceUpdate();
    }
  }

  lookupDirections(google, map, request) {
  const directionsService1 = new google.maps.DirectionsService(map);
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService(map);
      directionsService.route(request, (results, status, pagination) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          resolve(results, pagination);
        } else {
          reject(results, status);
        }
      })
    });
  }

  setDirections(directionResults) {  

    
      const map = this.map;
      const searchResults = this.props.searchResults;
      const categories = this.props.categories;

      // if no directionResults are passed in, then do a check to remove categories
      if (!directionResults) {
        const removedCategory = diff(Object.keys(directionsRendererObj), Object.keys(categories));
        console.log('RAWR')
        console.log(removedCategory);
        if (removedCategory.length > 0) {
          directionsRendererObj[removedCategory].setMap(null);
          delete directionsRendererObj[removedCategory];

          markerObject[removedCategory].setMap(null);
          delete markerObject[removedCategory]
          console.log("33333333333333");
          console.log(directionsRendererObj);
          console.log(markerObject)
        }
        console.log(directionsRendererObj)
        return;
      }

      const category = directionResults.category;
console.log("HIIIIII")
console.log(defaultCategories[category][1]);
      let directionRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        draggable: false,
        scrollwheel: false,
        map: map,
        preserveViewport: true,
        // polylineOptions: new google.maps.Polyline({strokeColor: rainbow(Math.round(Math.random() * 100),Math.round(Math.random() * 9)),})
        polylineOptions: new google.maps.Polyline({strokeColor: defaultCategories[category][1]})
      });

console.log('directionsRendererObj');
console.log(directionsRendererObj);

      // Clean up any routes if they exist
      directionsRendererObj[category] && directionsRendererObj[category].setMap(null);
      // Set new directionRenderer obj
      directionsRendererObj[category]=directionRenderer;
      // Set marker on the map
      directionsRendererObj[category].setMap(map);
      // Set directions on the map
      directionsRendererObj[category].setDirections(directionResults.directionResults);
      // Select the poi we are rendering directions for to make a more specific marker
      let routedPoi = searchResults[category].places[categories[category][0]];
      // create a marker for current POI, need to provide category for look
      this.createMarker(routedPoi, category);
  }

  createMarker(place, category) {
    const map = this.map;
    const {google} = this.props;
    const maps = google.maps;
    
    if (place === "undefined" || place === undefined){
      return;
    } else {
      // Marker settings
      let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        visible: false
      });
      //Overwrite previous marker for this category
      if(markerObject[category]){
        markerObject[category].setMap(null);
      }
      //delete any extra markers (if user unchecked a category)
      if (Object.keys(markerObject).length>Object.keys(this.props.categories).length){
        for (var i=0; i<Object.keys(markerObject).length; i++){
          if (Object.keys(this.props.categories).indexOf(Object.keys(markerObject)[i])==-1){
            markerObject[Object.keys(markerObject)[i]].setMap(null);
            delete markerObject[Object.keys(markerObject)[i]]
          }
        }
      }
      // Set new marker after cleanup
      markerObject[category]=marker;
      // Info Window Settings
      infowindow = new google.maps.InfoWindow();
      infoWindowObject[category]=infowindow;
      infoWindowObject[category].setContent(place.name);
      infoWindowObject[category].open(map, markerObject[category]);
    }
  }

  handleEvent(evtName) {
    let timeout;
    const handlerName = `on${camelize(evtName)}`;

    return (e) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => {
        if (this.props[handlerName]) {
          this.props[handlerName](this.props, this.map, e);
        }
      }, 0);
    };
  }

  recenterMap() {
    const map = this.map;

    const { google } = this.props;
    const maps = google.maps;

    if (!google) return;

    if (map) {
      let center = this.state.currentLocation;
      if (!(center instanceof google.maps.LatLng)) {
        center = new google.maps.LatLng(center.lat, center.lng);
      }
      // map.panTo(center)
      map.setCenter(center);
      maps.event.trigger(map, 'recenter');
    }
  }

  restyleMap() {
    if (this.map) {
      const { google } = this.props;
      google.maps.event.trigger(this.map, 'resize');
    }
  }

  renderChildren() {
    const { children } = this.props;

    if (!children) return;

    return React.Children.map(children, c => { //eslint-disable-line
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation,
      });
    });
  }

  render() {
    const style = Object.assign({}, mapStyles.map, this.props.style, {
      display: this.props.visible ? 'inherit' : 'none',
    });

    const containerStyles = Object.assign({},
      mapStyles.container, this.props.containerStyle);

    return (
      <div style={containerStyles} className={this.props.className}>
        <div style={style} ref={(ref) => { this.myMap = ref; }}>
          Loading map...
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  centerAroundCurrentLocation: PropTypes.bool,
  center: PropTypes.object,
  initialCenter: PropTypes.object,
  className: PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  visible: PropTypes.bool,
  mapType: PropTypes.string,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  clickableIcons: PropTypes.bool,
  disableDefaultUI: PropTypes.bool,
  zoomControl: PropTypes.bool,
  mapTypeControl: PropTypes.bool,
  scaleControl: PropTypes.bool,
  streetViewControl: PropTypes.bool,
  panControl: PropTypes.bool,
  rotateControl: PropTypes.bool,
  scrollwheel: PropTypes.bool,
  draggable: PropTypes.bool,
  keyboardShortcuts: PropTypes.bool,
  disableDoubleClickZoom: PropTypes.bool,
  noClear: PropTypes.bool,
  styles: PropTypes.array,
  gestureHandling: PropTypes.string,
};

// evtNames.forEach((e) => { Map.propTypes[camelize(e)] = PropTypes.func; });

Map.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416,
  },
  center: {},
  centerAroundCurrentLocation: false,
  style: {},
  containerStyle: {},
  visible: true,
  scrollwheel: false,
};

export default Map;
