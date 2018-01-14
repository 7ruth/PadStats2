import styled from 'styled-components';

const ImagePOI = styled.img`
  float: ${props => props.windowWidth > 1024 ? 'left' : 'none'};
  height: ${props => props.windowWidth > 1024 ? '200px' : '180px'};
  padding-left: ${props => props.windowWidth > 1024 ? 'none' : '20px'};
  max-width: 40%;
  max-height: 100%;
  border: ${props => props.src ? '1px solid midnightblue' : 'none'};
`;

export default ImagePOI;
