import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

// Components
import { SectionHeading } from '../../_core/_ui/typography.component';
import { SectionWrapper } from '../../_core/_ui/structure.components';
import CheckInGraphQL from '../../Session/CheckIn/check-in.graphql';
import CreatePlayerData from '../../Player/CreatePlayer/create-player.graphql';
import FullPageLayout from '../_layout/FullPageLayout/full-page.layout';

interface ICheckInPage {
  match: any;
}

const CheckInPage: React.FC<ICheckInPage> = ({ match }) => {
  const { assessmentSessionId } = match.params;

  return (
    <FullPageLayout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CheckInGraphQL assessmentSessionId={assessmentSessionId} />
        </Grid>
        <Box my={2}><Divider /></Box>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2}>
              <SectionHeading>Create a New Player</SectionHeading>
              <SectionWrapper><CreatePlayerData /></SectionWrapper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </FullPageLayout>
  );
};

export default CheckInPage;
