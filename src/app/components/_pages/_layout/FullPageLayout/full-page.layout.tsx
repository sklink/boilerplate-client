import React, { ReactNode } from 'react';
import styled from 'styled-components';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

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
