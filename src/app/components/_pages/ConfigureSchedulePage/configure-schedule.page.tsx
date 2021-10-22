import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { PageTitle } from '../../_core/_ui/typography.component';
import AssessmentStageBuilderGraphQL
  from '../../AssessmentStage/AssessmentStageBuilder/assessment-stage-builder.graphql';
import { SectionWrapper } from '../../_core/_ui/structure.components';

const ConfigureSchedulePage = () => {
  return (
    <DashboardLayout hideSidebar>
      <PageTitle>Configure Schedule</PageTitle>
      <SectionWrapper>
        <AssessmentStageBuilderGraphQL />
      </SectionWrapper>
    </DashboardLayout>
  );
};

export default ConfigureSchedulePage;
