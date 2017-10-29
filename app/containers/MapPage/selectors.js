/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectMapPage = (state) => state.get('mapPage');

const makeSelectLoaded = () => createSelector(
  selectMapPage,
  (MapPageState) => MapPageState.get('loaded')
);

const makeSelectMap = () => createSelector(
  selectMapPage,
  (MapPageState) => MapPageState.get('map')
);

const makeSelectGoogle = () => createSelector(
  selectMapPage,
  (MapPageState) => MapPageState.get('google')
);

const makeSelectCategories = () => createSelector(
  selectMapPage, // eslint-disable-line
  (MapPageState) => MapPageState.get('categories')
);

const makeSelectSearchResults = () => createSelector(
  selectMapPage, // eslint-disable-line
  (MapPageState) => MapPageState.get('searchResults')
);

export {
  selectMapPage,
  makeSelectLoaded,
  makeSelectMap,
  makeSelectGoogle,
  makeSelectCategories,
  makeSelectSearchResults,
};
