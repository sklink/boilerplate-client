import React from 'react';

// Material UI
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

// Components
import FullPageLayout from '../_layout/FullPageLayout/full-page.layout';
import ReportCardGraphQL from '../../Score/ReportCard/report-card.graphql';

interface IReportCardPage {
  match: any;
}

const ReportCardPage: React.FC<IReportCardPage> = ({ match }) => {
  const { code, playerAssessmentId } = match.params;

  return (
    <FullPageLayout>
      <Container style={{ minWidth: '770px'}}>
        <Paper>
          <ReportCardGraphQL code={code} playerAssessmentId={playerAssessmentId} />
        </Paper>
      </Container>
    </FullPageLayout>
  );
};

export default ReportCardPage;
