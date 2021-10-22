import React from 'react';
import { useHistory } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

// Material UI
import Grid from '@material-ui/core/Grid';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Data
import { DRILL_FIELDS } from '../../../lib/queries/drill.queries';

// Components
import { PageTitle } from '../../_core/_ui/typography.component';
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { Spacer } from '../../_core/_ui/structure.components';
import { SecondaryButton } from '../../_core/_ui/buttons.component';
import CreateDrillGraphQL from '../../Drill/CreateDrill/create-drill.graphql';

interface IEditDrillPage {
  match: any;
}

const GET_DRILL = gql`
  query GetDrill($_id: ID!) {
    drill(_id: $_id) {
      ...DrillFields
      skillSets {
        positionIds
        skillIds
      }
      companyId
    }
  }

  ${DRILL_FIELDS}
`

const EditDrillPage: React.FC<IEditDrillPage> = ({ match }) => {
  const history = useHistory();
  const { drillId } = match.params;

  const { data, error, loading } = useQuery(GET_DRILL, {
    variables: { _id: drillId },
    fetchPolicy: 'cache-and-network'
  });

  const drill = data && data.drill;

  return (
    <DashboardLayout hideSidebar>
      <Box display="flex" mb={2}>
        <PageTitle>Edit Drill</PageTitle>
        <Spacer />
        <SecondaryButton
          startIcon={<ArrowBackIosIcon />}
          onClick={() => history.push('/drills')}
        >
          Back
        </SecondaryButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {!drill && <Typography>Loading...</Typography>}
          {drill && <CreateDrillGraphQL drill={drill} />}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default EditDrillPage;
