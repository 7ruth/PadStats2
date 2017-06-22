/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('googleMap');

const makeSelectAddress = () => createSelector(
  selectGoogleMap,
  (googleMapState) => googleMapState.get('address')
);

export {
  selectGoogleMap,
  makeSelectAddress,
};
