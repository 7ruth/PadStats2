/**
 * Google Map calls
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { UPDATE_DIRECTION_RESULTS } from './constants';
// import { reposLoaded, repoLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectSearchResults } from './selectors';

console.log("------SAGAS LOADED -------")
/**
 * Google Maps request/response handler
 * New implementation of old directionsMap()
 */
export function* getDirections() {
    // Select username from store

    console.log("&&&&&&&&&&&&&&");
    const searchResults = yield select(makeSelectSearchResults());
    
    console.log(searchResults);
    // lookupDirections(google, map, request) {
    //     return new Promise((resolve, reject) => {
    //       const directionsService = new google.maps.DirectionsService(map);
    //       directionsService.route(request, (results, status, pagination) => {
    //         if (status == google.maps.places.PlacesServiceStatus.OK) {
    //           resolve(results, pagination);
    //         } else {
    //           reject(results, status);
    //         }
    //       })
    //     });
    //   }


    try {
      // Call our request helper (see 'utils/request')
      const repos = yield call(request, requestURL);

      yield put(reposLoaded(repos, username));
    } catch (err) {
      yield put(repoLoadingError(err));
    }
}

/**
 * Github repos request/response handler
 */
// export function* getRepos() {
//   // Select username from store
//   const username = yield select(makeSelectUsername());
//   const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

//   try {
//     // Call our request helper (see 'utils/request')
//     const repos = yield call(request, requestURL);
//     yield put(reposLoaded(repos, username));
//   } catch (err) {
//     yield put(repoLoadingError(err));
//   }
// }

/**
 * Root saga manages watcher lifecycle
 */
export function* directionsData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  console.log("++++++++++++");
  const watcher = yield takeLatest(UPDATE_DIRECTION_RESULTS, getDirections);
  console.log("++++++++++++");
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
    directionsData,
];
