import { defineMessages } from 'react-intl';
import { SESSION_TERM } from '../../../lib/constants';

export const scope = 'app.components.EditAssessmentSessionForm';

export default defineMessages({
  lblLocation: {
    id: `${scope}.lblLocation`,
    defaultMessage: 'Arena Name'
  },
  lblArea: {
    id: `${scope}.lblArea`,
    defaultMessage: 'Rink Name'
  },
  lblAddress: {
    id: `${scope}.lblAddress`,
    defaultMessage: 'Arena Address'
  },
  lblDate: {
    id: `${scope}.lblDate`,
    defaultMessage: 'Date'
  },
  lblStart: {
    id: `${scope}.lblStart`,
    defaultMessage: 'Start Time'
  },
  lblDuration: {
    id: `${scope}.lblDuration`,
    defaultMessage: 'Duration'
  },
  lblGender: {
    id: `${scope}.lblGender`,
    defaultMessage: 'Gender'
  },
  lblNotify: {
    id: `${scope}.lblNotify`,
    defaultMessage: 'Notify Players of Updates'
  },
  lblAgeGroup: {
    id: `${scope}.lblAgeGroup`,
    defaultMessage: 'Age Group'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: `Save ${SESSION_TERM}`,
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
