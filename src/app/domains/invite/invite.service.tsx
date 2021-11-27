import _ from 'lodash';
import { nanoid } from 'nanoid';
import { useMutation, useQuery } from '@apollo/client';

import {
  ACCEPT_INVITE,
  GET_INVITE, GET_INVITES,
  REMOVE_INVITE,
  RESEND_INVITE,
  SEND_INVITE
} from './invite.queries';

import { getActiveCompanyId } from '../company/company.service';
import { UPDATE_HANDLERS } from '../../lib/utils/update.handler';

export const getInvite = (code: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { error, loading, data } = useQuery(GET_INVITE, {
    skip: !code,
    variables: { code },
    fetchPolicy: 'network-only'
  });

  return { loading, error, invite: _.get(data, 'invite') };
};

export const getInvites = (status: string) => {
  const companyId = getActiveCompanyId();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, ...rest } = useQuery(GET_INVITES, {
    skip: !companyId,
    variables: { companyId, status },
    fetchPolicy: 'cache-and-network'
  });

  return { ...rest, invites: _.get(data, 'invites', []) };
};

export const buildSendInvite = () => {
  const companyId = getActiveCompanyId();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(SEND_INVITE, {
    context: { serializationKey: 'MUTATION', tracked: true },
  });

  const sendInvite = (email: string, roles: string[]) =>
    mutation({
      variables: { data: { email, companyId, roles } },
      update: UPDATE_HANDLERS.sendInvite,
      optimisticResponse: {
        __typename: 'Mutation',
        sendInvite: {
          _id: nanoid(),
          __typename: 'Invite',
          email,
          roles
        }
      }
    });

  return { sendInvite, ...rest };
};

export const buildResendInvite = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, ...rest] = useMutation(RESEND_INVITE);

  return {
    ...rest,
    resendInvite: (_id: string) => mutation({ variables: { _id } })
  };
};

export const buildCancelInvite = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, ...rest] = useMutation(REMOVE_INVITE, {
    context: { serializationKey: 'MUTATION', tracked: true },
  });

  return {
    ...rest,
    cancelInvite: (_id: string) =>
      mutation({
        variables: {_id},
        update: UPDATE_HANDLERS.removeInvite,
        optimisticResponse: {
          __typename: 'Mutation',
          removeInvite: {
            __typename: 'DeleteResponse',
            _id
          }
        }
      })
  };
};

export const buildAcceptInvite = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [acceptInvite] = useMutation(ACCEPT_INVITE);

  return (data: any) => acceptInvite({ variables: { data } });
};
