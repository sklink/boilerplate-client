import _ from 'lodash';
import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Components
import SkillGroupNavigationContainer from './skill-group-navigation.container';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';

const GET_SKILL_GROUP_NAVIGATION = gql`
    query GetSkillGroupNavigation($companyId: ID!, $includeGlobal: Boolean) {
      countDrills(companyId: $companyId, includeGlobal: $includeGlobal)
      countSkills(companyId: $companyId, includeGlobal: $includeGlobal)
    }
`;

interface ISkillGroupNavigationGraphQL {
  currentLocation: string;
}

const SkillGroupNavigationGraphQL: React.FC<ISkillGroupNavigationGraphQL> = ({ currentLocation }) => {
  const user = getAuthUser();
  const { data, loading, error } = useQuery(GET_SKILL_GROUP_NAVIGATION, {
    skip: !user,
    variables: { companyId: user?.settings.activeCompanyId, includeGlobal: user?.settings.includeGlobal },
    fetchPolicy: 'cache-and-network'
  });

  const countDrills = (data && _.isNumber(data.countDrills)) ? data.countDrills : -1;
  const countSkills = (data && _.isNumber(data.countSkills)) ? data.countSkills : -1;

  return <SkillGroupNavigationContainer
    currentLocation={currentLocation}
    countDrills={countDrills}
    countSkills={countSkills}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default SkillGroupNavigationGraphQL;
