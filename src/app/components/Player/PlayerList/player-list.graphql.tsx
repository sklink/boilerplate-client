import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Components
import PlayerListContainer from './player-list.container';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';
import { PLAYER_FIELDS } from '../../../lib/queries/player.queries';
import {buildRemovePlayerAssessment} from "../../../lib/services/player-assessment.service";

const GET_PLAYER_LIST = gql`
  query GetPlayerList($assessmentId: ID!, $ageGroupIds: [ID!]!) {
    playerAssessments(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds) {
      _id
      player {
        ...PlayerFields
      }
      position {
        name
      }
      ageGroup {
        name
      }
      assessmentSessionCount
    }
  }

  ${PLAYER_FIELDS}
`;

const PlayerListData = () => {
  const user = getAuthUser();
  const { removePlayerAssessment } = buildRemovePlayerAssessment();
  const { data, loading, error } = useQuery(GET_PLAYER_LIST, {
    skip: !user,
    variables: { assessmentId: user?.settings.activeAssessmentId, ageGroupIds: user?.settings.activeAgeGroupIds },
    fetchPolicy: 'cache-and-network'
  });
  const playerAssessments = (data && data.playerAssessments) || [];

  return <PlayerListContainer
    removePlayerAssessment={removePlayerAssessment}
    playerAssessments={playerAssessments}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default PlayerListData;
