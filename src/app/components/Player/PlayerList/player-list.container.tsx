import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

// Components
import PlayerList from './player-list.component';

interface IPlayerListContainer {
  playerAssessments: IPlayerAssessment[];
  loading: boolean;
  fetchError: boolean;
  removePlayerAssessment: Function;
}

const PlayerListContainer: React.FC<IPlayerListContainer> = ({
  playerAssessments,
  loading,
  fetchError,
  removePlayerAssessment
}) => {
  const [selected, setSelected] = useState<IPlayerAssessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlayerAssessments, setFilteredPlayerAssessments] = useState(playerAssessments);
  const fuse = new Fuse(playerAssessments, { threshold: 0.3, keys: [
    'player.firstName',
    'player.lastName']
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchTerm.length) {
      const results = fuse.search(searchTerm);

      setFilteredPlayerAssessments(_.map(results, 'item'));
    } else {
      setFilteredPlayerAssessments(playerAssessments);
    }
  }, [playerAssessments.length, searchTerm]);

  const debounceSearch = useCallback(_.debounce((nextSearch: string) => {
    setSearchTerm(nextSearch)
  }, 300), []);

  const removePlayerAssessments = (_ids: string[]) =>
    _ids.map(_id => removePlayerAssessment(_id));

  return <PlayerList
    loading={loading}
    fetchError={fetchError}
    playerAssessments={filteredPlayerAssessments}
    search={debounceSearch}
    selected={selected}
    setSelected={setSelected}
    removePlayerAssessments={removePlayerAssessments}
  />;
};

export default PlayerListContainer;
