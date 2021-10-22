import _ from 'lodash';
import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

import { USER_SETTINGS_FRAGMENT } from '../../../lib/queries/user.queries';
import { authUser, getAuthUser } from '../../../lib/services/auth.service';
import GlobalAgeGroupFilterContainer from './global-age-group-filter.container';
import { buildUpdateUserSettings } from '../../../lib/services/user.service';

const GET_GLOBAL_AGE_GROUP_FILTER = gql`
  query GetGlobalAgeGroupFilter($assessmentId: ID!) {
    ageGroups(assessmentId: $assessmentId) {
      _id
      name
    }
  }
`;

const GlobalAgeGroupFilterGraphQL = () => {
  const user = getAuthUser();
  const { data, error, loading } = useQuery(GET_GLOBAL_AGE_GROUP_FILTER, {
    fetchPolicy: 'cache-and-network',
    skip: !user,
    variables: { assessmentId: user && user.settings.activeAssessmentId }
  });

  const { updateUserSettings } = buildUpdateUserSettings();
  const ageGroups = (data && data.ageGroups) || [];

  const changeActiveAgeGroups = (ageGroupIds: string[]) =>
    updateUserSettings({ activeAgeGroupIds: _.uniq(ageGroupIds) });

  return <GlobalAgeGroupFilterContainer
    activeAgeGroupIds={user?.settings.activeAgeGroupIds || []}
    changeActiveAgeGroups={changeActiveAgeGroups}
    fetchError={Boolean(error)}
    loading={loading}
    user={user}
    ageGroups={ageGroups}
  />;
};

export default GlobalAgeGroupFilterGraphQL;
