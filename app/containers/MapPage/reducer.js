/*
 * MapPageReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  GOOGLE_API_LOADED,
  CHANGE_CATEGORIES,
  CHANGE_CATEGORY_FOR_DIRECTIONS,
  UPDATE_SEARCH_RESULTS,
  UPDATE_DIRECTION_RESULTS,
  UPDATE_DIRECTION_RESULTS_ERROR,
  START_UPDATE_DIRECTION_RESULTS,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loaded: '(@)_(@)',
  map: null,
  google: null,
  categories: null,
  categoryForDirections: "all",
  searchResults: false,
  directionResults: false,
  loading: false,
  error: false,
});

function MapPageReducer(state = initialState, action) {
  switch (action.type) {
    case GOOGLE_API_LOADED:
      return state
        .set('loaded', action.loaded)
        .set('map', action.map)
        .set('google', action.google);
    case CHANGE_CATEGORIES:
      return state
        .set('categories', action.categories);
    case CHANGE_CATEGORY_FOR_DIRECTIONS:
      return state
        .set('categoryForDirections', action.categoryForDirections)
    case UPDATE_SEARCH_RESULTS:
      console.log("UPDATING SEARCH RESULTS IN MAPPAGE REDUCER")
      console.log(action.searchResults)
      return state
        .set('searchResults', action.searchResults);
    case START_UPDATE_DIRECTION_RESULTS:
    console.log("reduced START_UPDATE DIRECTION RESULTS ((((((((((")
      return state
        .set('loading', true)
        .set('error', false)
    case UPDATE_DIRECTION_RESULTS:
    console.log("reduced UPDATE DIRECTION RESULTS +++++++!!!!!!!")
    console.log(action.directionResultData)
      return state
        .set('directionResults', action.directionResultData);
    case UPDATE_DIRECTION_RESULTS_ERROR:
    console.log("Error")
      return state
        .set('error', action.error);
    default:
      return state;
  }
}

export default MapPageReducer;
