import { defineMessages } from 'react-intl';

export const scope = 'app.components.ForgotPasswordForm';

export default defineMessages({
  lblEmail: {
    id: `${scope}.lblEmail`,
    defaultMessage: 'Email'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Request Reset Email',
  },
  btnSignIn: {
    id: `${scope}.btnSignIn`,
    defaultMessage: 'Request Reset Email',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Sending...',
  }
});
