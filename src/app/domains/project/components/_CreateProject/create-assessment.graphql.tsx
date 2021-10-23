import React from 'react';
import CreateAssessmentContainer from './create-assessment.container';
import { gql, useMutation } from '@apollo/client';

// Queries
import { ASSESSMENT_FIELDS } from '../../assessment.queries';
import { createCacheModifier } from '../../../../lib/cache/basic.cache';
import { authUser, getAuthUser } from '../../../_auth/auth.service';

const CREATE_ASSESSMENT_MUTATION = gql`
  mutation CreateAssessment($data: CreateAssessmentInput!) {
    createAssessment(data: $data) {
      ...AssessmentFields
    }
  }

  ${ASSESSMENT_FIELDS}
`;

const CreateAssessmentGraphQL = () => {
  const user = getAuthUser();
  const [mutation] = useMutation(CREATE_ASSESSMENT_MUTATION);

  const createAssessmentMutation = (data: any) => mutation({
    variables: { data },
    update: (cache, { data }) => {
      if (data) {
        const createdAssessment = data.createAssessment;

        cache.modify({
          fields: {
            assessments: createCacheModifier({
              cache,
              createdDoc: createdAssessment,
              fragment: ASSESSMENT_FIELDS,
              fragmentName: 'AssessmentFields',
              modelName: 'Assessment'
            })
          }
        });

        if (user) {
          authUser({
            ...user,
            settings: {...user.settings, activeAssessmentId: createdAssessment._id}
          });
        }
      }
    },
    optimisticResponse: {
      __typename: 'Mutation',
      createSession: {
        __typename: 'Assessment',
        ...data
      }
    }
  });

  return <CreateAssessmentContainer createAssessmentMutation={createAssessmentMutation} />;
};

export default CreateAssessmentGraphQL;
