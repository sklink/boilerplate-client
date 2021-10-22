import React from 'react';
import qs from 'qs';

// Material UI
// Data
import { HOME_ROUTE } from '../../../../../_configuration';

// Components
import SetPasswordFormContainer from '../../../User/SetPasswordForm/set-password-form.container';
import SingleFormLayout from '../../_layout/SingleFormLayout/single-form.layout';

interface ResetPasswordPageProps {
  location: any;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ location }) => {
  const { token } = qs.parse(location.search, { ignoreQueryPrefix: true });

  return (
    <SingleFormLayout>
      <SetPasswordFormContainer redirect={HOME_ROUTE} redirectAction="Sign In" token={String(token)}/>
    </SingleFormLayout>
  );
}

export default ResetPasswordPage;
