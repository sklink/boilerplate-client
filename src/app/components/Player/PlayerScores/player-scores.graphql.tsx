import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { ASSESSMENT_SESSION_FIELDS } from '../../../lib/queries/assessment-session.queries';
import _ from 'lodash';
import { getAuthUser } from '../../../lib/services/auth.service';
import PlayerScoresContainer from './player-scores.container';


const GET_PLAYER_SCORE_SESSIONS = gql`
  query GetPlayerScoreSessions($playerAssessmentId: ID!) {
    playerAssessmentSessions(playerAssessmentId: $playerAssessmentId) {
      _id
      date
      start
    }
  }
`;

const GET_PLAYER_SCORES = gql`
  query GetPlayerScores($companyId: ID!, $assessmentSessionId: ID!, $playerAssessmentId: ID!) {
    drills(companyId: $companyId, includeGlobal: true) {
      _id
      name
    }
    skills(companyId: $companyId, includeGlobal: true) {
      _id
      name
    }
    assessmentSessionScores(assessmentSessionId: $assessmentSessionId, playerAssessmentId: $playerAssessmentId) {
      raw
      type
      drillId
      skillId
      userId
      round
    }
    allMembers(companyId: $companyId) {
      user {
        _id
        name
      }
    }
  }
`;

interface IPlayerScoresGraphQL {
  playerAssessmentId: string;
}

const PlayerScoresGraphQL: React.FC<IPlayerScoresGraphQL> = ({ playerAssessmentId }) => {
  const [activeAssessmentSessionId, setActiveAssessmentSessionId] = useState();
  const { data, loading, error } = useQuery(GET_PLAYER_SCORE_SESSIONS, {
    variables: { playerAssessmentId },
    fetchPolicy: 'cache-and-network'
  });

  const assessmentSessions: IAssessmentSession[] = (data && data.playerAssessmentSessions) || [];

  const user = getAuthUser();
  const { data: sessionResult, loading: sessionLoading, error: sessionError } = useQuery(GET_PLAYER_SCORES, {
    skip: !activeAssessmentSessionId,
    variables: {
      assessmentSessionId: activeAssessmentSessionId,
      companyId: user?.settings.activeCompanyId,
      playerAssessmentId
    },
    fetchPolicy: 'cache-and-network'
  });

  const skills = (sessionResult && sessionResult.skills) || [];
  const drills = (sessionResult && sessionResult.drills) || [];
  const scores = (sessionResult && sessionResult.assessmentSessionScores) || [];
  const members = (sessionResult && sessionResult.allMembers) || [];

  console.log(scores);

  return <PlayerScoresContainer
    assessmentSessions={assessmentSessions}
    skills={skills}
    drills={drills}
    members={members}
    scores={scores}
    loading={loading || sessionLoading}
    fetchError={Boolean(error) || Boolean(sessionError)}
    setActiveAssessmentSessionId={setActiveAssessmentSessionId}
  />;
};

export default PlayerScoresGraphQL;
