import React, { ReactNode } from 'react';
import styled from 'styled-components';

// Material UI
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// Data
import { backgroundColor } from '../../../../lib/theme';
import OnlineStatus from '../../../_core/OnlineStatus/online-status.component';

interface IFullPageLayout {
  children: ReactNode;
  width?: string;
  maxWidth?: string;
}

const Background = styled.div`
  background: #fafcfe;
  background: linear-gradient(180deg, rgba(189,215,57,1) 304px, ${backgroundColor} 304px, ${backgroundColor} 100%);
`;

const FullPageLayout: React.FC<IFullPageLayout> = ({ children, width = 'auto', maxWidth }) => {
  return (
    <Background>
      <OnlineStatus />
      <Box m={4}>
        {children}
      </Box>
    </Background>
  );
};

export default FullPageLayout;
