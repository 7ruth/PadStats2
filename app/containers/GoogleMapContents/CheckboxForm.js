import styled from 'styled-components';
import { media } from '../../global-styles';

const CheckboxForm = styled.form`
    display:inline;
    margin: 10px auto;
    font-size: 30px;
    width: 100%;
    color: MidnightBlue;

    input[type="checkbox"] {
      height: 17px;
      margin-right: 10px;
      margin-left: 40px;
      transform: scale(1.5);
    }

    label {
      // float: left;
      // width: ${props => props.alignment ? "100%" : "auto"};
      // display: ${props => props.alignment ? "inline-block" : "inherit"};
    }

    ${media.handheld`
      font-size: 25px;

      label {
        display: block;
        float: none;
        margin-left: 10px;
      }

      input[type="checkbox"]{
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin: 0;
        margin-right: 10px;
      }
    `}



`;

export default CheckboxForm;
