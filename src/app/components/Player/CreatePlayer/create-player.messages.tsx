import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreatePlayerForm';

export default defineMessages({
  lblFirstName: {
    id: `${scope}.lblFirstName`,
    defaultMessage: 'First Name'
  },
  lblLastName: {
    id: `${scope}.lblLastName`,
    defaultMessage: 'Last Name'
  },
  lblDate: {
    id: `${scope}.lblDate`,
    defaultMessage: 'Date of Birth'
  },
  lblGender: {
    id: `${scope}.lblGender`,
    defaultMessage: 'Gender'
  },
  lblPosition: {
    id: `${scope}.lblPosition`,
    defaultMessage: 'Position'
  },
  lblContactName: {
    id: `${scope}.lblContactName`,
    defaultMessage: 'Full Name'
  },
  lblContactEmail: {
    id: `${scope}.lblContactEmail`,
    defaultMessage: 'Email'
  },
  lblSendEmail: {
    id: `${scope}.lblSendEmail`,
    defaultMessage: 'Send Email Communications'
  },
  lblContactPhone: {
    id: `${scope}.lblContactPhone`,
    defaultMessage: 'Mobile Phone'
  },
  lblSendSMS: {
    id: `${scope}.lblSendSMS`,
    defaultMessage: 'Send SMS Communications'
  },
  lblAgeGroup: {
    id: `${scope}.lblAgeGroup`,
    defaultMessage: 'Age Group'
  },
  lblExternalId: {
    id: `${scope}.lblExternalId`,
    defaultMessage: 'External ID (i.e. Hockey Registry Canada)'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Create Player',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
