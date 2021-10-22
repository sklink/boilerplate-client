import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';
import { useHistory } from 'react-router';
import Select from 'react-select';

// Material UI
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Dialog from '@material-ui/core/Dialog';

// Data
import { numToTime } from '../../../lib/helpers/conversion.helpers';

// Components
import { Spacer } from '../../_core/_ui/structure.components';
import { PrimaryWhiteButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import { FormInput, IFormOption } from '../../_core/_ui/forms.component';
import { JerseyIcon } from './check-in.helpers';
import { Bold } from '../../_core/_ui/typography.component';
import { ITeam } from './check-in.interface';
import JerseyAssignment from './jersey-assignment.component';

interface ICheckIn {
  session?: IAssessmentSession;
  loading: boolean;
  fetchError: boolean;
  numTeams: number;
  setNumTeams: Function;
  checkedInPlayersHash: { [key: string]: IPlayerAssessment };
  teams: ITeam[];
  jerseys: { [key: string]: IJersey };
  selectedPlayer: IPlayerAssessment | null;
  setSelectedPlayer: Function;
  playerOptions: IFormOption[];
  positionOptions: IFormOption[];
  selectLoading: boolean;
  validateJersey: Function;
  assignJersey: Function;
  removeCheckedInPlayer: Function;
  changeTeam: Function;
  canEvaluate: boolean;
  removePlayer: Function;
  addPlayer: Function;
  changePosition: Function;
}

const CheckIn: React.FC<ICheckIn> = ({
  session,
  loading,
  fetchError,
  numTeams,
  setNumTeams,
  checkedInPlayersHash,
  teams,
  jerseys,
  selectedPlayer,
  setSelectedPlayer,
  playerOptions,
  positionOptions,
  selectLoading,
  validateJersey,
  assignJersey,
  removeCheckedInPlayer,
  changeTeam,
  canEvaluate,
  addPlayer,
  removePlayer,
  changePosition
}) => {
  const history = useHistory();
  if (loading && !session) return <Typography>Loading...</Typography>;
  if (!session) return <Typography>Unable to check in players at this time. Please try again later</Typography>;

  return (
    <div>
      <Box display="flex">
        <Typography variant="h4">{session.location} - {session.area}</Typography>

        <Spacer />
        <SecondaryButton
          startIcon={<ArrowBackIosIcon />}
          onClick={() => history.push('/upcoming')}
        >
          Home
        </SecondaryButton>
        {canEvaluate && <Box ml={2}><PrimaryWhiteButton onClick={() => history.push(`/evaluate/${session._id}`)}>Evaluate Players</PrimaryWhiteButton></Box>}
      </Box>
      <Typography variant="h5" gutterBottom>{session.address}</Typography>
      <Typography variant="subtitle1">{session.ageGroup.name} | {dayjs(session.date).format('MMMM Do')} @ {numToTime(session.start)} | {session.playerAssessments?.length || 0} Players</Typography>

      <Box my={2}><Divider /></Box>

      <Box display="flex" alignItems="center" mb={2}>
        <Typography>Number of teams:</Typography>
        <Box ml={2}><FormInput defaultValue={numTeams} onKeyUp={(e: any) => setNumTeams(e.currentTarget.value)} /></Box>
        <Box mx={2}>|</Box>
        <Box width="300px">
          <Select
            loading={selectLoading && !playerOptions.length}
            options={playerOptions}
            onChange={((option) => option && addPlayer(option.value))}
            placeholder="Add a player to this assessment..."
          />
        </Box>
      </Box>

      <Grid container spacing={2}>
        {teams.map((team, teamIndex) => (
          // @ts-ignore
          <Grid item xs={Math.floor(12 / numTeams)}>
            <Paper>
              <Box p={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" gutterBottom>Team {teamIndex + 1}</Typography>
                  <Spacer />

                  {_.map(team.playersByPosition, ((playerAssessments, positionName) => (
                    <Box key={positionName} textAlign="right" ml={2}>
                      <Typography><Bold>{positionName}</Bold></Typography>
                      <Typography><Bold>{playerAssessments.length}</Bold></Typography>
                    </Box>
                  )))}
                </Box>
                {_.map(team.playersByPosition, ((playerAssessments, positionName) => (
                  <Box key={positionName} mb={2}>
                    <Typography variant="subtitle2">{positionName}</Typography>
                    <List style={{ border: '1px solid #ddd', padding: 0 }}>
                      {playerAssessments.map((playerAssessment, index) => {
                        const isCheckedIn = Boolean(checkedInPlayersHash[playerAssessment._id]);

                        return (
                          <React.Fragment key={playerAssessment._id}>
                            <ListItem style={{paddingTop: 0, paddingBottom: 0}}>
                              <ListItemIcon style={{minWidth: '36px', cursor: 'pointer'}}>
                                <Checkbox
                                  edge="start"
                                  disableRipple
                                  checked={isCheckedIn}
                                  onClick={() => isCheckedIn ? removeCheckedInPlayer(playerAssessment._id) : setSelectedPlayer(playerAssessment)}
                                />
                              </ListItemIcon>
                              <ListItemIcon style={{cursor: 'pointer', marginRight: '16px' }}>
                                <JerseyIcon color={isCheckedIn ? jerseys[playerAssessment._id]?.color : undefined}>
                                  {isCheckedIn && jerseys[playerAssessment._id]?.number}
                                </JerseyIcon>
                              </ListItemIcon>
                              <ListItemText
                                style={{cursor: 'pointer', paddingTop: '16px', paddingBottom: '16px'}}
                                onClick={() => isCheckedIn ? removeCheckedInPlayer(playerAssessment._id) : setSelectedPlayer(playerAssessment)}
                                primary={`${playerAssessment.player.lastName}, ${playerAssessment.player.firstName}`}
                              />
                              <ListItemSecondaryAction>
                                <IconButton onClick={() => removePlayer(playerAssessment, teamIndex)}>
                                  <DeleteIcon/>
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                            {index < playerAssessments.length - 1 && <Divider/>}

                            {selectedPlayer?._id === playerAssessment._id && (
                              <Dialog open={Boolean(selectedPlayer)} onClose={() => setSelectedPlayer(null)}
                                      aria-labelledby="form-dialog-title">
                                <JerseyAssignment
                                  changeTeam={changeTeam}
                                  teams={teams}
                                  teamIndex={teamIndex}
                                  playerAssessment={selectedPlayer}
                                  onCancel={() => setSelectedPlayer(null)}
                                  checkedInPlayersHash={checkedInPlayersHash}
                                  positionOptions={positionOptions}
                                  changePosition={changePosition}
                                  validateJersey={validateJersey}
                                  selectLoading={selectLoading}
                                  assignJersey={assignJersey}
                                  jersey={jerseys[playerAssessment._id]}
                                />
                              </Dialog>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </List>
                  </Box>
                )))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CheckIn;
