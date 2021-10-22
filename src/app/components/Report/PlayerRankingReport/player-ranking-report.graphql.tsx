import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

import PlayerRankingReportContainer from './player-ranking-report.container';
import { getAuthUser } from '../../../lib/services/auth.service';

const GET_PLAYER_RANKINGS = gql`
  query GetPlayerRankings($assessmentId: ID!, $ageGroupId: ID!) {
    ageGroup(_id: $ageGroupId) {
      _id
      name
    }
    playerAssessments(assessmentId: $assessmentId, ageGroupIds: [$ageGroupId]) {
      _id
      level
      team
      attendanceCount
      player {
        _id
        code
        firstName
        lastName
      }
      position {
        name
      }
      contacts {
        name
        email
        phone
      }
      weightedScore
    }
  }
`;

const ASSIGN_LEVEL = gql`
  mutation AssignLevel($assessmentId: ID!, $playerAssessmentIds: [ID!]!, $level: String!) {
    assignLevel(assessmentId: $assessmentId, playerAssessmentIds: $playerAssessmentIds, level: $level) {
      _id
      level
    }
  }
`;

const ASSIGN_TEAM = gql`
  mutation AssignTeam($assessmentId: ID!, $playerAssessmentIds: [ID!]!, $team: String!) {
    assignTeam(assessmentId: $assessmentId, playerAssessmentIds: $playerAssessmentIds, team: $team) {
      _id
      team
    }
  }
`;

interface IPlayerRankingReportGraphQL {
  ageGroupId: string;
}

const PlayerRankingReportGraphQL: React.FC<IPlayerRankingReportGraphQL> = ({ ageGroupId }) => {
  const user = getAuthUser();
  const [assignLevelMutation] = useMutation(ASSIGN_LEVEL);
  const [assignTeamMutation] = useMutation(ASSIGN_TEAM);
  const { data, error, loading } = useQuery(GET_PLAYER_RANKINGS, {
    variables: {
      assessmentId: user?.settings.activeAssessmentId,
      ageGroupId
    },
    fetchPolicy: 'cache-and-network'
  });

  const playerAssessments = (data && data.playerAssessments) || [];
  const ageGroup = (data && data.ageGroup);

  const handleAssignLevel = (playerAssessmentIds: string[], level: string) => {
    if (window.confirm(`Are you sure you want to send level assignments to ${playerAssessmentIds.length} players?`)) {
      assignLevelMutation({
        variables: {
          playerAssessmentIds,
          level,
          assessmentId: user?.settings.activeAssessmentId
        },
      });
    }
  }

  const handleAssignTeam = (playerAssessmentIds: string[], team: string) => {
    if (window.confirm(`Are you sure you want to send team assignments to ${playerAssessmentIds.length} players?`)) {
      assignTeamMutation({
        variables: {
          playerAssessmentIds,
          team,
          assessmentId: user?.settings.activeAssessmentId
        },
      });
    }
  }

  return <PlayerRankingReportContainer
    ageGroup={ageGroup}
    playerAssessments={playerAssessments}
    loading={loading}
    fetchError={Boolean(error)}
    assignLevel={handleAssignLevel}
    assignTeam={handleAssignTeam}
  />;
};

export default PlayerRankingReportGraphQL;
