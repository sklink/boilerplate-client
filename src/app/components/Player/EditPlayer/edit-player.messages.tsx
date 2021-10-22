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
  lblExternalId: {
    id: `${scope}.lblExternalId`,
    defaultMessage: 'External ID (i.e. Hockey Registry Canada)'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Save Information',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
