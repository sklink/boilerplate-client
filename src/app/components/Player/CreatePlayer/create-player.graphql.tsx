import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Data
import { buildCreatePlayerAssessment } from '../../../lib/services/player-assessment.service';

// Components
import CreatePlayerContainer from './create-player.container';
import { getAuthUser } from '../../../lib/services/auth.service';
import { buildCreatePosition } from '../../../lib/services/position.service';
import { buildCreateAgeGroup } from '../../../lib/services/age-group.service';
import { buildCreatePlayerContact } from '../../../lib/services/player-contact.service';
import { ICreatePlayerProps } from './create-player.interface';

const GET_CREATE_PLAYER = gql`
  query GetCreatePlayer($assessmentId: ID!, $companyId: ID!, $includeGlobal: Boolean) {
    positions(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
    ageGroups(assessmentId: $assessmentId) {
      _id
      name
    }
  }
`;

interface ICreatePlayerData {
  onComplete?: Function;
}

const CreatePlayerData: React.FC<ICreatePlayerData> = ({ onComplete }) => {
  const user = getAuthUser();
  const { data, loading, error } = useQuery(GET_CREATE_PLAYER, {
    skip: !user,
    variables: {
      assessmentId: user?.settings.activeAssessmentId,
      companyId: user?.settings.activeCompanyId,
      includeGlobal: user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });
  const positions = (data && data.positions) || [];
  const ageGroups = (data && data.ageGroups) || [];

  const { createPosition } = buildCreatePosition();
  const { createAgeGroup } = buildCreateAgeGroup();
  const { createPlayerContact } = buildCreatePlayerContact();
  const { createPlayerAssessment } = buildCreatePlayerAssessment();

  const handleCreatePlayerAssessment = (data: ICreatePlayerProps) => {
    if (onComplete) onComplete();

    return createPlayerAssessment(data);
  }

  return <CreatePlayerContainer
    createPlayerContact={createPlayerContact}
    createPlayerMutation={createPlayerAssessment}
    ageGroups={ageGroups}
    createAgeGroup={createAgeGroup}
    positions={positions}
    createPosition={createPosition}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default CreatePlayerData;
