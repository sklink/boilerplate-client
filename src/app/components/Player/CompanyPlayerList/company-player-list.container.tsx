import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

// Components
import CompanyPlayerList from './company-player-list.component'
import { IFormOption } from '../../_core/_ui/forms.component';

interface ICompanyPlayerListContainer {
  playerAssessments: IPlayerAssessment[];
  players: IPlayer[];
  ageGroups: IAgeGroup[];
  positions: IAgeGroup[];
  loading: boolean;
  fetchError: boolean;
  addPlayerToAssessment: Function;
  setActiveAgeGroup: Function;
  activeAgeGroup: IAgeGroup;
}

const CompanyPlayerListContainer: React.FC<ICompanyPlayerListContainer> = ({
  playerAssessments,
  players,
  ageGroups,
  positions,
  loading,
  fetchError,
  addPlayerToAssessment,
  setActiveAgeGroup,
  activeAgeGroup
}) => {
  const [submitError, setError] = useState(false);
  const [activePosition, setActivePosition] = useState();
  const [ageGroupOptions, setAgeGroupOptions] = useState<IFormOption[]>([]);
  const [positionOptions, setPositionOptions] = useState<IFormOption[]>([]);
  const [selected, setSelected] = useState<IPlayer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayer] = useState(players);

  useEffect(() => {
    const filterPlayerIds: string[] = playerAssessments.map(playerAssessment => playerAssessment.player._id);
    const filteredPlayers = _.filter(players, player => !_.includes(filterPlayerIds, player._id));
    const fuse = new Fuse(filteredPlayers, { threshold: 0.3, keys: [
        'player.firstName',
        'player.lastName']
    });

    if (searchTerm.length) {
      const results = fuse.search(searchTerm);

      setFilteredPlayer(_.map(results, 'item'));
    } else {
      setFilteredPlayer(filteredPlayers);
    }
  }, [players, playerAssessments, searchTerm]);

  useEffect(() => {
    setAgeGroupOptions(ageGroups.map(group => ({ label: group.name, value: group._id })));
  }, [ageGroups]);

  useEffect(() => {
    setPositionOptions(positions.map(position => ({ label: position.name, value: position._id })));
  }, [positions]);

  const debounceSearch = useCallback(_.debounce((nextSearch: string) => {
    setSearchTerm(nextSearch)
  }, 300), []);

  const addPlayersToAssessment = (playerIds: string[]) => {
    if (!activeAgeGroup || !activePosition) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    } else {
      setSelected([]);

      playerIds.map(playerId => addPlayerToAssessment({
        playerId,
        ageGroupId: activeAgeGroup,
        positionId: activePosition
      }));
    }
  }

  return <CompanyPlayerList
    loading={loading}
    fetchError={fetchError}
    submitError={submitError}
    players={filteredPlayers}
    search={debounceSearch}
    selected={selected}
    setSelected={setSelected}
    ageGroupOptions={ageGroupOptions}
    positionOptions={positionOptions}
    activeAgeGroup={activeAgeGroup}
    setActiveAgeGroup={setActiveAgeGroup}
    setActivePosition={setActivePosition}
    addPlayersToAssessment={addPlayersToAssessment}
  />;
};

export default CompanyPlayerListContainer;
