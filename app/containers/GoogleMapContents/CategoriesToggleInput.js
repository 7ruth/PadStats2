import styled from 'styled-components';

const CategoriesToggleInput = styled.input`
    text-decoration: none;
    border-radius: 4px;
    -webkit-font-smoothing: antialiased;
    -webkit-touch-callout: none;
    user-select: none;
    cursor: pointer;
    outline: 0;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 600;
    font-size: 2em;
    color: OrangeRed;
    
    &:active {
      background: #41ADDD;
      color: #FFF;
    }
  
    &:hover {
      background: OrangeRed;
      color: white;
    }

    $:focus {
        background-color: red;
    }

    // text-align: center;
    // position: absolute;
    // right: 0px;
    // color: MidnightBlue;
    // font-weight: bold;
    // font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

export default CategoriesToggleInput;
