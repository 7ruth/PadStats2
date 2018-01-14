import styled from 'styled-components'

import NormalA from 'components/A'

const A = styled(NormalA)`
  textDecoration: none;
//   color: MidnightBlue;
//   text-shadow: 1px 1px 1px CornflowerBlue;
//   fontSize: 3.3em;
//   font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
//   font-weight: bold;
  
  &:hover {
    color: OrangeRed !important;
  }
`
// OrangeRed
// DarkBlue
// DarkSlateBlue
// DarkViolet
// CornflowerBlue 
// BlueViolet  

// Crimson
// DarkOrange
// DarkTurquoise 

export default A
