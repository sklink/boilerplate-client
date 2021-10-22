import { defineMessages } from 'react-intl';

export const scope = 'app.components.PlayerContactForm';

export default defineMessages({
  lblName: {
    id: `${scope}.lblName`,
    defaultMessage: 'Name'
  },
  lblEmail: {
    id: `${scope}.lblEmail`,
    defaultMessage: 'Email'
  },
  lblPhone: {
    id: `${scope}.lblPhone`,
    defaultMessage: 'Phone'
  },
  lblSendEmail: {
    id: `${scope}.lblSendEmail`,
    defaultMessage: 'Send Email Communications'
  },
  lblSendSMS: {
    id: `${scope}.lblSendSMS`,
    defaultMessage: 'Send Text Message Communications'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: `Save`,
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
