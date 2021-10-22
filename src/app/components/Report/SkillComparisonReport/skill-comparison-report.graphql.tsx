import React from 'react';
import { gql, useQuery } from '@apollo/client';

import { getAuthUser } from '../../../lib/services/auth.service';
import SkillComparisonReportContainer from './skill-comparison-report.container';

const GET_SKILL_COMPARISON = gql`
  query GetSkillComparison($assessmentId: ID!, $ageGroupId: ID!, $companyId: ID!) {
    ageGroup(_id: $ageGroupId) {
      name
    }
    skillSummaries(assessmentId: $assessmentId, ageGroupId: $ageGroupId) {
      mean
      meanTime
      best
      bestTime
      skillId
      playerAssessmentId
    }
    playerAssessments(assessmentId: $assessmentId, ageGroupIds: [$ageGroupId]) {
      _id
      level
      team
      player {
        firstName
        lastName
      }
      position {
        name
      }
      weightedScore
    }
    skills(companyId: $companyId, includeGlobal: true) {
      _id
      name
    }
  }
`;

interface ISkillComparisonReportGraphQL {
  ageGroupId: string;
}

const SkillComparisonReportGraphQL: React.FC<ISkillComparisonReportGraphQL> = ({ ageGroupId }) => {
  const user = getAuthUser();
  const { data, error, loading } = useQuery(GET_SKILL_COMPARISON, {
    variables: {
      assessmentId: user?.settings.activeAssessmentId,
      companyId: user?.settings.activeCompanyId,
      ageGroupId,
    },
    fetchPolicy: 'cache-and-network'
  });

  const ageGroup = data && data.ageGroup;
  const skills = (data && data.skills) || [];
  const skillSummaries = (data && data.skillSummaries) || [];
  const playerAssessments = (data && data.playerAssessments) || [];

  return <SkillComparisonReportContainer
    ageGroup={ageGroup}
    skills={skills}
    skillSummaries={skillSummaries}
    playerAssessments={playerAssessments}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default SkillComparisonReportGraphQL;
