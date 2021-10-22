import React from 'react';
import { useHistory } from 'react-router-dom';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


// Data
import { SESSION_TERM } from '../../../lib/constants';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { PageTitle, SectionHeading } from '../../_core/_ui/typography.component';
import { SectionWrapper, Spacer } from '../../_core/_ui/structure.components';
import EditAssessmentSessionGraphQL from '../../Session/EditAssessmentSession/edit-assessment-session.graphql';
import Typography from '@material-ui/core/Typography';
import AssessmentSessionDrillList
  from '../../Session/AssessmentSessionDrillList/assessment-session-drill-list.component';
import AssessmentSessionPracticePlanList
  from '../../Session/AssessmentSessionPracticePlanList/assessment-session-practice-plan-list.component';
import AssessmentSessionPlayerAssessmentList
  from '../../Session/AssessmentSessionPlayerList/assessment-session-player-list.component';
import { SecondaryButton } from '../../_core/_ui/buttons.component';
import AssessmentSessionUpcomingNotificationsGraphQL
  from '../../Session/AssessmentSessionUpcomingNotifications/assessment-session-upcoming-notifications.graphql';

interface IEditAssessmentSessionPage {
  match: any;
}

const EditAssessmentSessionPage: React.FC<IEditAssessmentSessionPage> = ({ match }) => {
  const history = useHistory();
  const { assessmentSessionId } = match.params;

  return (
    <DashboardLayout>
      <Box display="flex" mb={2}>
        <PageTitle>Edit {SESSION_TERM}</PageTitle>
        <Spacer />
        <SecondaryButton
          startIcon={<ArrowBackIosIcon />}
          onClick={() => history.push('/sessions')}
        >
          Back
        </SecondaryButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionWrapper>
            <EditAssessmentSessionGraphQL assessmentSessionId={assessmentSessionId} />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionWrapper>
            <SectionHeading>Players</SectionHeading>
            <AssessmentSessionPlayerAssessmentList assessmentSessionId={assessmentSessionId} />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionWrapper>
            <SectionHeading>Upcoming Notifications</SectionHeading>
            <AssessmentSessionUpcomingNotificationsGraphQL assessmentSessionId={assessmentSessionId} />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionWrapper>
            <SectionHeading>Practice Plans</SectionHeading>
            <AssessmentSessionPracticePlanList assessmentSessionId={assessmentSessionId} />

            <SectionHeading>Drills</SectionHeading>
            <AssessmentSessionDrillList assessmentSessionId={assessmentSessionId} />
          </SectionWrapper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default EditAssessmentSessionPage;
