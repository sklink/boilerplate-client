import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreateSkillForm';

export default defineMessages({
  lblName: {
    id: `${scope}.lblName`,
    defaultMessage: 'Skill Name'
  },
  lblType: {
    id: `${scope}.lblType`,
    defaultMessage: 'Field Type'
  },
  lblCategory: {
    id: `${scope}.lblCategory`,
    defaultMessage: 'Category'
  },
  lblGlobal: {
    id: `${scope}.lblGlobal`,
    defaultMessage: 'Accessible to all associations'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Create Skill',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
