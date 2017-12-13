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
  UPDATE_DIRECTION_RESULTS
} from './constants';

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
 *
 * @param  {array} directionResults object array of google places api search
 *
 * @return {object}    An action object with a type of UPDATE_SEARCH_RESULTS
 */
export function updateDirectionResults() {
  console.log('updateDirectionResults() > Actions > MapPage')
  return {
    type: UPDATE_DIRECTION_RESULTS
  };
}

// Step 1, get directions to work on initial load...
// for that I need a list of all the addresses returned to the G Maps Template
// Where do I receive the addresses?
// How did I look up adresses in the past? (and build out direction)

// YOU found that function, directionsMap, now make sure it works piece by piece

// CREATE AN ACTION TO:
// what about initial load... addresses from that?
// Sense of change of arrows to update search of the gmaps web
// 

// /**
//  * Update results of the google maps api search
//  *
//  * @param  {array} searchResults object array of google places api search
//  *
//  * @return {object}    An action object with a type of UPDATE_SEARCH_RESULTS
//  */
// export function updateSearchResults(searchResults) {
//   return {
//     type: UPDATE_SEARCH_RESULTS,
//     searchResults,
//   };
// }

