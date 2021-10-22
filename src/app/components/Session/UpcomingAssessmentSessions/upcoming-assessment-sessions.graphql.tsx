import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Components
import UpcomingAssessmentSessionsContainer from './upcoming-assessment-sessions.container';

// Data
import { ASSESSMENT_SESSION_FIELDS } from '../../../lib/queries/assessment-session.queries';
import { getAuthUser } from '../../../lib/services/auth.service';
import { getCurrMember } from '../../../lib/services/member.service';

const GET_UPCOMING_ASSESSMENT_SESSIONS = gql`
  query GetUpcomingAssessmentSessions($assessmentId: ID!, $ageGroupIds: [ID!]!) {
    assessmentSessions(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds) {
      ...AssessmentSessionFields
      playerCount
      drillCount
      practicePlanCount
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;

const UpcomingAssessmentSessionsGraphQL = () => {
  const user = getAuthUser();
  const { member, loading: memberLoading, error: memberError } = getCurrMember();

  const { data, loading, error } = useQuery(GET_UPCOMING_ASSESSMENT_SESSIONS, {
    variables: { assessmentId: user?.settings?.activeAssessmentId, ageGroupIds: user?.settings.activeAgeGroupIds },
    fetchPolicy: 'cache-and-network'
  });

  const assessmentSessions = (data && data.assessmentSessions) || [];

  return <UpcomingAssessmentSessionsContainer
    assessmentSessions={assessmentSessions}
    member={member}
    loading={loading || memberLoading}
    fetchError={Boolean(error) || Boolean(memberError)}
  />;
};

export default UpcomingAssessmentSessionsGraphQL;
