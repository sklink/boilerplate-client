import React from 'react';
import { gql, useQuery } from '@apollo/client';
import ManageAgeGroupContainer from './manage-age-group.container';

const GET_MANAGE_AGE_GROUP = gql`
  query GetManageAgeGroupGraphQL($ageGroupId: ID!) {
    ageGroup(_id: $ageGroupId) {
      _id
      name
      numSessions
      numPlayers
      currentStageNum
      currentStage {
        _id
        type
        config
        endsAt
        order
        isReady
      }
      nextStage {
        _id
        type
        config
        order
      }
    }
  }
`;

interface IManageAgeGroupGraphQL {
  ageGroupId: string;
}

const ManageAgeGroupGraphQL: React.FC<IManageAgeGroupGraphQL> = ({ ageGroupId }) => {
  const { data, loading, error } = useQuery(GET_MANAGE_AGE_GROUP, {
    skip: !ageGroupId,
    variables: { ageGroupId },
    fetchPolicy: 'cache-and-network'
  });

  const ageGroup = data && data.ageGroup;

  return <ManageAgeGroupContainer
    ageGroup={ageGroup}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default ManageAgeGroupGraphQL;
