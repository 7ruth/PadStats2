/*
 * LandingPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react'
import Helmet from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { makeSelectRepos, makeSelectLoading, makeSelectError, makeSelectMailChimpResponse, makeSelectCurrentUser } from 'containers/App/selectors'
import H2 from 'components/H2'
import MailChimpMessageBox from 'components/MailChimpMessageBox'
import CenteredSection from './CenteredSection'
import Form from './Form'
import Input from './Input'
import Img from './Img'
import Div from './Div'
import DivMainDescription from './DivMainDescription'
import P from './P'
import WelcomeToSuburbia from './welcomeToSuburbia2.jpg'
import messages from './messages'
import { submitMailChimp } from '../App/actions'
import { changeSubscribeEmail } from './actions'
import { makeSelectSubscribeEmail } from './selectors'

export class LandingPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount () {
    if (this.props.subscribeEmail && this.props.subscribeEmail.trim().length > 0) {
      this.props.onSubmitForm()
    }
  }

  render () {
    const { loading, error, currentUser, mailChimpResponse } = this.props
    const mailChimpMessageBoxProps = {
      loading,
      error,
      currentUser,
      mailChimpResponse
    }

    return (
      <article>
        <Helmet
          title='Landing Page'
          meta={[
            { name: 'description', content: 'PadStats, we help you find an ideal location for your next home.' }
          ]}
        />
        <div>
          <CenteredSection>
            <H2>
              <Div>
                <FormattedMessage {...messages.startProjectHeader} />
                <P>
                  <FormattedMessage {...messages.startProjectSlogan} />
                </P>
              </Div>
              <Img src={WelcomeToSuburbia} alt='Welcome to suberbia' />
            </H2>
          </CenteredSection>
          <DivMainDescription>
            <FormattedMessage {...messages.startProjectMessage} />
          </DivMainDescription>
          <CenteredSection>
            <H2>
              <FormattedMessage {...messages.trymeMessage} />
              <Form onSubmit={this.props.onSubmitForm}>
                <label htmlFor='subscribeEmail'>
                  <Input
                    id='subscribeEmail'
                    type='text'
                    placeholder='Whats your email?'
                    value={this.props.subscribeEmail}
                    onChange={this.props.onChangeSubscribeEmail}
                  />
                </label>
              </Form>
            </H2>
            <MailChimpMessageBox {...mailChimpMessageBoxProps} />
          </CenteredSection>
        </div>
      </article>
    )
  }
}

LandingPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool
  ]),
  currentUser: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  mailChimpResponse: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool
  ]),
  onSubmitForm: React.PropTypes.func,
  subscribeEmail: React.PropTypes.string,
  onChangeSubscribeEmail: React.PropTypes.func
}

export function mapDispatchToProps (dispatch) {
  return {
    onChangeSubscribeEmail: (evt) => dispatch(changeSubscribeEmail(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault()
      dispatch(submitMailChimp())
    }
  }
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  mailChimpResponse: makeSelectMailChimpResponse(),
  subscribeEmail: makeSelectSubscribeEmail(),
  currentUser: makeSelectCurrentUser(),
  loading: makeSelectLoading(),
  error: makeSelectError()
})

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
