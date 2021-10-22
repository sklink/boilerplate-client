import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// Components
import CompanyPlayerListContainer from './company-player-list.container'

// Data
import { getAuthUser } from '../../../lib/services/auth.service';
import { PLAYER_FIELDS } from '../../../lib/queries/player.queries';
import { buildAddPlayerToAssessment } from "../../../lib/services/player-assessment.service";
import { getAgeGroups } from '../../../lib/services/age-group.service';

const GET_COMPANY_PLAYER_DROPDOWNS = gql`
  query GetCompanyPlayerDropdowns($assessmentId: ID!, $companyId: ID!) {
    ageGroups(assessmentId: $assessmentId) {
      _id
      name
    }
    positions(companyId: $companyId, includeGlobal: true) {
      _id
      name
    }
  }
`;
const GET_COMPANY_PLAYER_LIST = gql`
  query GetCompanyPlayerList($companyId: ID!, $assessmentId: ID!, $ageGroupIds: [ID!]!) {
    playerAssessments(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds) {
      player {
        _id
      }
    }
    players(companyId: $companyId) {
      ...PlayerFields
    }
  }

  ${PLAYER_FIELDS}
`;

const CompanyPlayerListGraphQL = () => {
  const user = getAuthUser();
  const { addPlayerToAssessment } = buildAddPlayerToAssessment();
  const [activeAgeGroup, setActiveAgeGroup] = useState();

  const { data: dropdownResult, loading: dropdownLoading, error: dropdownError } = useQuery(GET_COMPANY_PLAYER_DROPDOWNS, {
    skip: !user,
    variables: {
      assessmentId: user?.settings.activeAssessmentId,
      companyId: user?.settings.activeCompanyId
    },
    fetchPolicy: 'cache-and-network'
  });

  const ageGroups = (dropdownResult && dropdownResult.ageGroups) || [];
  const positions = (dropdownResult && dropdownResult.positions) || [];

  const { data, loading, error } = useQuery(GET_COMPANY_PLAYER_LIST, {
    skip: !user || !activeAgeGroup,
    variables: {
      companyId: user?.settings.activeCompanyId,
      assessmentId: user?.settings.activeAssessmentId,
      ageGroupIds: [activeAgeGroup],
    },
    fetchPolicy: 'cache-and-network'
  });

  const playerAssessments = (data && data.playerAssessments) || [];
  const players = (data && data.players) || [];

  return <CompanyPlayerListContainer
    playerAssessments={playerAssessments}
    addPlayerToAssessment={addPlayerToAssessment}
    players={players}
    positions={positions}
    ageGroups={ageGroups}
    loading={loading || dropdownLoading}
    fetchError={Boolean(error) || Boolean(dropdownError)}
    setActiveAgeGroup={setActiveAgeGroup}
    activeAgeGroup={activeAgeGroup}
  />;
};

export default CompanyPlayerListGraphQL;
