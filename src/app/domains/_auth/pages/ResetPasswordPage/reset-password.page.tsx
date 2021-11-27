import React from 'react';
import qs from 'qs';

// Material UI
// Data
import { ROUTE_PATHS } from '../../../../../_configuration';

// Components
import SetPasswordFormContainer from '../../components/SetPasswordForm/set-password-form.container';
import SingleFormLayout from '../../../_pages/_layout/SingleFormLayout/single-form.layout';

interface ResetPasswordPageProps {
  location: any;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ location }) => {
  const { token } = qs.parse(location.search, { ignoreQueryPrefix: true });

  return (
    <SingleFormLayout>
      <SetPasswordFormContainer redirect={ROUTE_PATHS.HOME} redirectAction="Sign In" token={String(token)}/>
    </SingleFormLayout>
  );
}

export default ResetPasswordPage;
