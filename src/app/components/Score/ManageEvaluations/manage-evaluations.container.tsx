import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ManageEvaluations from './manage-evaluations.component';
import { groupByPosition, sortByJersey } from './manage-evaluations.helpers';
import { IFormOption } from '../../_core/_ui/forms.component';

interface IManageEvaluationsContainer {
  session?: IAssessmentSession;
  drills: IDrill[];
  players: IPlayerAssessment[];
  jerseys: { [key: string]: IJersey };
  scores: IScore[];
  recordScore: Function;
  removeScore: Function;
  loading: boolean;
  fetchError: boolean;
  member?: IMember;
}

const ManageEvaluationsContainer: React.FC<IManageEvaluationsContainer> = ({
  session,
  drills,
  players,
  jerseys,
  scores,
  recordScore,
  removeScore,
  loading,
  fetchError,
  member
}) => {
  const [showReview, setShowReview] = useState(false);
  const [scoreHash, setScoreHash] = useState({});
  const [scoreStatusHash, setScoreStatusHash] = useState({});
  const [activeRound, setActiveRound] = useState(1);
  const [activeDrill, setActiveDrill] = useState();
  const [drillsById, setDrillsById] = useState<{ [key: string]: IDrill }>({});
  const [drillOptions, setDrillOptions] = useState();
  const [activePlayer, setActivePlayer] = useState();
  const [playersByPosition, setPlayersByPosition] = useState({});
  const [playerOptions, setPlayerOptions] = useState<IFormOption[]>([]);
  const [playersById, setPlayersById] = useState<{ [key: string]: IPlayerAssessment }>({});
  const [playersLinear, setPlayersLinear] = useState<IPlayerAssessment[]>([]);
  const [currPlayerIndex, setCurrPlayerIndex] = useState(0);
  const [stateLoaded, setStateLoaded] = useState(false);
  const numJerseys = _.keys(jerseys).length;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (players.length && numJerseys > 0) {
      const nextPlayersByPosition = groupByPosition(players);
      _.each(nextPlayersByPosition, (players, position) => {
        nextPlayersByPosition[position] = sortByJersey(nextPlayersByPosition[position], jerseys);
      });

      const positions = _.keys(nextPlayersByPosition);
      const firstPlayer = _.get(nextPlayersByPosition, [positions[0], '0']);
      if (firstPlayer) {
        setActivePlayer(firstPlayer);
      }
      setPlayersByPosition(nextPlayersByPosition);
      setPlayersById(_.keyBy(players, '_id'))

      const nextPlayerOptions: any[] = [];
      _.each(nextPlayersByPosition, (players, position) => {
        nextPlayerOptions.push({
          label: position,
          options: _.map(players, player => ({ value: player._id, label: `${_.capitalize(jerseys[player._id]?.color)} - ${jerseys[player._id]?.number}`}))
        });
      });
      setPlayerOptions(nextPlayerOptions);

      setPlayersLinear(_.flatten(_.values(nextPlayersByPosition)));

      setStateLoaded(true);
    }
  }, [players.length, numJerseys]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextScoreHash = {};

    _.each(scores, score => {
      _.set(nextScoreHash, [score.playerAssessmentId, score.drillId, score.skillId, score.round], score);
    });

    setScoreHash(nextScoreHash);
  }, [scores]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (drills.length) {
      const nextDrillOptions: IFormOption[] = drills.map(drill => ({
        value: drill._id,
        label: drill.name
      }));

      setDrillsById(_.keyBy(drills, '_id'));
      setDrillOptions(nextDrillOptions);
      setActiveDrill(drills[0]);
    }
  }, [drills.length]);

  const handleGetStoreStatus = (playerAssessment: IPlayerAssessment, drillId: string, round: number) => {
    let expectedSkillCount = 0;
    _.each(drillsById[drillId].skillSets, (skillSet => {
      if (_.includes(skillSet.positionIds, playerAssessment.position._id)) {
        _.each(skillSet.skills, skill => {
          expectedSkillCount += 1;
        })
      }
    }))
    const skillScores = _.get(scoreHash, [playerAssessment._id, drillId], {});
    let currSkillCount = 0;

    _.each(skillScores, (roundScores, skillId) => {
      if (roundScores && roundScores[activeRound]) {
        currSkillCount += 1;
      }
    });

    if (currSkillCount === expectedSkillCount) return 'FILLED';
    if (currSkillCount > 0) return 'PARTIAL';
    return 'NONE';
  };

  const handleSetActivePlayer = (player: IPlayerAssessment) => {
    setActivePlayer(player);
    setCurrPlayerIndex(_.findIndex(playersLinear, currPlayer => currPlayer._id === player._id));
  }

  const canCheckIn = (member && _.includes(member.roles, 'CHECK_IN')) || false;

  return <ManageEvaluations
    loading={loading || !stateLoaded}
    fetchError={fetchError}
    session={session}
    jerseys={jerseys}
    removeScore={removeScore}
    recordScore={recordScore}
    playersByPosition={playersByPosition}
    playersById={playersById}
    playersLinear={playersLinear}
    currPlayerIndex={currPlayerIndex}
    setCurrPlayerIndex={setCurrPlayerIndex}
    playerOptions={playerOptions}
    drills={drills}
    drillsById={drillsById}
    drillOptions={drillOptions}
    activePlayer={activePlayer}
    setActivePlayer={handleSetActivePlayer}
    activeDrill={activeDrill}
    setActiveDrill={setActiveDrill}
    activeRound={activeRound}
    setActiveRound={setActiveRound}
    getScoreStatus={handleGetStoreStatus}
    scoreHash={scoreHash}
    showReview={showReview}
    setShowReview={setShowReview}
    canCheckIn={canCheckIn}
  />
};

export default ManageEvaluationsContainer;
