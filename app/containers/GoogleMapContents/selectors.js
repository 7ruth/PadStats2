/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('googleMap'); // eslint-disable-line

const makeSelectAddress = () => createSelector(
  selectGoogleMap, // eslint-disable-line
  (googleMapState) => googleMapState.get('address')
);

export {
  selectGoogleMap, // eslint-disable-line
  makeSelectAddress,
};
