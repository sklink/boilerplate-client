import React, { useState } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DescriptionIcon from '@material-ui/icons/Description';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AddItemIcon from '@material-ui/icons/PostAdd';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { PageTitle, SectionHeading, Text } from '../../_core/_ui/typography.component';
import { SectionWrapper, Spacer } from '../../_core/_ui/structure.components';
import PlayerListData from '../../Player/PlayerList/player-list.graphql';
import CreatePlayerData from '../../Player/CreatePlayer/create-player.graphql';
import { CardButton, CardButtonIcon, PrimaryButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import ImportPlayersGraphQL from '../../Player/ImportPlayers/import-players.graphql';
import CompanyPlayerListGraphQL from '../../Player/CompanyPlayerList/company-player-list.graphql';
import { buildSendEmails, getCountHasUnsentType } from '../../../lib/services/email-log.service';

const ManagePlayersPage = () => {
  const [sending, setSending] = useState(false);
  const [activeForm, setActiveForm] = useState();
  const { count, loading, refetch } = getCountHasUnsentType('WELCOME');
  const { sendEmails } = buildSendEmails();

  const HEADERS: any = {
    create: 'Create a Player',
    import: 'Import Players',
    existing: 'Add Existing Players'
  };

  const FORM: any = {
    create: <CreatePlayerData onComplete={() => setActiveForm(null)} />,
    import: <ImportPlayersGraphQL onComplete={() => setActiveForm(null)} />,
    existing: <CompanyPlayerListGraphQL />
  }

  const handleSendWelcomeEmails = () => {
    if (window.confirm('Are you sure you want to send welcome emails?')) {
      setSending(true);

      return sendEmails('WELCOME')
        .then(() => refetch())
        .then(() => setSending(false));
    }
  }

  return (
    <DashboardLayout>
      <PageTitle>Manage Players</PageTitle>
      <Grid container spacing={2}>
        {(count > 0 || loading) && (<Grid item xs={12}>
          <Box display="flex" alignItems="center">
            {loading && <Typography>Checking whether any players need to receive a welcome email...</Typography>}
            {!loading && count > 0 && <Typography>Send welcome emails to {loading ? '...' : count} players that have not received one</Typography>}
            <Spacer />
            <PrimaryButton disabled={loading || sending} endIcon={<SendIcon />} onClick={() => handleSendWelcomeEmails()}>Send Welcome Emails</PrimaryButton>
          </Box>
        </Grid>)}
        <Grid item xs={12}>
          <SectionWrapper>
            <PlayerListData />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12}>
          <SectionWrapper>
            {!activeForm && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <CardButton onClick={() => setActiveForm('import')}>
                    <CardButtonIcon><DescriptionIcon color="primary" /></CardButtonIcon>
                    <SectionHeading>Import Player Data</SectionHeading>
                    <Text>(CSV)</Text>
                  </CardButton>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CardButton onClick={() => setActiveForm('create')}>
                    <CardButtonIcon><AddItemIcon color="primary" /></CardButtonIcon>
                    <SectionHeading>Create a Player</SectionHeading>
                    <Text>(Manual Entry)</Text>
                  </CardButton>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CardButton onClick={() => setActiveForm('existing')}>
                    <CardButtonIcon><GroupAddIcon color="primary" /></CardButtonIcon>
                    <SectionHeading>Add Existing Players</SectionHeading>
                    <Text>(From Another Assessment)</Text>
                  </CardButton>
                </Grid>
              </Grid>
            )}
            {activeForm && (<>
              <Box mb={2} display="flex" alignItems="center">
                <SectionHeading style={{ margin: 0 }}>{HEADERS[activeForm]}</SectionHeading>
                <Spacer />
                <SecondaryButton
                  onClick={() => setActiveForm(null)}
                  startIcon={<ArrowBackIosIcon />}
                >Back</SecondaryButton>
              </Box>
              <Divider />
              {FORM[activeForm]}
            </>)}
          </SectionWrapper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default ManagePlayersPage;
