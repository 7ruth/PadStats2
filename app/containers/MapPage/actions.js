/*
 * MapPage Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  GOOGLE_API_LOADED,
  CHANGE_CATEGORIES,
  UPDATE_SEARCH_RESULTS,
  UPDATE_DIRECTION_RESULTS,
  START_UPDATE_DIRECTION_RESULTS,
  CHANGE_CATEGORY_FOR_DIRECTIONS,
  UPDATE_DIRECTION_RESULTS_ERROR
} from './constants';
import directionRequest from '../../utils/directionRequest';

/**
 * Indicate the google api has returned an object and it will be set to mapPage's state
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function setMapPageState(loaded, map, google) {
  return {
    type: GOOGLE_API_LOADED,
    loaded,
    map,
    google,
  };
}

/**
 * Changes the selection of point-of-interest categories
 *
 * @param  {array} categories an array of selected categories
 *
 * @return {object}    An action object with a type of CHANGE_CATEGORIES
 */
export function changeCategories(categories) {
  return {
    type: CHANGE_CATEGORIES,
    categories,
  };
}

/**
 * Changes the target category which will tell G directions api which category to look into for directions updating
 *
 * @param  {array} category a string denoting a category that needs to be looked up for directions
 *
 * @return {object}    An action object with a type of CHANGE_CATEGORY_FOR_DIRECTIONS
 */
export function changeCategoryForDirections(categoryForDirections) {
  console.log("action UPDATE CATEGORYFORDIRECTION")
  console.log(categoryForDirections)
  return {
    type: CHANGE_CATEGORY_FOR_DIRECTIONS,
    categoryForDirections,
  };
}

/**
 * Update results of the google maps api search
 *
 * @param  {array} searchResults object array of google places api search
 *
 * @return {object}    An action object with a type of UPDATE_SEARCH_RESULTS
 */
export function updateSearchResults(searchResults) {
  console.log('updateSearchResults() > Actions > MapPage')
  console.log(searchResults)
  return {
    type: UPDATE_SEARCH_RESULTS,
    searchResults,
  };
}

/**
 * Triggers the saga to get directions data
 **
 * @return {object}    An action object with a type of START_UPDATE_SEARCH_RESULTS
 */
export function startUpdateDirectionResults() {
  console.log('startUpdateDirectionResults() > Actions > MapPage')
  console.log(START_UPDATE_DIRECTION_RESULTS);
  return {
    type: START_UPDATE_DIRECTION_RESULTS,
  };
}

/**
 * Update results of direction search in the store
 *
 * @param  {array} directionResults object array of google places api search
 *
 * @return {object}    An action object with a type of UPDATE_SEARCH_RESULTS
 */
export function updateDirectionResults(directionResults, category) {
  console.log('updateDirectionResults() > Actions > MapPage')
  const directionResultData = {directionResults, category};
  console.log(directionResultData);
  return {
    type: UPDATE_DIRECTION_RESULTS,
    directionResultData
  };
}

/**
 * Update results of direction ERROR
 *
 * @param  {array} directionResults object array of google places api search
 *
 * @return {object}    An action object with a type of UPDATE_SEARCH_RESULTS
 */
export function updateDirectionResultsERROR(error) {
  console.log('updateDirectionResultsERROR')
  return {
    type: UPDATE_DIRECTION_RESULTS_ERROR,
    error
  };
};

