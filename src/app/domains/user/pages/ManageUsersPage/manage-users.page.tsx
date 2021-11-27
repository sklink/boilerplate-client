import React from 'react';

// Material UI
import Grid from '@mui/material/Grid';

// Components
import DashboardLayout from '../../../../components/_pages/_layout/DashboardLayout/dashboard.layout';
import { PageTitle } from '../../../../components/_core/_ui/typography.component';
import InviteListContainer from '../../../invite/components/_InviteList/invite-list.container';
import InviteFormContainer from '../../../invite/components/_InviteForm/invite-form.container';
import { SectionWrapper } from '../../../../components/_core/_ui/structure.components';
import MemberListGraphQL from '../../../member/components/_MemberList/member-list.graphql';
import AssessmentInfoGraphQL from '../../Assessment/AssessmentInfo/assessment-info.graphql';

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
        <Grid item xs={12}>
          <AssessmentInfoGraphQL />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default ManageUsersPage;
