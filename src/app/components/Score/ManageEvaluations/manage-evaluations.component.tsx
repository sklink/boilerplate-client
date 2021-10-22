import _ from 'lodash';
import React, { ReactNode } from 'react';
import { useHistory } from 'react-router';
import dayjs from 'dayjs';
import Select from 'react-select';

// Material UI
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

// Data
import { numToTime } from '../../../lib/helpers/conversion.helpers';
import { FormLabel, IFormOption } from '../../_core/_ui/forms.component';
import { SESSION_TERM } from '../../../lib/constants';

// Components
import { JerseyIcon } from '../../Session/CheckIn/check-in.helpers';
import { JerseyIconList, JerseyIconWrapper, StatusIcon } from './manage-evaluations.helpers';
import { SpacedRow, Spacer } from '../../_core/_ui/structure.components';
import { OutlineButton, PrimaryWhiteButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import { FormControl } from '@material-ui/core';
import EvaluateScoreSkill from './evaluate-score-skill.component';
import EvaluateTimedSkill from './evaluate-timed-skill.component';
import { getAuthUser } from '../../../lib/services/auth.service';
import ReviewEvaluations from './review-evaluations.component';
import { getOnlineStatus, getSyncing } from '../../_core/PersistGateContainer/persist-gate.container';

interface IManageEvaluations {
  loading: boolean;
  fetchError: boolean;
  session?: IAssessmentSession;
  jerseys: { [key: string]: IJersey };
  removeScore: Function;
  recordScore: Function;
  playersByPosition: { [key: string]: IPlayerAssessment[] };
  playersById: { [key: string]: IPlayerAssessment };
  playersLinear: IPlayerAssessment[];
  currPlayerIndex: number;
  setCurrPlayerIndex: Function;
  playerOptions: IFormOption[];
  drills: IDrill[];
  drillsById: { [key: string]: IDrill };
  drillOptions: IFormOption[];
  activePlayer?: IPlayerAssessment;
  setActivePlayer: Function;
  activeDrill?: IDrill;
  setActiveDrill: Function
  activeRound: number;
  setActiveRound: Function;
  getScoreStatus: (playerAssessment: IPlayerAssessment, drillId: string, round: number) => string;
  scoreHash: { [key: string]: { [key: string]: { [key: string]: { [key: number]: IScore } } } };
  showReview: boolean;
  setShowReview: Function;
  canCheckIn: boolean;
}

const ManageEvaluations: React.FC<IManageEvaluations> = ({
  loading,
  fetchError,
  session,
  jerseys,
  removeScore,
  recordScore,
  playersByPosition,
  playersById,
  playersLinear,
  currPlayerIndex,
  setCurrPlayerIndex,
  playerOptions,
  drillsById,
  drillOptions,
  activePlayer,
  setActivePlayer,
  drills,
  activeDrill,
  setActiveDrill,
  activeRound,
  setActiveRound,
  getScoreStatus,
  scoreHash,
  showReview,
  setShowReview,
  canCheckIn
}) => {
  const isOnline = getOnlineStatus();
  const isSyncing = getSyncing();
  const user = getAuthUser();
  const history = useHistory();

  if (loading && !session) return <Typography>Loading...</Typography>;
  if (!session) return <Typography>Unable to load evaluations at this time. Please try again later</Typography>;

  const eleSkills = renderSkills({
    activeDrill,
    activePlayer,
    activeRound,
    user,
    session,
    scoreHash,
    removeScore,
    recordScore
  });

  return (
    <div>
      <JerseyIconList style={{ top: (isOnline && !isSyncing) ? 0 : '48px' }}>
        {_.map(playersByPosition, (players, positionName) => (
         <React.Fragment key={`jerseys_${positionName}`}>
           <JerseyIconWrapper isLabel>{positionName}</JerseyIconWrapper>
           {players.map(player => (
             <JerseyIconWrapper key={player._id} active={player._id === activePlayer?._id} onClick={() => setActivePlayer(player)}>
               <JerseyIcon color={jerseys[player._id]?.color}>{jerseys[player._id]?.number}</JerseyIcon>
               {activeDrill && <StatusIcon status={getScoreStatus(player, activeDrill._id, activeRound)} />}
             </JerseyIconWrapper>
           ))}
         </React.Fragment>
        ))}
        {_.keys(playersByPosition).length === 0 && (
          <JerseyIconWrapper style={{ width: '100%', justifyContent: 'center' }} isLabel>No Players Checked-In</JerseyIconWrapper>
        )}
      </JerseyIconList>

      <Box mt={10} display="flex">
        <Box>
          <Typography variant="h6">{session.location} - {session.area}</Typography>
          <Typography variant="subtitle1">{session.ageGroup.name} | {dayjs(session.date).format('MMMM Do')} @ {numToTime(session.start)}</Typography>
        </Box>

        <Spacer />

        <SecondaryButton startIcon={<ArrowBackIosIcon />} onClick={() => history.push('/upcoming')}>Home</SecondaryButton>
        {canCheckIn && (
          <PrimaryWhiteButton
            style={{ marginLeft: '16px' }}
            onClick={() => history.push(`/check-in/${session._id}`)}
          >Check-In Players</PrimaryWhiteButton>
        )}
      </Box>

      <Box my={2}>
        {/* Navigation here */}
        {!showReview && (
          <Paper>
            <SpacedRow>
              <JerseyIcon color={activePlayer && jerseys[activePlayer._id]?.color}>{activePlayer && jerseys[activePlayer._id]?.number}</JerseyIcon>
              <FormControl style={{ width: '142px' }}>
                <FormLabel>Active Player</FormLabel>
                <Select
                  loading={!activePlayer}
                  options={playerOptions}
                  value={activePlayer && { value: activePlayer._id, label: `${_.capitalize(jerseys[activePlayer._id]?.color)} - ${jerseys[activePlayer._id]?.number}` }}
                  isSearchable={false}
                  isOptionDisabled={option => option.value === activePlayer?._id}
                  onChange={option => option && setActivePlayer(playersById[option.value])}
                  noOptionsMessage={() => 'No Players Assigned'}
                />
              </FormControl>
              <FormControl style={{ width: '310px' }}>
                <FormLabel>Active Drill</FormLabel>
                <Select
                  options={drillOptions}
                  loading={!activeDrill}
                  value={activeDrill && { value: activeDrill._id, label: activeDrill.name }}
                  isSearchable={false}
                  isOptionDisabled={option => option.value === activeDrill?._id}
                  onChange={option => option && setActiveDrill(drillsById[option.value])}
                  noOptionsMessage={() => 'No Drills Assigned'}
                />
              </FormControl>
              <FormControl style={{ width: '120px' }}>
                <FormLabel>Active Round</FormLabel>
                <Select
                  options={Array(5).fill(undefined).map((_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
                  value={{ value: String(activeRound), label: String(activeRound) }}
                  isSearchable={false}
                  isOptionDisabled={option => Number(option.value) === activeRound}
                  onChange={option => option && setActiveRound(Number(option.value))}
                />
              </FormControl>
              <Spacer />
              <SecondaryButton
                disabled={currPlayerIndex === 0}
                onClick={() => setActivePlayer(playersLinear[currPlayerIndex - 1])}
              >Previous Player</SecondaryButton>
              <SecondaryButton
                disabled={currPlayerIndex === playersLinear.length - 1}
                onClick={() => setActivePlayer(playersLinear[currPlayerIndex + 1])}
              >Next Player</SecondaryButton>
              <OutlineButton onClick={() => setShowReview(!showReview)}>Review Scores</OutlineButton>
            </SpacedRow>
            <Divider />
            {activeDrill && (
              <Box p={2}>
                <Typography variant="h6" gutterBottom>{activeDrill.name}</Typography>
                {eleSkills}
                {eleSkills.length === 0 && activePlayer && <Typography>Drill does not apply to this player's position</Typography>}
                {!activePlayer && <Typography>No player selected</Typography>}
              </Box>
            )}
            {!activeDrill && (
              <Box p={2}><Typography>No drill selected</Typography></Box>
            )}
          </Paper>
        )}

        {showReview && (
          <Paper>
            <Box p={2} display="flex">
              <Typography variant="h6">Review Scores</Typography>
              <Spacer />
              <OutlineButton onClick={() => setShowReview(false)}>Score Players</OutlineButton>
            </Box>
            <ReviewEvaluations
              players={_.values(playersById)}
              jerseys={jerseys}
              drills={drills}
              scoreHash={scoreHash}
              setActiveDrill={setActiveDrill}
              setActivePlayer={setActivePlayer}
              setActiveRound={setActiveRound}
              setShowReview={setShowReview}
            />
          </Paper>
        )}
      </Box>
    </div>
  );
};

interface IRenderSkills {
  activeDrill?: IDrill;
  activePlayer?: IPlayerAssessment;
  activeRound: number;
  user: IUser | null;
  scoreHash: { [key: string]: { [key: string]: { [key: string]: { [key: number]: IScore } } } };
  session: IAssessmentSession;
  removeScore: Function;
  recordScore: Function;
}

const renderSkills = ({
  activeDrill,
  activePlayer,
  activeRound,
  user,
  session,
  scoreHash,
  removeScore,
  recordScore
}: IRenderSkills) => {
  const eleSkills: ReactNode[] = [];

  if (activeDrill && activePlayer && user) {
    activeDrill.skillSets.forEach((skillSet: ISkillSet) => {
      if (_.includes(skillSet.positionIds, activePlayer.position._id)) {
        skillSet.skills?.forEach((skill, index) => {
          const context: any = {
            drillId: activeDrill._id,
            skillId: skill._id,
            assessmentSessionId: session._id,
            playerAssessmentId: activePlayer._id,
            assessmentId: session.assessmentId,
            ageGroupId: activePlayer.ageGroup._id,
            round: activeRound
          };

          const currScore = _.get(scoreHash, [activePlayer._id, activeDrill._id, skill._id, activeRound]);
          if (currScore) {
            context._id = currScore._id;
          }


          eleSkills.push(<RenderSkill
            key={`${activeDrill._id}_${skill._id}`}
            context={context}
            score={currScore}
            skill={skill}
            activeRound={activeRound}
            activePlayer={activePlayer}
            recordScore={recordScore}
            removeScore={removeScore}
          />);
        });
      }
    });
  }

  return eleSkills;
}

interface IRenderSkill {
  context: {  [key: string]: any };
  skill: ISkill;
  score?: IScore;
  activeRound: number;
  activePlayer?: IPlayerAssessment;
  recordScore: Function;
  removeScore: Function;
}

const RenderSkill: React.FC<IRenderSkill> = ({
  context,
  skill,
  score,
  activeRound,
  activePlayer,
  recordScore,
  removeScore
}) => {
  return (
    <Box style={{ borderBottom: '1px solid #ddd' }} mb={1} pb={1}>
      <Typography key={`${skill._id}_title`} gutterBottom>{skill.name}</Typography>
      {skill.type === 'TIMED' && (
        <EvaluateTimedSkill
          key={skill._id}
          skill={skill}
          roundNum={activeRound}
          activePlayer={activePlayer}
          score={score}
          removeScore={removeScore}
          saveScore={(value: string) => {
            recordScore({ ...context, raw: String(value), type: 'TIME' })
          }}
        />
      )}
      {skill.type === 'SCORE' && (
        <EvaluateScoreSkill
          key={skill._id}
          skill={skill}
          score={score}
          removeScore={removeScore}
          saveScore={(value: string) => {
            recordScore({ ...context, raw: String(value), type: 'NUMBER' })
          }}
        />
      )}
    </Box>
  );
}

export default ManageEvaluations;
