/**
 * Homepage selectors
 */

import { createSelector } from 'reselect'

const selectLandingPage = (state) => state.get('landing')

const makeSelectSubscribeEmail = () => createSelector(
  selectLandingPage,
  (LandingState) => LandingState.get('subscribeEmail')
)

export {
  selectLandingPage,
  makeSelectSubscribeEmail
}
