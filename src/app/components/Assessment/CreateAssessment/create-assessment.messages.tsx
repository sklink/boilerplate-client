import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreateAssessmentForm';

export default defineMessages({
  lblName: {
    id: `${scope}.lblName`,
    defaultMessage: 'Assessment Name'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Create Assessment',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
