import React from 'react';
import { styled } from '@mui/material/styles';

import theme from '../../lib/_theme';

export const Wrapper = styled('span')`
  color: ${theme.palette.error.main};
  font-size: 21px;
  line-height: 16px;
  margin-left: 4px;
`;

const Required = () => <Wrapper>*</Wrapper>;

export default Required;
