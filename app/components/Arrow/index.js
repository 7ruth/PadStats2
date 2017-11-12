/**
 *
 * Button.react.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { PropTypes, Children } from 'react';
import ChevronRight from 'react-icons/lib/fa/chevron-right';
import ChevronLeft from 'react-icons/lib/fa/chevron-left';

import StyledButton from './StyledButton';

function Arrow(props) {
  return (
    <StyledButton 
      onClick={props.onClick}
      left={props.left}
      right={props.right} 
      windowWidth={props.windowWidth}
    >
    {props.children ? Children.toArray(props.children) : ''}
    {props.left ? <ChevronLeft /> : <ChevronRight />}
  </StyledButton>
  );  
}

Arrow.propTypes = {
  onClick: PropTypes.string,
  children: PropTypes.node,
  left: PropTypes.string,
  right: PropTypes.string
};

export default Arrow;
