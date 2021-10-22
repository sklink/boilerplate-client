import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import styled from 'styled-components';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircle';

// Components
import DashboardSidebar, { isContextCollapsedVar } from './dashboard-sidebar.component';
import DashboardNav, { isNavCollapsedVar } from './dashboard-nav.component';
import AssessmentSelectorGraphQL from '../../../Assessment/AssessmentSelector/assessment-selector.graphql';
import { mainColor } from '../../../../lib/theme';
import { SectionWrapper } from '../../../_core/_ui/structure.components';
import OnlineStatus from '../../../_core/OnlineStatus/online-status.component';

interface DashboardProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

const FullMainWrapper = styled.div`
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
            <IconButton onClick={() => history.push('/assessments/create')}>
              <AddIcon style={{ color: mainColor }} />
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
