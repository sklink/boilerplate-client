import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Material UI
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddItemIcon from '@material-ui/icons/PostAdd';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { PageTitle, SectionHeading, Text } from '../../_core/_ui/typography.component';
import { SectionWrapper, Spacer } from '../../_core/_ui/structure.components';
import { CardButton, CardButtonIcon, SecondaryButton } from '../../_core/_ui/buttons.component';
import SkillGroupNavigationGraphQL from '../../Skill/SkillGroupNavigation/skill-group-navigation.graphql';
import CreatePracticePlanGraphQL from '../../PracticePlan/CreatePracticePlan/create-practice-plan.graphql';
import PracticePlanListData from '../../PracticePlan/PracticePlanList/practice-plan-list.graphql';

const ManagePracticePlanPage = () => {
  const history = useHistory();
  const [activeForm, setActiveForm] = useState();
  const HEADERS: any = {
    create: 'Create a Practice Plan',
  };

  const FORM: any = {
    create: <CreatePracticePlanGraphQL />,
  }

  return (
    <DashboardLayout hideSidebar>
      <PageTitle>Evaluation Standards</PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <SkillGroupNavigationGraphQL currentLocation={history.location.pathname} />
        </Grid>
        <Grid item xs={12}>
          <SectionWrapper>
            <PracticePlanListData />
          </SectionWrapper>
        </Grid>
        <Grid item xs={12}>
          <SectionWrapper>
            {!activeForm && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <CardButton onClick={() => setActiveForm('create')}>
                    <CardButtonIcon><AddItemIcon color="primary" /></CardButtonIcon>
                    <SectionHeading>Create a Practice Plan</SectionHeading>
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

export default ManagePracticePlanPage;
