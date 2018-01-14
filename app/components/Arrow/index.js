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
import ChevronUp from 'react-icons/lib/fa/chevron-up';

import StyledButton from './StyledButton';

function Arrow(props) {
  const icons = {
    leftArrow: <ChevronLeft />,
    rightArrow: <ChevronRight />,
    topArrow: <ChevronUp />
  };
  
  return (
    <StyledButton 
      onClick={props.onClick}
      left={props.left}
      right={props.right} 
      windowWidth={props.windowWidth}
      style={props.style}
    >
    {props.children ? Children.toArray(props.children) : ''}
    {props.icon ? icons[props.icon] : ''}
  </StyledButton>
  );  
}

Arrow.propTypes = {
  children: PropTypes.node,
  left: PropTypes.string,
  right: PropTypes.string,
  onClick: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
};

export default Arrow;
