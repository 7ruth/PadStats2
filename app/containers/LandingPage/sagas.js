/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { MAILCHIMP_RESPONSE } from 'containers/App/constants'
import { mailChimpResponse, mailChimpResponseError } from 'containers/App/actions'

import request from 'utils/request'
import { makeSelectSubscribeEmail } from 'containers/LandingPage/selectors'

/**
 * Github repos request/response handler
 */
export function* postMailChimpSubscribe () {
  // Select username from store
  const subscribeEmail = yield select(makeSelectSubscribeEmail())
  const requestURL = `/api/signup`

  var body = {
    'EMAIL': subscribeEmail
  }

  try {
    // Call our request helper (see 'utils/request')
    const response = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    // get mail chimp response and also pass email address for further manipulation
    yield put(mailChimpResponse(response, subscribeEmail))
  } catch (err) {
    yield put(mailChimpResponseError(err))
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* mailChimpSubscribeCycle () {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(MAILCHIMP_RESPONSE, postMailChimpSubscribe)

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

// Bootstrap sagas
export default [
  mailChimpSubscribeCycle
]
