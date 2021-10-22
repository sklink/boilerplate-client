import React from 'react';
import { gql, useMutation } from '@apollo/client';

// Data
import { ASSESSMENT_SESSION_FIELDS } from '../../../lib/queries/assessment-session.queries';
import { createCacheModifier } from '../../../lib/cache/basic.cache';
import { ICreateAssessmentSessionFields } from './create-assessment-session.interface';
import { buildCreateAgeGroup, getAgeGroups } from '../../../lib/services/age-group.service';
import { getAuthUser } from '../../../lib/services/auth.service';

// Components
import CreateAssessmentSessionContainer from './create-assessment-session.container';

const CREATE_SESSION = gql`
  mutation CreateAssessmentSession($data: CreateAssessmentSessionInput!) {
    createAssessmentSession(data: $data) {
      ...AssessmentSessionFields
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;

interface ICreateSessionData {
  onComplete?: Function;
}

const CreateSessionData: React.FC<ICreateSessionData> = ({ onComplete }) => {
  const user = getAuthUser();
  const { ageGroups, loading, error } = getAgeGroups();

  const { createAgeGroup } = buildCreateAgeGroup();
  const [createAssessmentSessionMutation]  = useMutation(CREATE_SESSION);

  const createAssessmentSession = (data: ICreateAssessmentSessionFields) => {
    if (onComplete) onComplete();

    return createAssessmentSessionMutation({
      variables: { data: { ...data, assessmentId: user?.settings?.activeAssessmentId } },
      update: (cache, { data }) => {
        if (data) {
          cache.modify({
            fields: {
              assessmentSessions: createCacheModifier({
                cache,
                createdDoc: data.createAssessmentSession,
                fragment: ASSESSMENT_SESSION_FIELDS,
                fragmentName: 'AssessmentSessionFields',
                modelName: 'AssessmentSession'
              })
            }
          })
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createAssessmentSession: {
          __typename: 'AssessmentSession',
          ...data
        }
      }
    });
  }

  return <CreateAssessmentSessionContainer
    createAssessmentSession={createAssessmentSession}
    createAgeGroup={createAgeGroup}
    ageGroups={ageGroups}
    ageGroupsLoading={loading}
    ageGroupsError={error}
  />;
};

export default CreateSessionData;
