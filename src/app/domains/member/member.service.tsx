import _ from 'lodash';
import { useMutation, useQuery } from '@apollo/client';

import {
  GET_CURR_MEMBER,
  GET_MEMBERS,
  MEMBER_FIELDS,
  RESTORE_MEMBER_ACCESS,
  REVOKE_MEMBER_ACCESS
} from './member.queries';
import { createCacheModifier, removeCacheModifier } from '../../lib/cache/basic.cache';
import { getAuthUser } from '../_auth/auth.service';

export const getCurrMember = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, ...rest } = useQuery(GET_CURR_MEMBER, {
    fetchPolicy: 'cache-and-network',
  });

  return { ...rest, member: _.get(data, 'getCurrMember') };
};

export const buildRevokeMemberAccess = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REVOKE_MEMBER_ACCESS);

  return {
    ...rest,
    revokeMemberAccess: (_id: string) =>
      mutation({
        variables: { _id },
        update: cache => {
          cache.modify({
            fields: {
              members: removeCacheModifier(cache, _id)
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          revokeMemberAccess: {
            __typename: 'DeleteResponse',
            _id
          }
        }
      })
  };
};

export const buildRestoreMemberAccess = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(RESTORE_MEMBER_ACCESS);

  return {
    ...rest,
    restoreMemberAccess: (_id: string) => mutation({
      variables: { _id },
      update: (cache, { data }) => {
        if (data) {
          const restoredMember = data.restoreMemberAccess;

          cache.modify({
            fields: {
              members: createCacheModifier({
                cache,
                createdDoc: restoredMember,
                modelName: 'Member',
                fragment: MEMBER_FIELDS,
                fragmentName: 'MemberFields'
              })
            }
          })
        }
      },
    })
  };
};

export const getMembers = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, ...rest } = useQuery(GET_MEMBERS, {
    skip: !user,
    variables: { companyId: user?.settings.activeCompanyId },
    fetchPolicy: 'cache-and-network'
  });

  return { ...rest, members: _.get(data, 'members', []) };
};
