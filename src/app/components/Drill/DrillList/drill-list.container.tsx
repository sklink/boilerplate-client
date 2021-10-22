import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

// Components
import DrillList from './drill-list.component';

interface IDrillListContainer {
  drills: IDrill[];
  loading: boolean;
  fetchError: boolean;
  removeDrill: Function;
  restoreDrill: Function;
  countArchivedDrills: number;
  viewingArchived: boolean;
  setViewingArchived: Function;
}

const DrillListContainer: React.FC<IDrillListContainer> = ({
  drills,
  countArchivedDrills,
  loading,
  fetchError,
  removeDrill,
  restoreDrill,
  viewingArchived,
  setViewingArchived
}) => {
  const [selectedDrills, setSelectedDrills] = useState<IDrill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDrills, setFilteredDrills] = useState(drills);
  const fuse = new Fuse(drills, { threshold: 0.3, keys: ['name'] });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchTerm.length) {
      const results = fuse.search(searchTerm);

      setFilteredDrills(_.map(results, 'item'));
    } else {
      setFilteredDrills(drills);
    }
  }, [drills.length, searchTerm]);

  const debounceSearch = useCallback(_.debounce((nextSearch: string) => {
    setSearchTerm(nextSearch)
  }, 300), []);

  const removeDrills = (_ids: string[]) => {
    _ids.map(_id => removeDrill(_id));
  };

  const restoreDrills = (_ids: string[]) =>
    _ids.map(_id => restoreDrill(_id));

  return <DrillList
    loading={loading}
    fetchError={fetchError}
    drills={filteredDrills}
    countArchivedDrills={countArchivedDrills}
    searchDrills={debounceSearch}
    removeDrills={removeDrills}
    restoreDrills={restoreDrills}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    selectedDrills={selectedDrills}
    setSelectedDrills={setSelectedDrills}
  />;
};

export default DrillListContainer;
