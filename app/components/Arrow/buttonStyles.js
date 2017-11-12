import { css } from 'styled-components';

const buttonStyles = css`
  position: absolute;
  height: 100%;
  align-items: center;
  justify-content: center;
  left: ${props => props.left ? props.left : 'auto'};
  right: ${props => props.right ? props.right : 'auto'};
  vertical-align: middle;
  box-sizing: border-box;
  padding: 0.25em 2em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 3em;
  color: #41addd;

  &:active {
    background: #41addd;
    color: #fff;
  }
`;

export default buttonStyles;
