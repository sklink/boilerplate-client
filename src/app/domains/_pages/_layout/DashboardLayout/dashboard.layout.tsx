import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { styled } from '@mui/material/styles';

// Material UI
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddCircle';

// Data
import theme from '../../../../lib/_theme';

// Components
import DashboardSidebar, { isContextCollapsedVar } from './dashboard-sidebar.component';
import DashboardNav, { isNavCollapsedVar } from './dashboard-nav.component';
import AssessmentSelectorGraphQL from '../../../project/components/_ProjectSelector/assessment-selector.graphql';
import OnlineStatus from '../../../_core/OnlineStatus/online-status.component';

interface DashboardProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

const FullMainWrapper = styled('div')`
  box-shadow: 0 0 24px 8px rgba(0,0,0,0.05);
  padding: 24px;
  background: #fff;
  height: auto;
  min-height: 100%;
`

const DashboardLayout: React.FC<DashboardProps> = ({ children, hideSidebar }) => {
  const isNavCollapsed = useReactiveVar(isNavCollapsedVar);
  const isContextCollapsed = useReactiveVar(isContextCollapsedVar);
  const history = useHistory();

  let content = (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box pb={3}>{children}</Box>
      </Grid>
    </Grid>
  );

  if (hideSidebar) {
    content = (
      <Box flexGrow={1} pl={isNavCollapsed ? 8 : 22.5} boxSizing="border-box" maxWidth="100%">
        <FullMainWrapper>
          <Box width="300px" display="flex" alignItems="center">
            <Box flexGrow={1} mr={1}><AssessmentSelectorGraphQL /></Box>
            <IconButton onClick={() => history.push('/assessments/create')} size="large">
              <AddIcon style={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Box>
          <Box>{content}</Box>
        </FullMainWrapper>
      </Box>
    )
  } else {
    let pl = 64.375;
    if (isNavCollapsed) pl -= 14.5;
    if (isContextCollapsed) pl -= 35.875;

    content = (
      <Box px={4} py={2} flexGrow={1} pl={pl} boxSizing="border-box" maxWidth="100%">
        {content}
      </Box>
    );
  }

  return (
    <>
      <OnlineStatus />
      <Box display="flex" height="100%" width="100%">
        <DashboardNav />
        {!hideSidebar && <DashboardSidebar />}
        {content}
      </Box>
    </>
  );
};

export default DashboardLayout;
