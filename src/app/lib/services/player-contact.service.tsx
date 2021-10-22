import { useMutation } from '@apollo/client';
import {
  CONTACT_FIELDS,
  CREATE_PLAYER_CONTACT,
  REMOVE_PLAYER_CONTACT,
  UPDATE_PLAYER_CONTACT
} from '../queries/player-contact.queries';
import { createCacheModifier, removeCacheModifier } from '../cache/basic.cache';

export interface ICreatePlayerContactProps {
  name: string;
  email?: string;
  phone?: string;
  playerId?: string;
  code?: string;
  sendSMS?: boolean;
  sendEamil?: boolean;
}

export const buildCreatePlayerContact = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(CREATE_PLAYER_CONTACT);

  return {
    ...rest,
    createPlayerContact: (data: ICreatePlayerContactProps, code?: string) => mutation({
      variables: { data, code },
      update: (cache, { data }) => {
        const createdDoc = data && data.createPlayerContact;

        cache.modify({
          id: `Player:${data.playerId}`,
          fields: {
            contacts: createCacheModifier({
              cache,
              createdDoc,
              modelName: 'PlayerContact',
              fragment: CONTACT_FIELDS,
              fragmentName: 'ContactFields'
            })
          }
        });
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createPlayerContact: {
          __typename: 'PlayerContact',
          ...data
        }
      }
    })
  }
};

export const buildRemovePlayerContact = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REMOVE_PLAYER_CONTACT);

  return {
    ...rest,
    removePlayerContact: (_id: string, code?: string) => mutation({
      variables: { _id, code },
      update: cache => {
        cache.modify({
          fields: {
            contacts: removeCacheModifier(cache, _id)
          }
        })
      },
      optimisticResponse: {
        __typename: 'Mutation',
        removePlayerContact: {
          __typename: 'DeleteResponse',
          _id
        }
      }
    })
  };
};

export interface IUpdatePlayerContactProps {
  name?: string;
  phone?: string;
  email?: string;
}

export const buildUpdatePlayerContact = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(UPDATE_PLAYER_CONTACT);

  return {
    ...rest,
    updatePlayerContact: (_id: string, code: string | undefined, data: IUpdatePlayerContactProps) => mutation({
      variables: { _id, code, data },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePlayerContact: {
          __typename: 'PlayerContact',
          _id,
          ...data
        }
      }
    })
  }
}
