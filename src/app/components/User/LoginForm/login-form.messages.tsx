import { defineMessages } from 'react-intl';

export const scope = 'app.components.LoginForm';

export default defineMessages({
  labelEmail: {
    id: `${scope}.labelEmail`,
    defaultMessage: 'Email',
  },
  labelPassword: {
    id: `${scope}.labelPassword`,
    defaultMessage: 'Password',
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Sign In',
  },
});
