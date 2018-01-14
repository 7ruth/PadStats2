import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Logo from './logo.png';
import messages from './messages';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div style={{
        height: "65px"
        }}
      >
        <A href="http://padstats.co/">
          {/* <Img src={Logo} alt="PadStats - Logo" /> */}
          PadStats
        </A>
        <NavBar>
          <HeaderLink to="/">
            <FormattedMessage {...messages.home} />
          </HeaderLink>
          <HeaderLink to="/features">
            <FormattedMessage {...messages.features} />
          </HeaderLink>
          <HeaderLink to="/landingPage">
            <FormattedMessage {...messages.landingPage} />
          </HeaderLink>
          <HeaderLink 
            to="/mapPage"
            style={{
              marginRight: 0
            }}
          >
            <FormattedMessage {...messages.mapPage} />
          </HeaderLink>
        </NavBar>
      </div>
    );
  }
}

export default Header;
