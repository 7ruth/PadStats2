/**
 *
 * Button.react.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { PropTypes, Children } from 'react';


// import A from './A';
import StyledButton from './StyledButton';
import Wrapper from './Wrapper';

function Arrow(props) {
  const button = (
    <StyledButton onClick={props.onClick}>
      {props.children ? Children.toArray(props.children) : ''}
    </StyledButton>
  );

  return (
    <Wrapper>
      {button}
    </Wrapper>
  );
}

Arrow.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default Arrow;
