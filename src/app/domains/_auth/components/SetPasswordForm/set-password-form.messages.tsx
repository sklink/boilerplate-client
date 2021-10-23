import { defineMessages } from 'react-intl';

export const scope = 'app.components.SetPasswordForm';

export default defineMessages({

  labelPassword: {
    id: `${scope}.labelPassword`,
    defaultMessage: 'Password'
  },
  labelConfirmPassword: {
    id: `${scope}.labelConfirmPassword`,
    defaultMessage: 'Confirm Password'
  },
  btnSubmit: {
    id: `${scope}.btnCreateAccount`,
    defaultMessage: 'Set Password',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
