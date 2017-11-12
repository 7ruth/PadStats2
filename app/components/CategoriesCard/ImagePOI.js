import styled from 'styled-components';

const ImagePOI = styled.img`
  float: ${props => props.windowWidth > 1024 ? 'left' : 'none'};
  height: ${props => props.windowWidth > 1024 ? '300px' : '180px'};
  padding-left: ${props => props.windowWidth > 1024 ? 'none' : '20px'};
  max-width: 90%;
  
`;

export default ImagePOI;
