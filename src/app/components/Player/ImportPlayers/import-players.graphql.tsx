import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Data
import { buildCreatePlayerAssessments } from '../../../lib/services/player-assessment.service';
import { getAuthUser } from '../../../lib/services/auth.service';
import { buildCreateAgeGroup } from '../../../lib/services/age-group.service';
import { buildCreatePosition } from '../../../lib/services/position.service';

// Components
import ImportPlayersContainer from './import-players.container';

const GET_IMPORT_PLAYERS = gql`
  query GetImportPlayers($assessmentId: ID!, $companyId: ID!) {
    positions(companyId: $companyId, includeGlobal: true) {
      _id
      name
    }
    ageGroups(assessmentId: $assessmentId) {
      _id
      name
    }
  }
`;

interface IImportPlayersGraphQL {
  onComplete?: Function;
}

const ImportPlayersGraphQL: React.FC<IImportPlayersGraphQL> = ({ onComplete }) => {
  const user = getAuthUser();
  const { data } = useQuery(GET_IMPORT_PLAYERS, {
    skip: !user,
    variables: {
      assessmentId: user?.settings.activeAssessmentId,
      companyId: user?.settings.activeCompanyId
    },
    fetchPolicy: 'cache-and-network'
  });
  const ageGroups = (data && data.ageGroups) || [];
  const positions = (data && data.positions) || [];

  const { createPlayerAssessments } = buildCreatePlayerAssessments();
  const { createAgeGroup } = buildCreateAgeGroup();
  const { createPosition } = buildCreatePosition();

  const handleCreate = (rows: IPlayerAssessment[]) => {
    const data = rows.map(row => ({ ...row, assessmentId: user?.settings.activeAssessmentId }));

    if (onComplete) onComplete();
    return createPlayerAssessments(data);
  }

  return <ImportPlayersContainer
    user={user}
    ageGroups={ageGroups}
    positions={positions}
    createPlayerAssessments={handleCreate}
    createAgeGroup={createAgeGroup}
    createPosition={createPosition}
  />;
};

export default ImportPlayersGraphQL;
