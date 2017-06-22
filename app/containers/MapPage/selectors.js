/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectMapPage = (state) => state.get('mapPage');

const makeSelectSubscribeEmail = () => createSelector(
  selectMapPage,
  (LandingState) => LandingState.get('subscribeEmail')
);

export {
  selectMapPage,
  makeSelectSubscribeEmail,
};
