import React from 'react';
import { styled } from '@mui/material/styles';

import { dangerColor } from '../../lib/theme';

export const Wrapper = styled('span')`
  color: ${dangerColor};
  font-size: 21px;
  line-height: 16px;
  margin-left: 4px;
`;

const Required = () => <Wrapper>*</Wrapper>;

export default Required;
