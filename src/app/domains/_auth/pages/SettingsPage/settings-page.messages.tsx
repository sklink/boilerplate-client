import { defineMessages } from 'react-intl';

export const scope = 'app.components.SettingsPage';

export default defineMessages({
  headingAccount: {
    id: `${scope}.headingAccount`,
    defaultMessage: 'Account Settings',
  },
  headingChangePassword: {
    id: `${scope}.headingChangePassword`,
    defaultMessage: 'Change Password'
  },
  lblEmail: {
    id: `${scope}.lblEmail`,
    defaultMessage: 'Email',
  },
});
