import { useMutation } from '@apollo/client';

// Data
import { REMOVE_SKILL, RESTORE_SKILL } from '../queries/skill.queries';
import { removeCacheModifier } from '../cache/basic.cache';


export const buildRemoveSkill = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REMOVE_SKILL);

  return {
    ...rest,
    removeSkill: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              skills: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeSkill: {
            __typename: 'DeleteResponse',
            _id
          }
        }
      })
  };
};

export const buildRestoreSkill = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(RESTORE_SKILL);

  return {
    ...rest,
    restoreSkill: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              archivedSkills: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          restoreSkill: {
            __typename: 'Skill',
            _id
          }
        }
      })
  };
};
