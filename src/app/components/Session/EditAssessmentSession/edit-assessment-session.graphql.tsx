import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Data
import { ASSESSMENT_SESSION_FIELDS } from '../../../lib/queries/assessment-session.queries';
import { IEditAssessmentSessionFields } from './edit-assessment-session.interface'

// Components
import EditAssessmentSessionContainer from './edit-assessment-session.container';
import { getAuthUser } from '../../../lib/services/auth.service';
import { buildCreateAgeGroup } from '../../../lib/services/age-group.service';

const GET_EDIT_ASSESSMENT_SESSION = gql`
  query GetEditAssessmentSession($assessmentSessionId: ID!, $assessmentId: ID!) {
    assessmentSession(_id: $assessmentSessionId) {
      ...AssessmentSessionFields
      ageGroup {
        _id
        name
      }
    }
    ageGroups(assessmentId: $assessmentId) {
      _id
      name
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;

const EDIT_SESSION = gql`
  mutation EditAssessmentSession($_id: ID!, $data: UpdateAssessmentSessionInput!, $notify: Boolean) {
    updateAssessmentSession(_id: $_id, data: $data, notify: $notify) {
      ...AssessmentSessionFields
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;

interface IEditAssessmentSessionGraphQL {
  assessmentSessionId: string;
}

const EditAssessmentSessionGraphQL: React.FC<IEditAssessmentSessionGraphQL> = ({ assessmentSessionId }) => {
  const user = getAuthUser();
  const { data, loading, error } = useQuery(GET_EDIT_ASSESSMENT_SESSION, {
    skip: !user,
    variables: { assessmentSessionId, assessmentId: user?.settings.activeAssessmentId },
    fetchPolicy: 'cache-and-network'
  });

  const ageGroups = (data && data.ageGroups) || [];
  const assessmentSession = data && data.assessmentSession;

  const { createAgeGroup } = buildCreateAgeGroup();
  const [updateAssessmentSessionMutation]  = useMutation(EDIT_SESSION);

  const updateAssessmentSession = (data: IEditAssessmentSessionFields, notify?: boolean) => updateAssessmentSessionMutation({
    variables: { _id: assessmentSessionId, data, notify },
    optimisticResponse: {
      __typename: 'Mutation',
      updateAssessmentSession: {
        __typename: 'AssessmentSession',
        _id: assessmentSessionId,
        ...data
      }
    }
  });

  return <EditAssessmentSessionContainer
    assessmentSession={assessmentSession}
    updateAssessmentSession={updateAssessmentSession}
    createAgeGroup={createAgeGroup}
    ageGroups={ageGroups}
    ageGroupsLoading={loading}
    ageGroupsError={error}
  />;
};

export default EditAssessmentSessionGraphQL;
