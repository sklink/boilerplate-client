import _ from 'lodash';
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// Data
import { ASSESSMENT_SESSION_FIELDS } from '../../../lib/queries/assessment-session.queries';
import { getAuthUser } from '../../../lib/services/auth.service';
import { buildRemoveAssessmentSession, buildRestoreAssessmentSession } from '../../../lib/services/assessment-session.service';

// Components
import AssessmentSessionListContainer from './assessment-session-list.container';

// Queries
const GET_ASSESSMENT_SESSION_LIST = gql`
  query GetAssessmentSessionList($assessmentId: ID!, $ageGroupIds: [ID!]!) {
    assessmentSessions(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds) {
      ...AssessmentSessionFields
      playerCount
      ageGroup {
        name
      }
    }
    countArchivedAssessmentSessions(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds)
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;

const GET_ARCHIVED_ASSESSMENT_SESSION_LIST = gql`
  query GetArchivedAssessmentSessionList($assessmentId: ID!, $ageGroupIds: [ID!]!) {
    archivedAssessmentSessions(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds) {
      ...AssessmentSessionFields
      ageGroup {
        name
      }
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;

const AssessmentSessionListData = () => {
  const [viewingArchived, setViewingArchived] = useState(false);
  const user = getAuthUser();
  const { removeAssessmentSession } = buildRemoveAssessmentSession();
  const { restoreAssessmentSession } = buildRestoreAssessmentSession();

  const { data: sessionData, loading: sessionsLoading, error: sessionsError } = useQuery(GET_ASSESSMENT_SESSION_LIST, {
    skip: !user || viewingArchived,
    variables: { assessmentId: user?.settings.activeAssessmentId, ageGroupIds: user?.settings.activeAgeGroupIds },
    fetchPolicy: 'cache-and-network'
  });

  const { data: archivedData, loading: archivedLoading, error: archivedError } = useQuery(GET_ARCHIVED_ASSESSMENT_SESSION_LIST, {
    skip: !user || !viewingArchived,
    variables: { assessmentId: user?.settings.activeAssessmentId, ageGroupIds: user?.settings.activeAgeGroupIds },
    fetchPolicy: 'cache-and-network'
  });

  let assessmentSessions: IAssessmentSession[] = [];
  if (viewingArchived) {
    assessmentSessions = (archivedData && archivedData.archivedAssessmentSessions) || [];
  } else {
    assessmentSessions = (sessionData && sessionData.assessmentSessions) || [];
  }

  const countArchivedAssessmentSessions = (sessionData && _.isNumber(sessionData.countArchivedAssessmentSessions)) ? sessionData.countArchivedAssessmentSessions : 0;
  const loading = !assessmentSessions.length && (sessionsLoading || archivedLoading);

  return <AssessmentSessionListContainer
    loading={loading}
    assessmentSessions={assessmentSessions}
    countArchivedSessions={countArchivedAssessmentSessions}
    fetchError={Boolean(sessionsError) || Boolean(archivedError)}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    restoreSession={restoreAssessmentSession}
    removeSession={removeAssessmentSession}
  />;
};

export default AssessmentSessionListData;
