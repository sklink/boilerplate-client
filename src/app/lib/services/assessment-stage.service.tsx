import { useMutation } from '@apollo/client';

import {
  ASSESSMENT_STAGE_FIELDS,
  CREATE_ASSESSMENT_STAGE, REMOVE_ASSESSMENT_STAGE,
  UPDATE_ASSESSMENT_STAGE
} from '../queries/assessment-stage.queries';
import { createCacheModifier, removeCacheModifier } from '../cache/basic.cache';
import { getAuthUser } from './auth.service';

interface CreateAssessmentStageProps {
  order: number;
  type: string;
  config: object;
}

export const buildCreateAssessmentStage = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(CREATE_ASSESSMENT_STAGE);

  return {
    ...rest,
    createAssessmentStage: (data: CreateAssessmentStageProps) =>
      mutation({
        variables: { data: { ...data, assessmentId: user?.settings.activeAssessmentId } },
        update: (cache, { data }) => {
          if (data) {
            const createdDoc = data.createAssessmentStage;

            cache.modify({
              fields: {
                assessmentStages: createCacheModifier({
                  cache,
                  createdDoc,
                  fragmentName: 'AssessmentStageFields',
                  fragment: ASSESSMENT_STAGE_FIELDS,
                  modelName: 'AssessmentStage',
                  append: true
                })
              }
            });
          }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createAssessmentStage: {
            __typename: 'AssessmentStage',
            ...data,
            assessmentId: user?.settings.activeAssessmentId
          }
        }
      })
  };
};

interface UpdateAssessmentStageProps {
  order?: number;
  config?: object;
}

export const buildUpdateAssessmentStage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(UPDATE_ASSESSMENT_STAGE);

  return {
    ...rest,
    updateAssessmentStage: (_id: string, data: UpdateAssessmentStageProps) =>
      mutation({
        variables: { _id, data },
        optimisticResponse: {
          __typename: 'Mutation',
          updateAssessmentStage: {
            __typename: 'AssessmentStage',
            _id,
            data
          }
        }
      })
  };
};

export const buildRemoveAssessmentStage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REMOVE_ASSESSMENT_STAGE);

  return {
    ...rest,
    removeAssessmentStage: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              assessmentStages: removeCacheModifier(cache, _id)
            }
          })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeAssessmentStage: {
            __typename: 'DeleteResponse',
            _id
          }
        }
      })
  };
};

