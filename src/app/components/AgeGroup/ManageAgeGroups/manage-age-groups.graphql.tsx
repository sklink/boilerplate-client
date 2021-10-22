import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';

// Components
import ManageAgeGroupsContainer from './manage-age-groups.container';

const GET_MANAGE_AGE_GROUPS = gql`
  query GetManageAgeGroups($assessmentId: ID!) {
    ageGroups(assessmentId: $assessmentId) {
      _id
      name
      numSessions
      numPlayers
      currentStageNum
      currentStage {
        type
        config
        endsAt
        order
        isReady
      }
      nextStage {
        type
        config
        order
      }
    }
  }
`;

const ACTIVATE_ASSESSMENT_STAGES = gql`
  mutation ActivateAssessmentStages($ageGroupId: ID!) {
    activateAssessmentStages(ageGroupId: $ageGroupId) {
      success
    }
  }
`;

const ManageAgeGroupsGraphQL = () => {
  const user = getAuthUser();
  const [activateAssessmentStages] = useMutation(ACTIVATE_ASSESSMENT_STAGES);
  const { data, error, loading, refetch } = useQuery(GET_MANAGE_AGE_GROUPS, {
    fetchPolicy: 'cache-and-network',
    skip: !user,
    variables: { assessmentId: user && user.settings.activeAssessmentId }
  });

  const ageGroups = (data && data.ageGroups) || [];

  const handleActivateAssessmentStages = (ageGroupId: string) => {
    return activateAssessmentStages({
      variables: { ageGroupId }
    }).then(() => refetch());
  }

  return <ManageAgeGroupsContainer
    fetchError={Boolean(error)}
    loading={loading}
    ageGroups={ageGroups}
    activateAgeGroup={handleActivateAssessmentStages}
  />;
};

export default ManageAgeGroupsGraphQL;
