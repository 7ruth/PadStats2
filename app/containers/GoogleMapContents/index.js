import React from 'react';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Map from '../GoogleMapTemplate/index';
import Marker from '../../components/GoogleMapMarker/Marker';
import FlexWrapperDiv from './FlexWrapperDiv';
import MenuDiv from "./MenuDiv";
import SecondaryMenuDiv from "./SecondaryMenuDiv";
import MapDiv from "./MapDiv";
import ResultDiv from "./ResultDiv";
import CommuteCostDiv from "./CommuteCostDiv";
import CategoryListDiv from "./CategoryListDiv";
import CategoryListHeadingDiv from "./CategoryListHeadingDiv"
import CheckboxForm from './CheckboxForm';
import CheckboxesWrapper from "./CheckboxesWrapper";
import SmoothCollapse from '../../utils/ReactSmoothCollapse';
import CategoriesToggleInput from './CategoriesToggleInput';
import CategoriesContainer from '../GoogleMapContentsCategoriesContainer';
import { changeCategories, updateSearchResults, startUpdateDirectionResults, changeCategoryForDirections } from '../MapPage/actions';
import { makeSelectCategories, makeSelectSearchResults, makeSelectDirectionResults, makeSelectcategoryHolder } from '../MapPage/selectors';
import directionRequest from '../../utils/directionRequest';
import { defaultCategories } from "../GoogleMapTemplate/index";

function diff(array1, array2) {
  return array1.filter((i) => array2.indexOf(i) < 0);
}

let distancesObject = {};

const dropDownOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' }
]

export class GoogleMapContents extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      place: null,
      position: null,
      categoriesExpanded: false
    };
  }

  componentDidMount() {
    // later categories will be taken from users prefences from db and user profile
    // categories object structure { nameOfCategory: [positionNumberOfDisplayedPOIFromTheListOfPOIsForTheCategory, numberOfTimesUserVisitsThisPOI], booleanThatShowsIfNeedsToBePushedToTopForDisplayPurposes}
    const defaultCategories = { convenience_store: [0,1,1], gym: [0,1,0]};
    this.renderAutoComplete();
    this.props.setInitialCategories(defaultCategories);
  }

  componentDidUpdate(prevProps) {
    const { map, categories, directionResults } = this.props;
    let categoryHolder = categories;
    if (map !== prevProps.map) {
      this.renderAutoComplete();
    }
    // dispatch action here to make an adjustment to a new prop, newlyAddedCategory
    if (categories !== prevProps.categories && prevProps.categories !== null) {
      // get the difference between old and new categories to search

console.log('prevProps.categories')
console.log(prevProps.categories)
console.log(categories)

      if (prevProps.categories) {
        categoryHolder = diff(Object.keys(categories), Object.keys(prevProps.categories));
      }
  console.log("CALCDISTOBJ1")
  console.log(categoryHolder)
      // if new categories were added
      if (categoryHolder.length > 0) {
        this.searchNearby(map, map.center, categoryHolder);
      } else {
console.log("GROB")
        // check for the diff in the numbers 
        Object.keys(categories).forEach((category)=>{
          if (categories[category][1] !== prevProps.categories[category][1]) {
            console.log("GROB", category)
            this.calcDistancesObject(category);
          }
        })
        // console.log('prevProps.categories')
        // console.log(categories)
        // console.log(prevProps.categories)
      }

      // if category related travel number was changed

      
    }
    // if new directions then trigger travel time calculation
    if (directionResults !== prevProps.directionResults) {
      this.calcDistancesObject();
    }
  }

  onSubmit(e) {
    e.preventDefault();
  }

  searchNearby(map, center, categoryHolder) {
    const { google, categories } = this.props;
console.log("SEARCH NEARBY Kickoff")
console.log(categoryHolder)
console.log(categories)
    let searchResults = this.props.searchResults || [];
    const service = new google.maps.places.PlacesService(map);
    const newCategories = categoryHolder || Object.keys(categories);

    // if categoryHolder is undefined > autocomplete input triggered the search (not checking a checkbox) > thus need to go through 'all' categories not just the one in the holder
    if (!categoryHolder) {
      const targetCategory = "all";
      this.props.setCustomCategoryForDirections(targetCategory)
    }
    // Specify location, radius and place types for your Places API search.
    newCategories.forEach((category) => {
      const request = {
        location: center,
        radius: '1500',
        type: category,
      };

      searchResults = Object.assign({}, searchResults, 
        { "center": { location: center },
      });

      service.nearbySearch(request, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.pagination = pagination;

          searchResults = Object.assign({}, searchResults, { [category]: {
            places: results,
            hasNextPage: pagination.hasNextPage },
          });

          this.props.updateSearchResults(searchResults)
          // when search results updated (new search), direction result update should be triggered (same happens on arrow clicks)
          this.props.startUpdateDirectionResults();
          // when update is complete, the map should be redrawn with new directions...
          // directionResults are part of the store now
          // shouldUpdate senses directionResults change and updates directionsData with travel time.
        }
      });
    });
  }

  toggleCategories() {
    this.setState({ categoriesExpanded: !this.state.categoriesExpanded });
  }

  calcDistancesObject(inputCategory) {
    const { searchResults, directionResults, categories } = this.props;
console.log('searchResults')
console.log(searchResults)
console.log('directionResults')
console.log(directionResults)
console.log('categories')
console.log(categories)
    const category = inputCategory || directionResults.category;
console.log("LLLLL")
console.log(category)
    // Select the poi we are rendering directions for to make a more specific marker
    let routedPoi = searchResults[category].places[categories[category][0]];

    console.log(searchResults[category])
console.log('routedPoi')
console.log(routedPoi)
    //calc distance and time to the POI from the center address
    let origin_lat = searchResults.center.location.lat();
    let origin_lng = searchResults.center.location.lng();
    let latitude = routedPoi.geometry.location.lat();
    let longitude = routedPoi.geometry.location.lng();
    const updatedSearchResults = Object.assign({}, searchResults);
    // calc travel time to the POI
    updatedSearchResults[category].places[categories[category][0]].distanceData = 
      {
        distance: this.calcDistance(origin_lat,origin_lng,latitude,longitude),
        travelTime: this.computeTime(directionResults.directionResults)
      };

  console.log("!!!!!!!!!>>>>");
  // console.log(updatedSearchResults);
  // console.log('categories')
  // console.log(categories) 

    // Loop to add POI travel time the amount of times user visits there to get categories commute cost
    let baseCommuteCost = 0;
    for (var i = 0; i< categories[category][1]; i++) {
      if (updatedSearchResults[category] && updatedSearchResults[category].places[categories[category][0]] && updatedSearchResults[category].places[categories[category][0]].distanceData){
        baseCommuteCost = this.addTimes(baseCommuteCost, updatedSearchResults[category].places[categories[category][0]].distanceData.travelTime)
      }
    }

    updatedSearchResults[category].places[categories[category][0]].distanceData.commuteCost = baseCommuteCost;
    
    // Loop to add up all categories total travel times to get address' total commute cost.
    let baseTime = 0;
    for (var i = 0; i< Object.keys(categories).length; i++) {
      let category = Object.keys(categories)[i];

      if (updatedSearchResults[category] && updatedSearchResults[category].places[categories[category][0]].distanceData){
        baseTime = this.addTimes(baseTime, updatedSearchResults[category].places[categories[category][0]].distanceData.commuteCost)
      }
    }
  
    updatedSearchResults.totalTravelTime = baseTime;
console.log('updatedSearchResults@@@')
console.log(updatedSearchResults)
    this.props.updateSearchResults(updatedSearchResults);

  }

  addTimes(baseTime, additionalTime) {
    let times = [ 0, 0, 0 ]
    let max = times.length

    let a = (baseTime || '').split(':')
    let b = (additionalTime || '').split(':')

    // normalize time values
    for (var i = 0; i < max; i++) {
      a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
    }

    // store time values
    for (var i = 0; i < max; i++) {
      times[i] = a[i] + b[i]
    }

    let hours = times[0]
    let minutes = times[1]
    let seconds = times[2]

    if (seconds > 60) {
      var m = (seconds / 60) << 0
      minutes += m
      seconds -= 60 * m
    }

    if (minutes > 60) {
      var h = (minutes / 60) << 0
      hours += h
      minutes -= 60 * h
    }

    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
  }

  computeTime(result) {
    let time=0;
    let mytravelroute=result.routes[0];
    for (var i = 0; i < mytravelroute.legs.length; i++) {
      time += mytravelroute.legs[i].duration.value;
    }
    let totalSec = time;
    let hours = parseInt( totalSec / 3600 );
    let minutes = parseInt( totalSec / 60 ) % 60;
    let seconds = totalSec % 60;
    let total = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    return total;
  }

  calcDistance (fromLat, fromLng, toLat, toLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
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
console.log("SEARCH NEARby FROM AUTOCOMPLETE")
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

    const updateNumberOfVisits = function(category) {      
      if (props.categories) {
        return function(newValue) {
          let categories = props.categories;
          // if category was previously not selected (and populated) make sure to insert 0 for position in POI list
          const newCategories = Object.assign({}, categories, {[category]: [categories[category] ? categories[category][0] : 0, parseInt(newValue.value)]});
          props.setInitialCategories(newCategories);
        }
      }
    }

    return (
      <FlexWrapperDiv>
        <MenuDiv>
        <form className="addressInputForm" onSubmit={this.onSubmit}>
            <input
              className="addressInput"
              ref={(ref) => { this.myAutocomplete = ref; }}
              type="text"
              placeholder="Enter a location"
            />
            {/* <input
              type="submit"
              value="Go"
            /> */}
          </form>
          <CategoriesToggleInput
            type="button"
            value={categoriesExpanded ? 'Collapse -' : 'Select Categories +'}
            onClick={() => this.toggleCategories()}
          />
        </MenuDiv>
        <CategoryListDiv>
          <SmoothCollapse expanded={categoriesExpanded}>
              <CategoryListHeadingDiv>
                <i>Pick all the categories that apply to your lifestyle and how many times per week you visit each one.</i>
              </CategoryListHeadingDiv>
              <CheckboxGroup
                name="mapOptions" 
                value={props.categories ? Object.keys(props.categories) : null} 
                onChange={(e) => this.props.onMapOptionChange(props.categories, e)}
              >
                <CheckboxForm
                  alignment="column"
                >
                {//  /* eslint says label has to have htmlFor, but that breaks checkbox label clicking, there is no way to make a lint comment out in render portion of JSX */}
                /* eslint-disable */
                }
                {Object.keys(defaultCategories).map((category)=>{
                  return <CheckboxesWrapper key={`checkboxesWrapper_${category}`}>
                            <div>
                              <label 
                                key={`label_${category}`}
                                style={{
                                  color: defaultCategories[category][1]
                                }}
                              >
                                <Checkbox value={category} /> 
                                {defaultCategories[category][0]}               
                              </label>
                            </div>
                            <div>
                              <Select
                                style={{
                                  display: 'inline-block',
                                  fontSize: '1em',
                                  textAlign: 'center',
                                  color: defaultCategories[category][1]
                                }}
                                searchable={false}
                                name={`form-field-${category}`}
                                // on initial render categories might not be ready, category might not be selected, value might be default
                                value={(props.categories && props.categories[category] && props.categories[category][1] > 1) ? props.categories[category][1] : 1}
                                onChange={updateNumberOfVisits(category)}
                                options={dropDownOptions}
                              />
                            </div>
                          </CheckboxesWrapper>
                })}
                {/* eslint-enable */}
              </CheckboxForm>
            </CheckboxGroup>
          </SmoothCollapse>
        </CategoryListDiv>
        <MapDiv>
          <Map
            {...props}
            containerStyle={{
              position: 'relative',
              height: '250px',
              width: '100%',
            }}
            center={this.state.position}
            centerAroundCurrentLocation={false}
          >
            <Marker position={this.state.position} />
          </Map>
        </MapDiv>
        <SecondaryMenuDiv>
          {props.searchResults.totalTravelTime ? <CommuteCostDiv>Commute Cost [ {<div style={{color:'orangered', display:'inline'}}>{props.searchResults.totalTravelTime}</div>} ]</CommuteCostDiv> : ""}
        </SecondaryMenuDiv>
        <ResultDiv>
          <div>
            {this.state.position && <CategoriesContainer/>}
          </div>
        </ResultDiv>
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
  setCustomCategoryForDirections: React.PropTypes.func,
  onMapOptionChange: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.func,
  ]),
  setInitialCategories: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.func,
  ]),
  categories: React.PropTypes.object,
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
      let categoryHolder = diff(evt, Object.keys(categories));
      let newCategories;
      // make sure we can subtrack categories also
      if (categoryHolder.length === 0) {
        categoryHolder = diff(Object.keys(categories), evt);
        const newCategoryHolder = delete categories[categoryHolder]; // eslint-disable-line
        newCategories = Object.assign({}, categories, newCategoryHolder);
      } else {
        // add only new category to the state with selection of [0,1] [poisArrayPosition, numTimesUserVisitsThisCategory] (this is to pick to display 0th result returned for that category)
        // search categories for previous top selected category and erase
        
        
        let oldTopCategory;
        Object.keys(categories).forEach((category) => {
          if (categories[category][2] === 1) {
            oldTopCategory = category;
          }
        })
        
        console.log(oldTopCategory)
        newCategories = Object.assign({}, categories, {[categoryHolder]: [0, 1, 1], [oldTopCategory]: [categories[oldTopCategory][0], categories[oldTopCategory][1], 0]});
        const targetCategory = diff(evt, Object.keys(categories));
        // to map the correct route, we need to target a category
        dispatch(changeCategoryForDirections(targetCategory));
      }

      dispatch(changeCategories(newCategories));
    },
    setCustomCategoryForDirections: (targetCategory) => {
      dispatch(changeCategoryForDirections(targetCategory));
    },
    setInitialCategories: (initialCategories) => {
      dispatch(changeCategories(initialCategories));
    },
    updateSearchResults: (searchResults) => {
      dispatch(updateSearchResults(searchResults));
    },
    // this is a trigger for starting a loop to update directions (since big-G limits how you can look up directions)
    // since its a trigger, no need to pass in anything
    startUpdateDirectionResults: () => {
      dispatch(startUpdateDirectionResults());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  searchResults: makeSelectSearchResults(),
  directionResults: makeSelectDirectionResults()
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(GoogleMapContents);
