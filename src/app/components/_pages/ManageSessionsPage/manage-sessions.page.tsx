import React, { useState } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DescriptionIcon from '@material-ui/icons/Description';
import AddItemIcon from '@material-ui/icons/PostAdd';

// Data
import { SESSION_TERM } from '../../../lib/constants';
import { pluralTerm } from '../../../lib/helpers/term.helper';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { PageTitle, SectionHeading, Text } from '../../_core/_ui/typography.component';
import { SectionWrapper, Spacer } from '../../_core/_ui/structure.components';
import { CardButton, CardButtonIcon, SecondaryButton } from '../../_core/_ui/buttons.component';
import ImportSessionsGraphQL from '../../Session/ImportSessionData/import-session.graphql';
import CreateSessionData from '../../Session/CreateAssessmentSession/create-assessment-session.graphql';
import AssessmentSessionListData from '../../Session/AssessmentSessionList/assessment-session-list.graphql';

const ManageSessionPage = () => {
  const [activeForm, setActiveForm] = useState();
  const HEADERS: any = {
    create: `Create an ${SESSION_TERM}`,
    import: `Import ${pluralTerm(SESSION_TERM)}`,
  };

  const FORM: any = {
    create: <CreateSessionData onComplete={() => setActiveForm(null)} />,
    import: <ImportSessionsGraphQL onComplete={() => setActiveForm(null)} />
  }

  return (
    <DashboardLayout>
      <PageTitle>Manage {pluralTerm(SESSION_TERM)}</PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionWrapper>
            <AssessmentSessionListData />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12}>
          <SectionWrapper>
            {!activeForm && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <CardButton onClick={() => setActiveForm('import')}>
                    <CardButtonIcon><DescriptionIcon color="primary" /></CardButtonIcon>
                    <SectionHeading>Import {SESSION_TERM} Data</SectionHeading>
                    <Text>(CSV)</Text>
                  </CardButton>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CardButton onClick={() => setActiveForm('create')}>
                    <CardButtonIcon><AddItemIcon color="primary" /></CardButtonIcon>
                    <SectionHeading>Create an {SESSION_TERM}</SectionHeading>
                    <Text>(Manual Entry)</Text>
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

export default ManageSessionPage;
