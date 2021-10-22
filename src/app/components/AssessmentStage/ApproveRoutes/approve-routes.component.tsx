import _ from 'lodash';import React from 'react';
import Select from 'react-select';

// Material UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

// Components
import { SectionWrapper, Spacer } from '../../_core/_ui/structure.components';
import ManageItemsListContainer from '../../_core/ManageItemsList/manage-items-list.container';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { numToTime, toWeighted } from '../../../lib/helpers/conversion.helpers';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { Link } from 'react-router-dom';

interface IApproveRoutes {
  routeSets: { [key: string]: IPlayerAssessment[] };
  routes: IAssessmentStageRoutePlan[];
  playerAssessments: IPlayerAssessment[];
  playerAssessmentsById: { [key: string]: IPlayerAssessment };
  onSubmit: Function;
  loading: boolean;
  fetchError: boolean;
  removePlayerAssessment: Function;
  addPlayerAssessment: Function;
  hasSubmitted: boolean
}

const ROUTE_HEADINGS: { [key: string]: string } = {
  HOLD: 'Hold from Next Grouping',
  CONCLUDE: 'Conclude Player Assessment'
};

const ApproveRoutes: React.FC<IApproveRoutes> = ({
  routeSets,
  routes,
  playerAssessments,
  playerAssessmentsById,
  onSubmit,
  loading,
  fetchError,
  removePlayerAssessment,
  addPlayerAssessment,
  hasSubmitted
}) => {
  if (loading && !routes.length) return <Typography>Loading...</Typography>;
  if (fetchError && !routes.length) return <Typography>Unable to approve routes at this time. Please try again later</Typography>;
  if (hasSubmitted) return <Typography>Players have been scheduled with the configured ice times</Typography>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box mt={2} display="flex" alignItems="center">
          <Typography>The routes below have been generated based the <Link to="/format">schedule format</Link></Typography>
          <Spacer />
          <PrimaryButton disabled={hasSubmitted} onClick={() => onSubmit(routeSets)}>Approve Routes & Schedule Notifications</PrimaryButton>
        </Box>
      </Grid>
      {_.map(routeSets, (group, action) => {
        return (
          <Grid item xs={12} md={4} key={action}>
            <SectionWrapper>
              <Typography variant="subtitle1">{ROUTE_HEADINGS[action]}</Typography>

              <Box mb={2}><Divider /></Box>

              <Typography variant="subtitle2" gutterBottom>Players</Typography>
              <ManageItemsListContainer
                entity="player"
                options={playerAssessments}
                itemLabel={(item: IPlayerAssessment) => `${item.player.lastName}, ${item.player.firstName} - ${item.position.name} - ${toWeighted(item.weightedScore)}`}
                selectedItems={group || []}
                addItem={(item: IPlayerAssessment) => addPlayerAssessment(item, action)}
              >
                {(playerAssessment: IPlayerAssessment) => {
                  const currPlayerAssessment = playerAssessmentsById[playerAssessment._id];

                  return (
                    <ListItem key={playerAssessment._id}>
                      <ListItemText
                        primary={<Box display="flex" pr={2}>
                          <Typography>{playerAssessment.player.lastName}, {playerAssessment.player.firstName}</Typography>
                          <Spacer/>
                          <Typography>{toWeighted(currPlayerAssessment.weightedScore)}</Typography>
                        </Box>}
                        secondary={playerAssessment.position.name}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete"
                                    onClick={() => removePlayerAssessment(playerAssessment, action)}>
                          <DeleteIcon/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                }}
              </ManageItemsListContainer>
            </SectionWrapper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ApproveRoutes;
