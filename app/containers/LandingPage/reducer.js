/*
 * LandingPageReducer
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
  CHANGE_SUBSCRIBEEMAIL,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  subscribeEmail: '',
});

function LandingPageReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SUBSCRIBEEMAIL:

      // Delete prefixed '@' from the github username
      return state
        .set('subscribeEmail', action.subscribeEmail.replace('/@/gi', ''));
    default:
      return state;
  }
}

export default LandingPageReducer;
