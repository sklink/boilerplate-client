import _ from 'lodash';
import { useMutation } from '@apollo/client';

import {
  ASSESSMENT_SESSION_FIELDS, ASSIGN_JERSEY,
  CREATE_ASSESSMENT_SESSIONS, REMOVE_CHECKED_IN_PLAYER, UNASSIGN_JERSEY
} from '../queries/assessment-session.queries';
import { getAuthUser } from './auth.service';
import { createCacheModifier, removeCacheModifier } from '../cache/basic.cache';
import { REMOVE_ASSESSMENT_SESSION, RESTORE_ASSESSMENT_SESSION } from '../queries/assessment-session.queries';
import { nanoid } from 'nanoid';

export const buildCreateAssessmentSessions = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(CREATE_ASSESSMENT_SESSIONS);

  return {
    ...rest,
    createAssessmentSessions: (rows: IAssessmentSession[]) => {
      return mutation({
        variables: { rows, assessmentId: user?.settings.activeAssessmentId },
        update: (cache, { data }) => {
          if (data) {
            const createdAssessmentSessions = data.createAssessmentSessions;

            cache.modify({
              fields: {
                assessmentSessions: createCacheModifier({
                  cache,
                  createdDoc: createdAssessmentSessions,
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
          createAssessmentSessions: rows
        }
      })
    }
  }
};

export const buildRemoveAssessmentSession = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REMOVE_ASSESSMENT_SESSION);

  return {
    ...rest,
    removeAssessmentSession: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              assessmentSessions: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeAssessmentSession: {
            __typename: 'DeleteResponse',
            _id
          }
        }
      })
  };
};

export const buildRestoreAssessmentSession = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(RESTORE_ASSESSMENT_SESSION);

  return {
    ...rest,
    restoreAssessmentSession: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              archivedAssessmentSessions: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          restoreAssessmentSession: {
            __typename: 'AssessmentSession',
            _id
          }
        }
      })
  };
};

export const buildAssignJersey = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(ASSIGN_JERSEY, {
    context: {
      serializationKey: 'MUTATION',
      tracked: true,
    },
  });

  return {
    ...rest,
    assignJersey: (_id: string, playerAssessmentId: string, jersey: IJersey) =>
      mutation({
        variables: { _id, playerAssessmentId, jersey },
        update: cache => {
          cache.modify({
            id: `AssessmentSession:${_id}`,
            fields: {
              checkedInPlayerIds: _ids => [..._ids, playerAssessmentId]
            }
          });
        }
      })
  };
};

export const buildRemoveCheckedInPlayer = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REMOVE_CHECKED_IN_PLAYER, {
    context: {
      serializationKey: 'MUTATION',
      tracked: true,
    }
  });

  return {
    ...rest,
    removeCheckedInPlayer: (_id: string, playerAssessmentId: string) => {
      return mutation({
        variables: { _id, playerAssessmentId },
        update: (cache, { data }) => {
          if (data) {
            cache.modify({
              id: `AssessmentSession:${_id}`,
              fields: {
                checkedInPlayerIds: _ids => _.without(_ids, playerAssessmentId)
              }
            })
          }
        },
        optimisticResponse: {
          removeCheckedInPlayer: {
            _id: nanoid(),
            checkedInPlayers: [{ _id }]
          }
        }
      })
    }
  }
};
