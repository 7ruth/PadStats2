/*
 * MapPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import H2 from 'components/H2';

import { makeSelectLoaded, makeSelectMap, makeSelectGoogle, makeSelectSearchResults } from './selectors';
import CenteredSection from './CenteredSection';
import messages from './messages';
import { setMapPageState } from './actions';

import GoogleMapContainer from '../GoogleMapContainer/index';
import cache from '../../utils/GoogleMapsUtils/ScriptCache';
import GoogleApi from '../../utils/GoogleMapsUtils/GoogleApi';
import * as config from '../../utils/GoogleMapsUtils/config';

const defaultMapConfig = {};
const apiKey = config.getGoogleKey();
const libraries = ['places'];

export class MapPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
          loaded: this.props.loaded,
        });
        const node = this.myMap;
        const center = new maps.LatLng(this.props.lat, this.props.lng);
        const mapConfig = Object.assign({}, defaultMapConfig, {
          center: center, // eslint-disable-line
          zoom: this.props.zoom,
        });
        this.map = new maps.Map(node, mapConfig);
        this.props.onGoogleLoad(true, this.map, window.google);
      });
    } else {
      const maps = window.google.maps;
      const props = Object.assign({}, this.props, { // eslint-disable-line
        loaded: this.props.loaded,
      });
      const node = this.myMap;
      const center = new maps.LatLng(this.props.lat, this.props.lng);
      const mapConfig = Object.assign({}, defaultMapConfig, {
        center, zoom: this.props.zoom,
      });

      this.map = new maps.Map(node, mapConfig);
      this.props.onGoogleLoad(true, this.map, window.google);
    }
    console.log("!!!!!!!!!!!!")
    console.log(this.props.searchResults)
  }

  render() {
    const props = this.props;

    return (
      <article>
        <Helmet
          title="Search Property Locations"
          meta={[
            { name: 'description', content: 'PadStats, we help you find an ideal location for your next home.' },
          ]}
        />
        <GoogleMapContainer {...props} />
        <div ref={(ref) => { this.myMap = ref; }} />
        <div>
          <CenteredSection>
            <H2>
              <FormattedMessage {...messages.trymeMessage} />
            </H2>
          </CenteredSection>
        </div>
      </article>
    );
  }
}

MapPage.propTypes = {
  zoom: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  lat: React.PropTypes.string,
  lng: React.PropTypes.string,
  onGoogleLoad: React.PropTypes.func,
  loaded: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onGoogleLoad: (loaded, map, google) => dispatch(setMapPageState(loaded, map, google)),
  };
}

const mapStateToProps = createStructuredSelector({
  loaded: makeSelectLoaded(),
  map: makeSelectMap(),
  google: makeSelectGoogle(),
  searchResults: makeSelectSearchResults()
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(MapPage);
