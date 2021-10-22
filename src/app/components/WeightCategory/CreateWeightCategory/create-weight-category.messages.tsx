import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreateWeightCategory';

export default defineMessages({
  lblName: {
    id: `${scope}.lblName`,
    defaultMessage: 'Category Name'
  },
  lblWeight: {
    id: `${scope}.lblWeight`,
    defaultMessage: 'Weight'
  },
  lblSkills: {
    id: `${scope}.lblSkills`,
    defaultMessage: 'Skills'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Create Weight Category',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Creating...',
  }
});
