import React from 'react';
import { useHistory } from 'react-router-dom';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

// Data
import { SESSIONS_TERM } from '../../../lib/constants';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { PageTitle, SectionHeading } from '../../_core/_ui/typography.component';
import { SectionWrapper, Spacer } from '../../_core/_ui/structure.components';
import EditPlayerGraphQL from '../../Player/EditPlayer/edit-player.graphql';
import ManagePlayerContactsGraphQL from '../../PlayerContact/ManagePlayerContacts/manage-player-contacts.graphql';
import Typography from '@material-ui/core/Typography';
import EmailLogListGraphQL from '../../EmailLog/EmailLogList/email-log-list.graphql';
import PlayerAssessmentSessionListGraphQL
  from '../../Player/PlayerAssessmentSessionList/player-assessment-session-list.component';
import { SecondaryButton } from '../../_core/_ui/buttons.component';
import EditPlayerAssessmentGraphQL from '../../Player/EditPlayerAssessment/edit-player-assessment.graphql';
import PlayerScoresGraphQL from '../../Player/PlayerScores/player-scores.graphql';

interface IEditPlayerPage {
  match: any;
}

const EditPlayerPage: React.FC<IEditPlayerPage> = ({ match }) => {
  const history = useHistory()
  const { playerId, playerAssessmentId } = match.params;

  return (
    <DashboardLayout>
      <Box display="flex" mb={2}>
        <PageTitle>Edit Player</PageTitle>
        <Spacer />
        <SecondaryButton
          startIcon={<ArrowBackIosIcon />}
          onClick={() => history.push('/players')}
        >
          Back
        </SecondaryButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionWrapper>
            <EditPlayerGraphQL playerId={playerId} />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12}>
          <SectionWrapper>
            <EditPlayerAssessmentGraphQL playerAssessmentId={playerAssessmentId} />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionWrapper>
            <SectionHeading>Contacts</SectionHeading>
            <ManagePlayerContactsGraphQL playerId={playerId} />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionWrapper>
            <SectionHeading>Emails &amp; Text Messages</SectionHeading>
            <EmailLogListGraphQL playerAssessmentId={playerAssessmentId} />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12}>
          <SectionWrapper>
            <SectionHeading>{SESSIONS_TERM}</SectionHeading>
            <PlayerAssessmentSessionListGraphQL playerAssessmentId={playerAssessmentId} />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12}>
          <SectionWrapper>
            <SectionHeading>Scores</SectionHeading>
            <PlayerScoresGraphQL playerAssessmentId={playerAssessmentId} />
          </SectionWrapper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default EditPlayerPage;
