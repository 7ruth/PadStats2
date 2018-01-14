import styled from 'styled-components';

const CheckboxesWrapper = styled.div`
    width: 50%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    
    label {
        text-shadow:
        -1px -1px 0 midnightblue,
         0   -1px 0 midnightblue,
         1px -1px 0 midnightblue,
         1px  0   0 midnightblue,
         1px  1px 0 midnightblue,
         0    1px 0 midnightblue,
        -1px  1px 0 midnightblue,
        -1px  0   0 midnightblue;
    }
    
    .Select.is-open .Select-input {
        padding: 0 !important;
        text-align: center;
    }
      
    .Select.is-open .Select-input input {
        text-indent: 10px;
    }

    .Select-multi-value-wrapper {
        display: flow-root;
        position: relative !important;
    }

    .Select-value {
        position: absolute !important;
        bottom: 0 !important;
    }
`;

export default CheckboxesWrapper;