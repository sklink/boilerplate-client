import _ from 'lodash';
import { useMutation } from "@apollo/client";

// Data
import {
  ADD_PLAYER_TO_ASSESSMENT,
  CREATE_PLAYER_ASSESSMENT,
  CREATE_PLAYER_ASSESSMENTS,
  PLAYER_ASSESSMENT_FIELDS,
  REMOVE_PLAYER_ASSESSMENT, UPDATE_PLAYER_ASSESSMENT
} from "../queries/player-assessment.queries";
import { createCacheModifier, removeCacheModifier } from "../cache/basic.cache";
import { ICreatePlayerProps } from '../../components/Player/CreatePlayer/create-player.interface';
import { getAuthUser } from './auth.service';

interface IAddPlayerToAssessmentProps {
  playerId: string;
  ageGroupId: string;
  positionId: string;
}

export const buildAddPlayerToAssessment = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(ADD_PLAYER_TO_ASSESSMENT);

  return {
    ...rest,
    addPlayerToAssessment: (data: IAddPlayerToAssessmentProps) => {
      return mutation({
        variables: { data: { ...data, assessmentId: user?.settings.activeAssessmentId } },
        update: (cache, { data }) => {
          console.log('result', data);
          if (data) {
            const playerAssessment = data.addPlayerToAssessment;

            cache.modify({
              fields: {
                playerAssessments: createCacheModifier({
                  cache,
                  createdDoc: playerAssessment,
                  fragment: PLAYER_ASSESSMENT_FIELDS,
                  fragmentName: 'PlayerAssessmentFields',
                  modelName: 'PlayerAssessment'
                })
              }
            })
          }
        }
      })
    }
  }
};

export const buildRemovePlayerAssessment = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REMOVE_PLAYER_ASSESSMENT);

  return {
    ...rest,
    removePlayerAssessment: (_id: string) => mutation({
      variables: { _id },
      update: cache => {
        cache.modify({
          fields: {
            playerAssessments: removeCacheModifier(cache, _id)
          }
        })
      },
      optimisticResponse: {
        __typename: 'Mutation',
        removePlayerAssessment: {
          __typename: 'DeleteResponse',
          _id
        }
      }
    })
  };
};

export const buildCreatePlayerAssessment = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(CREATE_PLAYER_ASSESSMENT);

  return {
    ...rest,
    createPlayerAssessment: (data: ICreatePlayerProps) => mutation({
      variables: {data, companyId: user?.settings.activeCompanyId},
      update: (cache, {data}) => {
        if (data) {
          cache.modify({
            fields: {
              playerAssessments: createCacheModifier({
                cache,
                createdDoc: data.createPlayerAssessment,
                fragment: PLAYER_ASSESSMENT_FIELDS,
                fragmentName: 'PlayerAssessmentFields',
                modelName: 'PlayerAssessment'
              })
            }
          })
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createPlayerAssessment: {
          __typename: 'PlayerAssessment',
          ageGroup: {
            _id: data.ageGroupId
          },
          position: {
            _id: data.positionId
          },
          player: {
            ..._.omit(data, ['positionId', 'ageGroupId'])
          }
        }
      }
    })
  };
};


export const buildCreatePlayerAssessments = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(CREATE_PLAYER_ASSESSMENTS);

  return {
    ...rest,
    createPlayerAssessments: (rows: any[]) => {
      return mutation({
        variables: { rows, companyId: user?.settings.activeCompanyId },
        update: (cache, { data }) => {
          if (data) {
            const createdPlayerAssessment = data.createPlayerAssessments;

            cache.modify({
              fields: {
                playerAssessments: createCacheModifier({
                  cache,
                  createdDoc: createdPlayerAssessment,
                  fragment: PLAYER_ASSESSMENT_FIELDS,
                  fragmentName: 'PlayerAssessmentFields',
                  modelName: 'PlayerAssessment'
                })
              }
            })
          }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createPlayerAssessments: rows.map(row => ({
            __typename: 'PlayerAssessment',
            ageGroup: {
              _id: row.ageGroupId
            },
            position: {
              _id: row.positionId
            },
            player: {
              ..._.omit(row.player, ['contacts'])
            }
          }))
        }
      })
    }
  }
};

export const buildUpdatePlayerAssessment = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(UPDATE_PLAYER_ASSESSMENT, {
    context: {
      serializationKey: 'MUTATION',
      tracked: true,
    },
  });

  return {
    ...rest,
    updatePlayerAssessment: (_id: string, data: { positionId?: string }) =>
      mutation({
        variables: { _id, data }
      })
  };
};
