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
import CategoriesToggleDiv from './CategoriesToggleDiv';
import CategoriesContainer from '../GoogleMapContentsCategoriesContainer';
import { changeCategories, updateSearchResults } from '../MapPage/actions';
import { makeSelectCategories, makeSelectSearchResults } from '../MapPage/selectors';

// will separate out Listing into a separate component as this evolves
// const Listing = ({ places, categories }) => { // eslint-disable-line
//
//   if (categories) {
//     console.log(categories.length - 1);
//     console.log(categories[categories.length - 1]);
//     console.log(places);
//     console.log(places[categories[categories.length - 1]]);
//   }
//
//
//   return (
//     <ul>
//       {places && categories.map((p) => { // eslint-disable-line
//         if (places[p]) {
//           return places[p].places.map((i) => { // eslint-disable-line
//             return (
//               <li key={i.id}>
//                 {i.name}
//               </li>
//             );
//           });
//         }
//       })}
//     </ul>
//   );
// };

// {places[categories[categories.length - 1]] && places[categories[categories.length - 1]].places.map((p) => { // eslint-disable-line
//   return (
//     <li key={p.id}>
//       {p.name}
//     </li>
//   );
// })}
function diff(array1, array2) {
  return array1.filter((i) => array2.indexOf(i) < 0);
}

export class GoogleMapContents extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      place: null,
      position: null,
      categoriesExpanded: false,
    };
  }

  componentDidMount() {
    // later categories will be tak en from users prefences from db and user profile
    // const userCategories = ['gym', 'convenience_store'];
    const userCategories = { gym: 0, convenience_store: 0 };
    this.renderAutoComplete();
    this.props.setInitialCategories(userCategories);
  }

  componentDidUpdate(prevProps) {
    const { map, categories } = this.props;
    let categoryHolder = categories;
    if (map !== prevProps.map) {
      this.renderAutoComplete();
    }
    // dispatch action here to make an adjustment to a new prop, newlyAddedCategory
    if (categories !== prevProps.categories && prevProps.categories !== null) {
      // get the difference between old and new categories to search
      if (prevProps.categories) {
        categoryHolder = diff(Object.keys(categories), Object.keys(prevProps.categories));
      }
      this.searchNearby(map, map.center, categoryHolder);
    }
  }

  onSubmit(e) {
    e.preventDefault();
  }

  searchNearby(map, center, categoryHolder) {
    const { google, categories } = this.props;
    let searchResults = this.props.searchResults || [];
    const service = new google.maps.places.PlacesService(map);
    const newCategories = categoryHolder || Object.keys(categories);
    // Specify location, radius and place types for your Places API search.
    newCategories.forEach((category) => {
      const request = {
        location: center,
        radius: '1500',
        type: category,
      };

      service.nearbySearch(request, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.pagination = pagination;

          searchResults = Object.assign({}, searchResults, { [category]: {
            places: results,
            hasNextPage: pagination.hasNextPage },
          });

          this.props.updateSearchResults(searchResults);
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
          <CategoriesToggleDiv>
            <input
              type="button"
              value={categoriesExpanded ? '- Categories' : '+ Categories'}
              onClick={() => this.toggleCategories()}
            />
          </CategoriesToggleDiv>
          <SmoothCollapse expanded={categoriesExpanded}>
            <CheckboxGroup name="mapOptions" value={props.categories ? Object.keys(props.categories) : null} onChange={(e) => this.props.onMapOptionChange(props.categories, e)}>
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
            { // <Listing places={this.props.searchResults} categories={this.props.categories} />
            }
            {// if position is set, then show the categoriesContainer with more detailed info
            }
            {this.state.position && <CategoriesContainer />}
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
  setInitialCategories: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.func,
  ]),
  categories: React.PropTypes.array,
  searchResults: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.object,
  ]),
  updateSearchResults: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.func,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onMapOptionChange: (categories, evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      // need to diff a new addition
      const categoryHolder = diff(evt, Object.keys(categories));
      // add only new category to the state with selection of 0 (this is to pick to display 0th result returned for that category)
      const newCategories = Object.assign({}, categories, { [categoryHolder]: 0 });
      dispatch(changeCategories(newCategories));
    },
    setInitialCategories: (initialCategories) => {
      dispatch(changeCategories(initialCategories));
    },
    updateSearchResults: (searchResults) => {
      dispatch(updateSearchResults(searchResults));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  searchResults: makeSelectSearchResults(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(GoogleMapContents);
