import React from 'react'
import ReactDOM from 'react-dom'

import Map, {GoogleApiWrapper} from '../GoogleMapTemplate/index'
import Marker from '../../components/GoogleMapMarker/Marker'
//import styles from './googlemap.module.css'
import FlexWrapperDiv from './FlexWrapperDiv'
import LeftDiv from './LeftDiv'
import RightDiv from './RightDiv'

const Listing = ({places}) => {
  return (
    <ul>
      {places && places.map(p => {
        return (
          <li key={p.id}>
            {p.name}
          </li>
        )
      })}
    </ul>
  )
}

const Contents = React.createClass({
  getInitialState() {
    return {
      place: null,
      position: null,
      places: []
    }
  },

  onSubmit: function(e) {
    e.preventDefault();
  },

  componentDidMount: function() {
    this.renderAutoComplete();
  },

  componentDidUpdate(prevProps) {
    const {google, map} = this.props;
    if (map !== prevProps.map) {
      this.renderAutoComplete();
    }
  },

  searchNearby(map, center) {
    const {google} = this.props;
console.log('searchNearby');
    const service = new google.maps.places.PlacesService(map);
    // Specify location, radius and place types for your Places API search.
    const request = {
       location: center,
       radius: '1500',
       type: ['food']
     };

    service.nearbySearch(request, (results, status, pagination) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
console.log(results);
        this.pagination = pagination;
        this.setState({
          places: results,
          hasNextPage: pagination.hasNextPage,
          center: center,
        })
      }
    })
  },

  renderAutoComplete: function() {
    const {google, map} = this.props;

    if (!google || !map) return;

    const aref = this.refs.autocomplete;
    const node = ReactDOM.findDOMNode(aref);
    var autocomplete = new google.maps.places.Autocomplete(node);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      this.searchNearby(map, map.center);

      this.setState({
        place: place,
        position: place.geometry.location
      })
    })
  },

  render: function() {
console.log("container props: ");
console.log(this.props);
console.log('container placesInfo: ');
console.log(this.state);
    const props = this.props;
    const {position} = this.state;


    return (
      <FlexWrapperDiv>
        <LeftDiv>
          <form onSubmit={this.onSubmit}>
            <input
              ref='autocomplete'
              type="text"
              placeholder="Enter a location" />
            <input
              type='submit'
              value='Go' />
          </form>
          <div>
            <div>Lat: {position && position.lat()}</div>
            <div>Lng: {position && position.lng()}</div>
          </div>
          <div>
            <Listing  places={this.state.places} />
          </div>
        </LeftDiv>
        <RightDiv>
          <Map {...props}
              containerStyle={{
                position: 'relative',
                height: '100vh',
                width: '100%'
              }}
              center={this.state.position}
              centerAroundCurrentLocation={false}>
                <Marker position={this.state.position} />
          </Map>
        </RightDiv>
      </FlexWrapperDiv>
    )
  }
})

const MapWrapper = React.createClass({

  render: function() {
console.log('mapWrapper props: ');
console.log(this.props);
console.log('mapWrapper state: ');
console.log(this.state);
    const props = this.props;
    const {google} = this.props;
    const placesInfo = this.state;

    return (
      <Map google={google}
          className={'map'}
          visible={false}>
            <Contents {...props} />
      </Map>
    );
  }
})

export default MapWrapper
