import { useMutation } from '@apollo/client';

// Data
import { REMOVE_DRILL, RESTORE_DRILL } from '../queries/drill.queries';
import { removeCacheModifier } from '../cache/basic.cache';


export const buildRemoveDrill = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REMOVE_DRILL);

  return {
    ...rest,
    removeDrill: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              drills: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeDrill: {
            __typename: 'DeleteResponse',
            _id
          }
        }
      })
  };
};

export const buildRestoreDrill = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(RESTORE_DRILL);

  return {
    ...rest,
    restoreDrill: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              archivedDrills: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          restoreDrill: {
            __typename: 'Drill',
            _id
          }
        }
      })
  };
};
