import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import GlobalAgeGroupFilter from './global-age-group-filter.component';

interface IGlobalAgeGroupFilterContainer {
  user?: IUser | null;
  ageGroups: IAgeGroup[];
  changeActiveAgeGroups: Function;
  fetchError: boolean;
  loading: boolean;
  activeAgeGroupIds: string[];
}

const GlobalAgeGroupFilterContainer: React.FC<IGlobalAgeGroupFilterContainer> = ({
  user,
  ageGroups,
  changeActiveAgeGroups,
  activeAgeGroupIds,
  loading,
  fetchError
}) => {
  const [activeAgeGroupHash, setActiveAgeGroupHash] = useState({});

  const toggleAgeGroup = (ageGroupId: string) => {
    const nextAgeGroupIds = [...activeAgeGroupIds || []];
    if (nextAgeGroupIds.indexOf(ageGroupId) === -1) {
      nextAgeGroupIds.push(ageGroupId);
    } else {
      _.pull(nextAgeGroupIds, ageGroupId);
    }

    changeActiveAgeGroups(nextAgeGroupIds);
  };

  useEffect(() => {
    const nextHash: any = {};

    activeAgeGroupIds.forEach(ageGroupId => {
      nextHash[ageGroupId] = true;
    });

    setActiveAgeGroupHash(nextHash);
  }, [activeAgeGroupIds]);

  return <GlobalAgeGroupFilter
    toggleAgeGroup={toggleAgeGroup}
    ageGroups={ageGroups}
    loading={loading}
    fetchError={fetchError}
    activeAgeGroupHash={activeAgeGroupHash}
  />;
};

export default GlobalAgeGroupFilterContainer;
