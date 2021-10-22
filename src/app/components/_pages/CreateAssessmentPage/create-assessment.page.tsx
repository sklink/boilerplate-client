import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { PageTitle } from '../../_core/_ui/typography.component';
import { SectionWrapper } from '../../_core/_ui/structure.components';
import CreateAssessmentGraphQL from '../../Assessment/CreateAssessment/create-assessment.graphql';

const CreateAssessmentPage = () => {
  return (
    <DashboardLayout>
      <PageTitle>Create New Assessment</PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionWrapper>
            <CreateAssessmentGraphQL />
          </SectionWrapper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default CreateAssessmentPage;
