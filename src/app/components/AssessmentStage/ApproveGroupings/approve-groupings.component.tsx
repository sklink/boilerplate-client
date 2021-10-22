import React from 'react';
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
import { IFinalizeSessionFields } from './approve-groupings.interface';
import { numToTime, toWeighted } from '../../../lib/helpers/conversion.helpers';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { Link } from 'react-router-dom';
import { Bold } from '../../_core/_ui/typography.component';

interface IApproveGroupings {
  sessionSets: IFinalizeSessionFields[];
  plans: IAssessmentStagePlan[];
  playerAssessments: IPlayerAssessment[];
  playerAssessmentsById: { [key: string]: IPlayerAssessment };
  drills: IDrill[];
  practicePlans: IPracticePlan[];
  onSubmit: Function;
  loading: boolean;
  fetchError: boolean;
  removePlayerAssessment: Function;
  removeDrill: Function;
  removePracticePlan: Function;
  addPlayerAssessment: Function;
  addDrill: Function;
  addPracticePlan: Function;
  hasSubmitted: boolean
}


const ApproveGroupings: React.FC<IApproveGroupings> = ({
  sessionSets,
  plans,
  playerAssessments,
  playerAssessmentsById,
  drills,
  practicePlans,
  onSubmit,
  loading,
  fetchError,
  removePlayerAssessment,
  removeDrill,
  removePracticePlan,
  addPlayerAssessment,
  addDrill,
  addPracticePlan,
  hasSubmitted
}) => {
  if (loading && !plans.length) return <Typography>Loading...</Typography>;
  if (fetchError && !plans.length) return <Typography>Unable to approve groupings at this time. Please try again later</Typography>;
  if (hasSubmitted) return <Typography>Players have been scheduled with the configured ice times</Typography>;
  let sessionIndex = 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box mt={2} display="flex" alignItems="center">
          <Typography>The schedule below has been generated based the <Link to="/format">schedule format</Link></Typography>
          <Spacer />
          <PrimaryButton disabled={hasSubmitted} onClick={() => onSubmit(sessionSets)}>Approve Groupings & Schedule Notifications</PrimaryButton>
        </Box>
      </Grid>
      {plans.map((plan, planIndex) => {
        return (
          <Grid item xs={12} key={plan.sessionStage._id}>
            <SectionWrapper dark>
              <Grid container spacing={2}>
                {plan.sessionSets.map((sessionSet, setIndex) => {
                  const { session, group } = sessionSet;
                  const currSessionSet = sessionSets[sessionIndex];
                  const currSessionIndex = sessionIndex;
                  sessionIndex += 1;
                  console.log('sessionIndex', sessionIndex);

                  if (!currSessionSet) return (
                    <Grid item xs={12} md={4}>
                      <SectionWrapper>
                        <Typography>Loading...</Typography>
                      </SectionWrapper>
                    </Grid>
                  );

                  return (
                    <Grid item xs={12} md={4} key={`${plan.sessionStage._id}_${setIndex}`}>
                      <SectionWrapper>
                        <Typography variant="subtitle1">{session.location} - {session.area}</Typography>
                        <Typography variant="subtitle1" gutterBottom>{session.date} @ {numToTime(session.start)}</Typography>

                        <Box mb={2}><Divider /></Box>

                        <Typography variant="subtitle2" gutterBottom>Practice Plans</Typography>
                        <ManageItemsListContainer
                          entity="practice plan"
                          options={practicePlans}
                          selectedItems={currSessionSet.practicePlans || []}
                          addItem={(item: IPracticePlan) => addPracticePlan(item, currSessionIndex)}
                        >
                          {(practicePlan: IPracticePlan) => (
                            <ListItem key={practicePlan._id}>
                              <ListItemText primary={practicePlan.name} />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => removePracticePlan(practicePlan, currSessionIndex)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          )}
                        </ManageItemsListContainer>

                        <Box mb={2}><Divider /></Box>

                        <Typography variant="subtitle2" gutterBottom>Drills</Typography>
                        <ManageItemsListContainer
                          entity="drill"
                          options={drills}
                          selectedItems={currSessionSet.drills || []}
                          addItem={(item: IDrill) => addDrill(item, currSessionIndex)}
                        >
                          {(drill: IDrill) => (
                            <ListItem key={drill._id}>
                              <ListItemText primary={`${drill.name}`} />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => removeDrill(drill, currSessionIndex)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          )}
                        </ManageItemsListContainer>

                        <Box mb={2}><Divider /></Box>

                        <Typography variant="subtitle2" gutterBottom>Players</Typography>
                        <ManageItemsListContainer
                          entity="player"
                          options={playerAssessments}
                          itemLabel={(item: IPlayerAssessment) => `${item.player.lastName}, ${item.player.firstName}${item.isHeld ? ' - On Hold' : ''}${item.isConcluded ? ' - Concluded' : ''}`}
                          selectedItems={currSessionSet.playerAssessments || []}
                          addItem={(item: IPlayerAssessment) => addPlayerAssessment(item, currSessionIndex)}
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
                                              onClick={() => removePlayerAssessment(playerAssessment, currSessionIndex)}>
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
            </SectionWrapper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ApproveGroupings;
