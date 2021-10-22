import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import CheckIn from './check-in.component';
import {
  buildColors,
  buildTeamPlayers,
  exportTeams,
  rebuildTeamPlayers,
  sortByPosition,
  validateJersey
} from './check-in.helpers';
import { ITeam } from './check-in.interface';
import { IFormOption } from '../../_core/_ui/forms.component';
import Typography from '@material-ui/core/Typography';

interface ICheckInContainer {
  session?: IAssessmentSession;
  loading: boolean;
  selectLoading: boolean;
  fetchError: boolean;
  positions: IPosition[];
  playerAssessments: IPlayerAssessment[];
  assignJersey: Function;
  removeCheckedInPlayer: Function;
  member?: IMember;
  removePlayer: Function;
  addPlayer: Function;
  saveTeams: Function;
  updatePosition: Function;
}

const CheckInContainer: React.FC<ICheckInContainer> = ({
  session,
  loading,
  selectLoading,
  fetchError,
  positions,
  playerAssessments,
  assignJersey,
  removeCheckedInPlayer,
  member,
  addPlayer,
  removePlayer,
  saveTeams,
  updatePosition
}) => {
  const [numTeams, setNumTeams] = useState((session?.teams.config || []).length);
  const [initialized, setInitialized] = useState(false);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayerAssessment | null>(null);
  const [positionOptions, setPositionOptions] = useState<IFormOption[]>([]);
  const [playerOptions, setPlayerOptions] = useState<IFormOption[]>([]);
  const [checkedInPlayersHash, setCheckedInPlayerHash] = useState<{ [key: string]: IPlayerAssessment }>({});


  // Build teams
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (session?.playerAssessments?.length) {
      const savedTeams = session?.teams.config || [];

      let teamPlayers: IPlayerAssessment[][];
      if (savedTeams.length && (!initialized || (initialized && numTeams === savedTeams.length))) {
        teamPlayers = rebuildTeamPlayers(savedTeams, session?.playerAssessments || []);
      } else {
        teamPlayers = buildTeamPlayers(session?.playerAssessments, numTeams);
      }

      const nextTeams: ITeam[] = teamPlayers.map(team => ({
        playersByPosition: sortByPosition(team),
        colors: buildColors(team, session?.jerseys || {}, session?.checkedInPlayerIds)
      }));

      saveTeams(exportTeams(nextTeams));
      setNumTeams(nextTeams.length);
      setTeams(nextTeams);
      setInitialized(true);
    }
  }, [Boolean(session), numTeams]);

  const changeTeam = (playerAssessment: IPlayerAssessment, currTeamIndex: number, nextTeamIndex: number) => {
    const currPosition = playerAssessment.position.name;
    const nextTeams = [...teams];

    _.remove(nextTeams[currTeamIndex].playersByPosition[currPosition], currPlayer => currPlayer._id === playerAssessment._id);
    if (nextTeams[currTeamIndex].playersByPosition[currPosition].length === 0) {
      delete nextTeams[currTeamIndex].playersByPosition[currPosition];
    }
    nextTeams[nextTeamIndex].playersByPosition[currPosition] = nextTeams[nextTeamIndex].playersByPosition[currPosition] || [];
    nextTeams[nextTeamIndex].playersByPosition[currPosition].push(playerAssessment);

    saveTeams(exportTeams(nextTeams));
    setTeams(nextTeams);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextCheckedInPlayerHash: { [key: string]: IPlayerAssessment } = {};

    session?.checkedInPlayerIds?.forEach(playerAssessmentId => {
      const doc = _.find(session?.playerAssessments, playerAssessment => playerAssessment._id === playerAssessmentId);

      if (doc) nextCheckedInPlayerHash[playerAssessmentId] = doc;
    });

    setCheckedInPlayerHash(nextCheckedInPlayerHash);
  }, [session?.checkedInPlayerIds?.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPositionOptions(positions.map(position => ({ value: position._id, label: position.name })));
  }, [positions.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const sessionPlayerIds = _.map(session?.playerAssessments || [], '_id');
    const availablePlayers = playerAssessments.filter(playerAssessment => !_.includes(sessionPlayerIds, playerAssessment._id));
    setPlayerOptions(availablePlayers.map(playerAssessment => ({ value: playerAssessment._id, label: `${playerAssessment.player.lastName}, ${playerAssessment.player.firstName}` })));
  }, [playerAssessments.length, session?.playerAssessments?.length]);

  const handleSetNumTeams = (value: string) => {
    const nextNumTeams = Number(value);

    if (!_.isNaN(nextNumTeams) && nextNumTeams > 0) setNumTeams(nextNumTeams);
  };

  const handleValidateJersey = (args: any) =>
    validateJersey({ ...args, jerseys: session?.jerseys, checkedInPlayersHash });

  const handleAssignJersey = (playerAssessmentId: string, jersey: IJersey) =>
    assignJersey(session?._id, playerAssessmentId, jersey);

  const handleRemoveCheckedInPlayer = (playerAssessmentId: string) => {
    removeCheckedInPlayer(session?._id, playerAssessmentId);
  }

  const handleAddPlayer = (_id: string) => {
    const player = _.find(playerAssessments, currPlayer => currPlayer._id === _id);

    if (player) {
      const currPosition = player.position.name;
      const nextTeams = [...teams];
      const playerLengths: { index: number, length: number }[] = [];

      _.each(nextTeams, (team, index) => {
        playerLengths.push({ index, length: team.playersByPosition[currPosition]?.length || 0 });
      });

      const addToTeam = _.minBy(playerLengths, 'length');
      const addToTeamIndex = addToTeam ? addToTeam.index : 0;
      nextTeams[addToTeamIndex].playersByPosition[currPosition] = nextTeams[addToTeamIndex].playersByPosition[currPosition] || [];
      nextTeams[addToTeamIndex].playersByPosition[currPosition].push(player);

      saveTeams(exportTeams(nextTeams));
      setTeams(nextTeams);

      addPlayer(player);
    }
  };

  const handleRemovePlayer = (playerAssessment: IPlayerAssessment, currTeamIndex: number) => {
    const currPosition = playerAssessment.position.name;
    const nextTeams = [...teams];

    _.remove(nextTeams[currTeamIndex].playersByPosition[currPosition], currPlayer => currPlayer._id === playerAssessment._id);
    if (nextTeams[currTeamIndex].playersByPosition[currPosition].length === 0) {
      delete nextTeams[currTeamIndex].playersByPosition[currPosition];
    }

    saveTeams(exportTeams(nextTeams));
    setTeams(nextTeams);

    removePlayer(playerAssessment);
  };

  const handleChangePosition = (playerAssessment: IPlayerAssessment, currTeamIndex: number, positionId: string) => {
    const currPosition = playerAssessment.position;
    const nextPosition = _.find(positions, position => position._id === positionId);

    if (nextPosition) {
      const nextTeams = [...teams];

      _.remove(nextTeams[currTeamIndex].playersByPosition[currPosition.name], currPlayer => currPlayer._id === playerAssessment._id);
      if (nextTeams[currTeamIndex].playersByPosition[currPosition.name].length === 0) {
        delete nextTeams[currTeamIndex].playersByPosition[currPosition.name];
      }
      nextTeams[currTeamIndex].playersByPosition[nextPosition.name] = nextTeams[currTeamIndex].playersByPosition[nextPosition.name] || [];
      nextTeams[currTeamIndex].playersByPosition[nextPosition.name].push({ ...playerAssessment, position: nextPosition });

      saveTeams(exportTeams(nextTeams));
      setTeams(nextTeams);
      updatePosition(playerAssessment, positionId);

      setSelectedPlayer({ ...playerAssessment, position: nextPosition });
    }
  }

  const canEvaluate = (member && _.includes(member.roles, 'SCORING')) || false;

  return <CheckIn
    session={session}
    loading={loading}
    fetchError={fetchError}
    numTeams={numTeams}
    setNumTeams={handleSetNumTeams}
    jerseys={session?.jerseys || {}}
    teams={teams}
    checkedInPlayersHash={checkedInPlayersHash}
    selectedPlayer={selectedPlayer}
    setSelectedPlayer={setSelectedPlayer}
    selectLoading={selectLoading}
    positionOptions={positionOptions}
    playerOptions={playerOptions}
    validateJersey={handleValidateJersey}
    assignJersey={handleAssignJersey}
    removeCheckedInPlayer={handleRemoveCheckedInPlayer}
    changeTeam={changeTeam}
    canEvaluate={canEvaluate}
    removePlayer={handleRemovePlayer}
    addPlayer={handleAddPlayer}
    changePosition={handleChangePosition}
  />;
};

export default CheckInContainer;
