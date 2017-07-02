import React from 'react';
// import GoogleApiComponent from '../../utils/GoogleMapsUtils/GoogleApiComponent';
import GoogleMapTemplate from '../GoogleMapTemplate/index';
import GoogleMapContents from '../GoogleMapContents/index';

export class GoogleMapContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  //
  render() {
    const props = this.props;
    const { google } = this.props;

    return (
      <div>
        <GoogleMapTemplate
          google={google}
          className={'map'}
          visible={false}
        >
          <GoogleMapContents {...props} />
        </GoogleMapTemplate>
      </div>
    );
  }
}

GoogleMapContainer.propTypes = {
  google: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export default GoogleMapContainer;
