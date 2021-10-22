import React from 'react';
import ManageAgeGroup from './manage-age-group.component';

interface IManageAgeGroupContainer {
  ageGroup: IAgeGroup;
  loading: boolean;
  fetchError: boolean;
}

const ManageAgeGroupContainer: React.FC<IManageAgeGroupContainer> = ({
  ageGroup,
  loading,
  fetchError
}) => {
  return <ManageAgeGroup
    ageGroup={ageGroup}
    loading={loading}
    fetchError={fetchError}
  />;
};

export default ManageAgeGroupContainer;
