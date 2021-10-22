import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

// Components
import PracticePlanList from './practice-plan-list.component';

interface IPracticePlanListContainer {
  practicePlans: IPracticePlan[];
  loading: boolean;
  fetchError: boolean;
  countArchivedPlans: number;
  removePlan: Function;
  restorePlan: Function;
  viewingArchived: boolean;
  setViewingArchived: Function;
}

const PracticePlanListContainer: React.FC<IPracticePlanListContainer> = ({
  practicePlans,
  loading,
  fetchError,
  countArchivedPlans,
  removePlan,
  restorePlan,
  viewingArchived,
  setViewingArchived
}) => {
  const [selected, setSelected] = useState<IPracticePlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPracticePlans, setFilteredPracticePlans] = useState(practicePlans);
  const fuse = new Fuse(practicePlans, { threshold: 0.3, keys: ['name'] });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchTerm.length) {
      const results = fuse.search(searchTerm);

      setFilteredPracticePlans(_.map(results, 'item'));
    } else {
      setFilteredPracticePlans(practicePlans);
    }
  }, [practicePlans.length, searchTerm]);

  const debounceSearch = useCallback(_.debounce((nextSearch: string) => {
    setSearchTerm(nextSearch)
  }, 300), []);

  const removePlans = (_ids: string[]) => {
    _ids.map(_id => removePlan(_id));
  };

  const restorePlans = (_ids: string[]) =>
    _ids.map(_id => restorePlan(_id));

  return <PracticePlanList
    loading={loading}
    fetchError={fetchError}
    practicePlans={filteredPracticePlans}
    searchPracticePlans={debounceSearch}
    selected={selected}
    setSelected={setSelected}
    countArchivedPlans={countArchivedPlans}
    removePlans={removePlans}
    restorePlans={restorePlans}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
  />;
};

export default PracticePlanListContainer;
