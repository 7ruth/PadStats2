import React from 'react';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Map from '../GoogleMapTemplate/index';
import Marker from '../../components/GoogleMapMarker/Marker';
import FlexWrapperDiv from './FlexWrapperDiv';
import BottomDiv from './BottomDiv';
import TopDiv from './TopDiv';
import CheckboxForm from './CheckboxForm';
import SmoothCollapse from '../../utils/ReactSmoothCollapse';
import CategoriesDiv from './CategoriesDiv';
import { changeCategories } from '../MapPage/actions';
import { makeSelectCategories } from '../MapPage/selectors';

// will separate out Listing into a separate component as this evolves
const Listing = ({ places, categories }) => { // eslint-disable-line

  return (
    <ul>
      {places && places.map((p) => { // eslint-disable-line
        return (
          <li key={p.id}>
            {p.name}
          </li>
        );
      })}
    </ul>
  );
};

export class GoogleMapContents extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      place: null,
      position: null,
      places: [],
      categoriesExpanded: false,
    };
  }

  componentDidMount() {
    this.renderAutoComplete();
  }

  componentDidUpdate(prevProps) {
    const { map, categories } = this.props;
    let categoryHolder = categories;
    if (map !== prevProps.map) {
      this.renderAutoComplete();
    }
    // dispatch action here to make an adjustment to a new prop, newlyAddedCategory
    if (categories !== prevProps.categories) {
      // get the difference between old and new categories to search
      if (prevProps.categories) {
        categoryHolder = this.diff(categories, prevProps.categories);
      }
      this.searchNearby(map, map.center, categoryHolder);
    }
  }

  onSubmit(e) {
    e.preventDefault();
  }

  diff(array1, array2) {
    return array1.filter((i) => array2.indexOf(i) < 0);
  }

  searchNearby(map, center, categoryHolder) {
    const { google, categories } = this.props;
    const service = new google.maps.places.PlacesService(map);
    const newCategories = categoryHolder || categories;
    // Specify location, radius and place types for your Places API search.
    newCategories.forEach((category) => {
      const request = {
        location: center,
        radius: '1500',
        type: category,
      };

      service.nearbySearch(request, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
// build up a places object by category.
          this.pagination = pagination;
          this.setState({
            places: results,
            hasNextPage: pagination.hasNextPage,
            center: center, // eslint-disable-line object-shorthand
          });
        }
      });
    });
  }

  toggleCategories() {
    this.setState({ categoriesExpanded: !this.state.categoriesExpanded });
  }

  renderAutoComplete() {
    const { google, map } = this.props;

    if (!google || !map) return;
    // const aref = this.refs.autocomplete;
    const node = this.myAutocomplete;
    const autocomplete = new google.maps.places.Autocomplete(node);
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
        place: place, // eslint-disable-line
        position: place.geometry.location,
      });
    });
  }


  render() {
    const props = this.props;
    const { position, categoriesExpanded } = this.state; // eslint-disable-line

    return (
      <FlexWrapperDiv>
        <TopDiv>
          <Map
            {...props}
            containerStyle={{
              position: 'relative',
              height: '400px',
              width: '100%',
            }}
            center={this.state.position}
            centerAroundCurrentLocation={false}
          >
            <Marker position={this.state.position} />
          </Map>
        </TopDiv>
        <BottomDiv>
          <form onSubmit={this.onSubmit}>
            <input
              ref={(ref) => { this.myAutocomplete = ref; }}
              type="text"
              placeholder="Enter a location"
            />
            <input
              type="submit"
              value="Go"
            />
          </form>
          <CategoriesDiv>
            <input
              type="button"
              value={categoriesExpanded ? '- Categories' : '+ Categories'}
              onClick={() => this.toggleCategories()}
            />
          </CategoriesDiv>
          <SmoothCollapse expanded={categoriesExpanded}>
            <CheckboxGroup name="mapOptions" value={this.props.categories} onChange={this.props.onMapOptionChange}>
              <CheckboxForm >
                {//  /* eslint says label has to have htmlFor, but that breaks checkbox label clicking, there is no way to make a lint comment out in render portion of JSX */}
                /* eslint-disable */
                }
                <label>
                  <Checkbox value="convenience_store" /> Convenience Store
                </label>
                <label>
                  <Checkbox value="gym" /> Gym
                </label>
                <label>
                  <Checkbox value="grocery_or_supermarket" /> Grocery
                </label>
                <label>
                  <Checkbox value="subway_station" /> Metro
                </label>
                <label>
                  <Checkbox value="school" /> School
                </label>
                <label>
                  <Checkbox value="meal_takeaway" /> Takeout
                </label>
                <label>
                  <Checkbox value="restaurant" /> Restaurant
                </label>
                <label>
                  <Checkbox value="library" /> Library
                </label>
                <label>
                  <Checkbox value="museum" /> Museum
                </label>
                <label>
                  <Checkbox value="store" /> Stores
                </label>
                <label>
                  <Checkbox value="transit_station" /> Transit Station
                </label>



                {/* eslint-enable */}
              </CheckboxForm>
            </CheckboxGroup>
          </SmoothCollapse>
          <div>
            <Listing places={this.state.places} categories={this.props.categories} />
          </div>
        </BottomDiv>
      </FlexWrapperDiv>
    );
  }
}

GoogleMapContents.propTypes = {
  map: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  google: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),

  onMapOptionChange: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.func,
  ]),
  categories: React.PropTypes.array,
};

export function mapDispatchToProps(dispatch) {
  return {
    onMapOptionChange: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(changeCategories(evt));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(GoogleMapContents);
