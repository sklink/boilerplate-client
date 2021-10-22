import _ from 'lodash';
import { MutationUpdaterFn } from '@apollo/client';

// Data
import { createCacheModifier, removeCacheModifier } from '../cache/basic.cache';
import { INVITE_FIELDS } from '../queries/invite.queries';

export const UPDATE_HANDLERS: { [key: string]: MutationUpdaterFn<any> } = {
  removeInvite: (cache: any, { data }) => {
    if (data) {
      cache.modify({
        fields: {
          invites: removeCacheModifier(cache, data.removeInvite._id)
        }
      });
    }
  },

  sendInvite: (cache: any, { data }: any) => {
    const createdInvite = _.get(data, 'sendInvite');

    cache.modify({
      fields: {
        invites: createCacheModifier({
          cache,
          createdDoc: createdInvite,
          modelName: 'Invite',
          fragment: INVITE_FIELDS,
          fragmentName: 'InviteFields'
        })
      }
    });
  }
};
