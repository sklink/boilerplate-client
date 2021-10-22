import { defineMessages } from 'react-intl';

export const scope = 'app.components.ManagePracticePlans';

export default defineMessages({
  lblName: {
    id: `${scope}.lblName`,
    defaultMessage: 'Plan Name'
  },
  lblDrills: {
    id: `${scope}.lblDrills`,
    defaultMessage: 'Include the following drills:'
  },
  btnSave: {
    id: `${scope}.btnSave`,
    defaultMessage: 'Save Plan'
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
