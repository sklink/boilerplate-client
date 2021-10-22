import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreateDrillForm';

export default defineMessages({
  lblName: {
    id: `${scope}.lblName`,
    defaultMessage: 'Drill Name'
  },
  lblSkills: {
    id: `${scope}.lblSkills`,
    defaultMessage: 'Evaluate these skills:'
  },
  lblPosition: {
    id: `${scope}.lblPosition`,
    defaultMessage: 'For the following positions:'
  },
  lblGlobal: {
    id: `${scope}.lblGlobal`,
    defaultMessage: 'Accessible to all associations'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Create Drill',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  },
  btnEdit: {
    id: `${scope}.btnEdit`,
    defaultMessage: 'Save Changes'
  }
});
