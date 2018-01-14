import styled from 'styled-components';

const MenuDiv = styled.div`
  display: flex;
  flex: 0 0 100%;
  order: 1;
  justify-content: space-between;
  minHeight: 40px;
  maxHeight: 400px;
  position: relative;
  

  .addressInputForm {
    width: 70%;
    font-size: 2em;  
    font-weight: bold;
    color: midnightblue;
    font-weight: 600;
    border-radius: 4px;
    border: solid rgb(250,250,250) 2px;

    &:hover {
        border: solid OrangeRed 2px;
    }
  }

  .addressInput {
    width: 100%;
    
    &:focus {
        outline: 0;
        &::-webkit-input-placeholder
        {
            opacity: 0;  
        }
    }
    
    &::-webkit-input-placeholder
    {
        color: OrangeRed;
        opacity: 1; 
        font-weight: 600; 
    }

  }
`;

export default MenuDiv;

// OrangeRed (highlight/ call to action) -> Tomato (secondary bright color)
// MidnightBlue (substibute of black)
// CornflowerBlue (shadow for midnightblue)

// DarkSlateBlue
// OrangeRed
// DarkBlue
// DarkSlateBlue
// DarkViolet
// CornflowerBlue 
// BlueViolet  

// Crimson
// DarkOrange
// DarkTurquoise 