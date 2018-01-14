/**
 * Google Map calls
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { START_UPDATE_DIRECTION_RESULTS } from './constants';
import { updateDirectionResults, updateDirectionResultsERROR } from './actions';
// import { reposLoaded, repoLoadingError } from 'containers/App/actions';

// import request from 'utils/request';
import directionRequest from 'utils/directionRequest';
import { makeSelectSearchResults, 
         makeSelectMap, 
         makeSelectGoogle, 
         makeSelectCategories,
         makeSelectCategoryForDirections,
        } from './selectors';
import { log } from 'util';

console.log("------SAGAS LOADED -------")
/**
 * Google Maps request/response handler
 * New implementation of old directionsMap()
 */
export function* getDirections() {
    // Select username from store
    console.log("&&&&&&&&&&&&&&");
    const searchResults = yield select(makeSelectSearchResults());
    const google = yield select(makeSelectGoogle());
    const map = yield select(makeSelectMap());
    const categories = yield select(makeSelectCategories());
    const categoryForDirections = yield(select(makeSelectCategoryForDirections()))

    // if we want to look up directions to all of the categories
    let iterator=[];
    if (categoryForDirections === "all") {
        iterator = Object.keys(categories)  
    } else { // if we only want to look up for a specific category
        iterator.push(categoryForDirections)
    }

console.log(categories)
console.log('categoryForDirections')
console.log(categoryForDirections)
    // repeat the request for each category
    for (let x=0; x < iterator.length; x++){
console.log("XXXXXXXX ITERATOR")
console.log(x)
        // target category 
        const category = iterator[x];
        // make sure searchResults were updated with correct category
console.log(searchResults)
console.log(category)
console.log(categories)
        if (searchResults[category] && searchResults[category].places[categories[category][0]]) {
            const request = {
                origin: searchResults.center.location,
                destination:  searchResults[category].places[categories[category][0]]['geometry']['location'],
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }
console.log('REQUEST')
console.log(request)
            try {   
                const directionResponse = yield call(directionRequest, google, map, request)
                yield put(updateDirectionResults(directionResponse, category));
            } catch (error) {
                console.log('getDirections error: ' + error)
                yield put(updateDirectionResultsERROR(error))
            }
        }
    }
}

export function* directionsData() {
  // Watches for START_UPDATE_DIRECTION_RESULTS actions and calls getDirections when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  console.log("++++++++++++");
  const watcher = yield takeLatest(START_UPDATE_DIRECTION_RESULTS, getDirections);
  console.log("++++++++++++");
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
    directionsData,
];
