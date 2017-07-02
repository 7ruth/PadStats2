/*
 * HomeReducer
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
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loaded: '(@)_(@)',
  map: null,
  google: null,
});

function MapPageReducer(state = initialState, action) {
  switch (action.type) {
    case GOOGLE_API_LOADED:

      return state
        .set('loaded', action.loaded)
        .set('map', action.map)
        .set('google', action.google);
    default:
      return state;
  }
}

export default MapPageReducer;
