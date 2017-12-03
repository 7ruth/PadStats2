import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { camelize } from '../../utils/GoogleMapsUtils/String';
import { makeCancelable } from '../../utils/GoogleMapsUtils/cancelablePromise';
import mapStyles from './GoogleMapTemplateStyles';

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

let directionsRendererArray = [];

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
      // to early to trigger on initial load...
      console.log('GoogleMapTemplate center was updated')
      console.log('searchResults')
      console.log(this.props.searchResults)
      this.setState({ //eslint-disable-line
        currentLocation: this.props.center,
      });
    }
    if (prevProps.searchResults !== this.props.searchResults) {
      console.log('!!!!!!!!!!!!')
      console.log("NEED to think how to later hook in arrow actions... to pass counters")
      console.log('GoogleMapTemplate ComponentDidUpdate searchResults')
      console.log(this.props.searchResults)
      this.directionsMap()
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
        if (mapConfig[key] === null) {
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

  directionsMap(userSelection) {
    const map = this.map;
    const {google} = this.props;
    const maps = google.maps;

    console.log('directionsMap Activated')
    console.log(this.props.searchResults)
    // if (!this.state.currentCategory && counter<=this.state.initialCategories.length) {
    //   // if this is an initial load on a new address (due to counter being 0) (but not an initial load of the site (directionsRendererArray is filled)), clean routes
    //   if (counter === 0) {
    //     for (let value of Object.keys(directionsRendererArray)) {
    //       directionsRendererArray[value].setMap(null);
    //     }
    //   }

    console.log(Object.keys(this.props.searchResults).pop())
    const targetCategory = Object.keys(this.props.searchResults).pop();
    // get the first category POI result to look up directions to
    const targetPOIaddress = this.props.searchResults[targetCategory].places[0].geometry.location
    // TODO, get a way to change travel mode in the look up below
    const request = {
      origin: this.props.center,
      destination: targetPOIaddress,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    }
    
    

    // can this be converted to a generator????!! try!


    this.lookupDirections(google, map, request)
      .then((results, pagination) => {
        console.log("~~~")
        console.log("lookupDirections!!!!!")
        console.log(results)
        // this.setState({
        //   directions: results
        // })
      });


    // let directionsRenderer = new google.maps.DirectionsRenderer({
    //   suppressMarkers: true,
    //   draggable: false,
    //   map: map,
    //   polylineOptions: new google.maps.Polyline({strokeColor: rainbow(Math.round(Math.random() * 100),Math.round(Math.random() * 9)),
    //   })});

      
    
    // directionsRendererArray[targetCategory]=directionsRenderer;
    // directionsRendererArray[targetCategory].setMap(map);

    // // pass this.state.currentDirections to setDirection... looked up direction between center of the map and the POI in question...


    // directionsRendererArray[targetCategory].setDirections(this.state.currentDirections);



    //   //use counter and Counters to select the poi object thats being routed
    //   let routedPoi = this.state.currentPoiObject[this.props.userSelection[counter]][this.state.currentCounters[this.props.userSelection[counter]]]
    //   // create a marker for current POI and category
    //   this.createMarker(routedPoi, this.props.userSelection[counter]);
    //   //calc distance and time to the POI from the center address
    //   let origin_lat = this.state.currentLocation.lat();
    //   let origin_lng = this.state.currentLocation.lng();
    //   let latitude = routedPoi.geometry.location.lat();
    //   let longitude = routedPoi.geometry.location.lng();
    //   //clean up distances object if user selection has changed
    //   if (Object.keys(distances).length/2> this.props.userSelection.length) {
    //     for (let i=0; i<Object.keys(distances).length; i+=2) {
    //       if (this.props.userSelection.indexOf(Object.keys(distances)[i])==-1) {
    //         delete distances[Object.keys(distances)[i]]
    //         delete distances[Object.keys(distances)[i+1]]
    //       }
    //     }
    //   }
    //   console.log(distances);
    //   distances[this.props.userSelection[counter]] = this.calcDistance(origin_lat,origin_lng,latitude,longitude);
    //   //calc travel time to the POI
    //   distances[this.props.userSelection[counter]+'TravelTime']= this.computetime(directionsRendererArray[this.props.userSelection[counter]].directions)
    //   //export distances object to MainMap component for rendering on the SidePanel component
    //   this.props.exportObject(distances)
    //   /////////////////////////////////////////////////////////////////
    //   counter += 1
    //   if (counter === this.props.userSelection.length) {
    //     counter = 0
    //   }
    //   //if +/- arrows are activated
    // } else {
    //   //clear previous renderer
    //   directionsRendererArray[this.state.currentCategory].setMap(null);
    //   //pass renderer to map
    //   directionsRendererArray[this.state.currentCategory].setMap(map);
    //   //pass options with results, start and end to the renderer on the map
    //   directionsRendererArray[this.state.currentCategory].setDirections(this.state.currentDirections);
    //   //set marker and info window
    //   routedPoi = this.state.currentPoiObject[this.state.currentCategory][this.state.currentCounters[this.state.currentCategory]]
    //   this.createMarker(routedPoi, this.state.currentCategory);
    //   //calc distance and time to the POI from the center address
    //   let origin_lat = this.state.currentLocation.lat();
    //   let origin_lng = this.state.currentLocation.lng();
    //   let latitude = routedPoi.geometry.location.lat();
    //   let longitude = routedPoi.geometry.location.lng();
    //   distances[this.state.currentCategory] = this.calcDistance(origin_lat,origin_lng,latitude,longitude);
    //   //calc travel time to the POI
    //   distances[this.state.currentCategory+"TravelTime"]= this.computetime(directionsRendererArray[this.state.currentCategory].directions)
    //   //export distances object to MainMap component for rendering on the SidePanel component
    //   this.props.exportObject(distances)
    // }
    //Coloring function for routes
    function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
      var r, g, b;
      var h = step / numOfSteps;
      var i = ~~(h * 10);
      var f = h * 10 - i;
      var q = 1 - f;
      switch(i % 10){
          case 0: r = 1, g = f, b = 0; break;
          case 1: r = q, g = 1, b = 0; break;
          case 2: r = 0, g = 1, b = f; break;
          case 3: r = 0, g = q, b = 1; break;
          case 4: r = f, g = 0, b = 1; break;
          case 5: r = 1, g = 0, b = q; break;
      }
      var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
      return (c);
      }
    // pastCounters = this.state.currentCounters
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
};

export default Map;
