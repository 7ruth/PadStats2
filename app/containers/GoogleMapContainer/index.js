import React from 'react'
import * as config from '../../utils/GoogleMapsUtils/config'
import GoogleApiComponent from '../../utils/GoogleMapsUtils/GoogleApiComponent'
import GoogleMap from '../GoogleMap/index'

export class GoogleMapContainer extends React.Component {

  render () {
    return (
      <div>
        <GoogleMap google={this.props.google}>
        </GoogleMap>
      </div>
    )
  }
}

let key = config.getGoogleKey()
export default GoogleApiComponent({
  apiKey: key
})(GoogleMapContainer)
