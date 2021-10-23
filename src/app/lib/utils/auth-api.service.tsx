import _ from 'lodash';
import * as Sentry from '@sentry/react';

import RestService from './api.service';
import { LoginFormFields } from '../../domains/_auth/components/LoginForm/login-form.interfaces';
import { ENABLE_SENTRY, SUPPORT_EMAIL } from '../../../_configuration';

interface TokenAuth {
  token: string;
}

export default class AuthApiService {
  static LOGIN_ENDPOINT = '/login';
  static REFRESH_TOKEN_ENDPOINT = '/token/refresh';
  static TOKEN_AUTH_ENDPOINT = '/token/login';

  static async authenticate({ email, password }: LoginFormFields) {
    try {
      const response = await RestService.post(AuthApiService.LOGIN_ENDPOINT, { email, password });

      if (response.status === 401) {
        throw new Error('You entered an invalid email or password');
      } else if (response.status) {
        throw new Error(`Something went wrong. Contact ${SUPPORT_EMAIL} for assistance`);
      } else {
        return _.get(response, 'user');
      }
    } catch (err) {
      if (err.message === 'You entered an invalid email or password') {
        throw err;
      }

      let message = `Something went wrong. Contact ${SUPPORT_EMAIL} for assistance`;

      if (_.get(err, 'response.status') === 401) {
        message = 'You entered an invalid email or password';
      }

      throw new Error(message);
    }
  }

  static async authenticateWithToken({ token }: TokenAuth) {
    try {
      const response = await RestService.post(AuthApiService.TOKEN_AUTH_ENDPOINT, { token });

      if (response.status === 401) {
        throw new Error('Authentication link has expired');
      } else if (response.status) {
        throw new Error(`Something went wrong. Contact ${SUPPORT_EMAIL} for assistance`);
      } else {
        return _.get(response, 'user');
      }
    } catch (err) {
      throw new Error(`Something went wrong. Contact ${SUPPORT_EMAIL} for assistance`);
    }
  }

  static async refreshToken() {
    try {
      const response = await RestService.post(AuthApiService.REFRESH_TOKEN_ENDPOINT, {});

      if (response.user) {
        response.user.token = response.token;
      }

      return response;
    } catch (err) {
      if (ENABLE_SENTRY && _.get(err, 'response.status') !== 401) {
        Sentry.captureException(err)
      }

      throw err;
    }
  }
}
