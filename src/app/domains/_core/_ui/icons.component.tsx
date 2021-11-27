import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';

// Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const LargeIcon = styled('img')`
  height: 64px;
  object-fit: contain;
`

export const InlineIcon = styled('span')`
  display: flex;
  align-items: center;

  & > svg {
    margin-right: 8px;
  }
`

interface INotice {
  icon: ReactNode;
  children: ReactNode;
}

export const Notice: React.FC<INotice> = ({ icon, children }) => {
  return <Box display="flex" alignItems="center" style={{ lineHeight: '36px' }}>
    <InlineIcon>{icon}</InlineIcon>
    <Typography style={{ lineHeight: '36px' }}>{children}</Typography>
  </Box>
}
