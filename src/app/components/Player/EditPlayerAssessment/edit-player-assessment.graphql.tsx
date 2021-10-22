import React from 'react';
import { gql, useQuery } from '@apollo/client';
import EditPlayerAssessmentContainer from './edit-player-assessment.container';
import { buildUpdatePlayerAssessment } from '../../../lib/services/player-assessment.service';
import { getAuthUser } from '../../../lib/services/auth.service';

const GET_EDIT_PLAYER_ASSESSMENT = gql`
  query GetEditPlayerAssessment($_id: ID!, $companyId: ID!, $includeGlobal: Boolean) {
    playerAssessment(_id: $_id) {
      _id
      position {
        _id
        name
      }
    }
    positions(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
  }
`;

interface IEditPlayerAssessmentGraphQL {
  playerAssessmentId: string;
}

const EditPlayerAssessmentGraphQL: React.FC<IEditPlayerAssessmentGraphQL> = ({ playerAssessmentId }) => {
  const user = getAuthUser();
  const { updatePlayerAssessment } = buildUpdatePlayerAssessment();
  const { data, error, loading } = useQuery(GET_EDIT_PLAYER_ASSESSMENT, {
    variables: {
      _id: playerAssessmentId,
      companyId: user?.settings.activeCompanyId,
      includeGlobal: user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });

  const playerAssessment = data && data.playerAssessment;
  const positions = (data && data.positions) || [];

  return <EditPlayerAssessmentContainer
    playerAssessment={playerAssessment}
    loading={loading}
    positions={positions}
    updatePlayerAssessment={updatePlayerAssessment}
  />;
};

export default EditPlayerAssessmentGraphQL;
