import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';

// Components
import FullPageLayout from '../_layout/FullPageLayout/full-page.layout';
import ManageEvaluationsGraphQL from '../../Score/ManageEvaluations/manage-evaluations.graphql';

interface IEvaluatePage {
  match: any;
}

const EvaluatePage: React.FC<IEvaluatePage> = ({ match }) => {
  const { assessmentSessionId } = match.params;

  return (
    <FullPageLayout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ManageEvaluationsGraphQL assessmentSessionId={assessmentSessionId} />
        </Grid>
      </Grid>
    </FullPageLayout>
  );
};

export default EvaluatePage;
