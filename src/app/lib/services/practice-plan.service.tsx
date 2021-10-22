import { useMutation } from '@apollo/client';

// Data
import { REMOVE_PRACTICE_PLAN, RESTORE_PRACTICE_PLAN } from '../queries/practice-plan.queries';
import { removeCacheModifier } from '../cache/basic.cache';


export const buildRemovePracticePlan = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REMOVE_PRACTICE_PLAN);

  return {
    ...rest,
    removePracticePlan: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              practicePlans: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removePracticePlan: {
            __typename: 'DeleteResponse',
            _id
          }
        }
      })
  };
};

export const buildRestorePracticePlan = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(RESTORE_PRACTICE_PLAN);

  return {
    ...rest,
    restorePracticePlan: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              archivedPracticePlans: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          restorePracticePlan: {
            __typename: 'PracticePlan',
            _id
          }
        }
      })
  };
};
