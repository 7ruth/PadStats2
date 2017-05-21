import React, { PropTypes } from 'react'

import List from 'components/List'
import ListItem from 'components/ListItem'
import LoadingIndicator from 'components/LoadingIndicator'

function MailChimpMessageBox ({ loading, error, currentUser, mailChimpResponse }) {
  console.log('----------------------------')
  console.log("loadin: " + loading)
  console.log("error: " + error)
  console.log("currentUser: " + currentUser)
  console.log("mailChimpResponse: " + mailChimpResponse)

  console.dir(mailChimpResponse)
  // if there was a response
  if (mailChimpResponse) {
      // if email was already used
      if (JSON.parse(mailChimpResponse.text).title) {
        const ResponseTextComponent = () => (
          <ListItem item={'Please use another email address.'} />
        )
        return <List component={ResponseTextComponent} />
      }
      // if sign up was successful
      if (JSON.parse(mailChimpResponse.text).email_address === currentUser) {
        const ResponseTextComponent = () => (
          <ListItem item={'Thank you for signing up. We are looking forward to delivering relevant and actionable real estate analytics right to your inbox.'} />
        )
        return <List component={ResponseTextComponent} />
      }
  }

  if (loading) {
    return <List component={LoadingIndicator} />
  }

  if (error !== false) {
    const ErrorComponent = () => (
      <ListItem item={'Something went wrong, please try again!!'} />
    )
    return <List component={ErrorComponent} />
  }

  return null
}

MailChimpMessageBox.propTypes = {
  loading: PropTypes.bool,
  currentUser: PropTypes.any,
  error: PropTypes.any,
  mailChimpResponse: PropTypes.any
}

export default MailChimpMessageBox
