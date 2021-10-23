import _ from 'lodash';
import { defineMessages } from 'react-intl';

import { COMPANY_TERM } from '../../../../../_configuration';

export const scope = 'app.components.CompanyRegistrationForm';

export default defineMessages({
  lblEmail: {
    id: `${scope}.lblEmail`,
    defaultMessage: 'Email',
  },
  lblPassword: {
    id: `${scope}.lblPassword`,
    defaultMessage: 'Password'
  },
  lblConfirmPassword: {
    id: `${scope}.lblConfirmPassword`,
    defaultMessage: 'Confirm Password'
  },
  lblName: {
    id: `${scope}.lblName`,
    defaultMessage: 'Full Name'
  },
  lblTimezone: {
    id: `${scope}.lblTimezone`,
    defaultMessage: 'Timezone'
  },
  lblCompany: {
    id: `${scope}.lblCompany`,
    defaultMessage: _.capitalize(COMPANY_TERM),
  },
  lblCompanyName: {
    id: `${scope}.lblCompanyName`,
    defaultMessage: `${_.capitalize(COMPANY_TERM)} Name`,
  },
  lblDomain: {
    id: `${scope}.lblDomain`,
    defaultMessage: `${_.capitalize(COMPANY_TERM)} Domain`,
  },
  btnRequestAccess: {
    id: `${scope}.btnRequestAccess`,
    defaultMessage: 'Request Access',
  },
  btnCreateAccount: {
    id: `${scope}.btnCreateAccount`,
    defaultMessage: 'Create Account',
  },
  btnSubmitting: {
    id: `${scope}.btnSubmitting`,
    defaultMessage: 'Registering...',
  },
  msgSuccess: {
    id: `${scope}.msgSuccess`,
    defaultMessage: 'An email has been sent to the address you provided'
  }
});
