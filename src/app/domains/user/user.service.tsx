import _ from 'lodash';
import { useMutation, useQuery } from '@apollo/client';

// Queries
import {
  GET_CURR_USER,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD,
  RESET_PASSWORD_WITH_TOKEN, UPDATE_USER_SETTINGS,
} from './user.queries';
import { getCurrMember } from '../member/member.service';
import { authUser, getAuthUser } from '../_auth/auth.service';

export const getCurrUser = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, ...rest } = useQuery(GET_CURR_USER, {
    fetchPolicy: 'cache-and-network',
  });

  return { ...rest, user: _.get(data, 'loggedInUser') };
};

export const hasAnyRoles = (roles: string[]) => {
  const { member } = getCurrMember();

  return member && _.difference(roles, member.roles).length !== roles.length;
}

export const buildUpdateUserSettings = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(UPDATE_USER_SETTINGS);

  return {
    ...rest,
    updateUserSettings: (settings: any) => {
      if (user) {
        authUser({
          ...user,
          settings: { ...user.settings, ...settings }
        });
      }

      mutation({
        variables: {_id: user?._id, settings }
      })
    }
  }
}

export const buildResetPassword = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [resetPassword, rest] = useMutation(RESET_PASSWORD);

  return {
    ...rest,
    resetPassword: async (password: string) =>
      resetPassword({ variables: { password } })
  };
}

export const buildRequestPasswordReset = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [requestPasswordReset, rest] = useMutation(REQUEST_PASSWORD_RESET, {
    errorPolicy: 'all',
  });

  return {
    ...rest,
    requestPasswordReset: async (email: string) =>
      requestPasswordReset({ variables: { email } })
  }
};

export const buildResetPasswordWithToken = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [resetPasswordWithToken, rest] = useMutation(RESET_PASSWORD_WITH_TOKEN);

  return {
    ...rest,
    resetPasswordWithToken: (variables: any) =>
      resetPasswordWithToken({ variables })
  };
};
