import { defineMessages } from 'react-intl';

export const scope = 'app.components.AcceptInvitePage';

export default defineMessages({
  lblCovidLink: {
    id: `${scope}.lblCovidLink`,
    defaultMessage: 'COVID information link (used in welcome email)',
  },
  lblInfoLink: {
    id: `${scope}.lblInfoLink`,
    defaultMessage: 'Schedule information link (used in welcome email)',
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Save Links',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
