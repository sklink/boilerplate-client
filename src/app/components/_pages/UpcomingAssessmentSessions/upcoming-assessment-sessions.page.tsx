import React  from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { PageTitle } from '../../_core/_ui/typography.component';
import { SectionWrapper } from '../../_core/_ui/structure.components';
import UpcomingAssessmentSessionsGraphQL from '../../Session/UpcomingAssessmentSessions/upcoming-assessment-sessions.graphql';

const UpcomingAssessmentSessionsPage = () => {
  return (
    <DashboardLayout>
      <PageTitle>Upcoming Evaluations</PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionWrapper>
            <UpcomingAssessmentSessionsGraphQL />
          </SectionWrapper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default UpcomingAssessmentSessionsPage;
