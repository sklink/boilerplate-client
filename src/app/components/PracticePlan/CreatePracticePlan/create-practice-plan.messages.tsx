import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreatePracticePlan';

export default defineMessages({
  lblName: {
    id: `${scope}.lblName`,
    defaultMessage: 'Plan Name'
  },
  lblDrills: {
    id: `${scope}.lblDrills`,
    defaultMessage: 'Include the following drills:'
  },
  lblGlobal: {
    id: `${scope}.lblGlobal`,
    defaultMessage: 'Accessible to all associations'
  },
  btnSubmit: {
    id: `${scope}.btnSubmit`,
    defaultMessage: 'Create Plan',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Saving...',
  }
});
