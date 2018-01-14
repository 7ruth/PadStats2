import styled from 'styled-components';

const HeadingDiv = styled.div`
font-size: 45px;
margin-top: 0px;
font-weight: 900;
line-height: 60px;
color: ${props => props.color ? props.color : 'OrangeRed'};
text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden;
textShadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px  1px 0 #000, -1px  0   0 #000;

&:hover {
    color: OrangeRed !important;
}
`;

export default HeadingDiv;