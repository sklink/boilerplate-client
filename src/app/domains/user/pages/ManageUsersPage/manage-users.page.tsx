import React from 'react';

// Material UI
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Components
import DashboardLayout from '../../../_pages/_layout/DashboardLayout/dashboard.layout';
import { PageTitle } from '../../../_core/_ui/typography.component';
import InviteListContainer from '../../../invite/components/_InviteList/invite-list.container';
import InviteFormContainer from '../../../invite/components/_InviteForm/invite-form.container';
import { SectionWrapper } from '../../../_core/_ui/structure.components';
import MemberListGraphQL from '../../../member/components/_MemberList/member-list.graphql';

const ManageUsersPage = () => {
  return (
    <DashboardLayout hideSidebar>
      <PageTitle>Manage Users</PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionWrapper>
            <MemberListGraphQL />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionWrapper>
            <Typography variant="h5">Send an Invite</Typography>
            <InviteFormContainer />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionWrapper>
            <Typography variant="h5">Pending Invites</Typography>
            <InviteListContainer />
          </SectionWrapper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default ManageUsersPage;
