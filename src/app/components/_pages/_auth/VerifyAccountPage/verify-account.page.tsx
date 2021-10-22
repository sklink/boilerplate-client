import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import qs from 'qs';

// Data
import { HOME_ROUTE } from '../../../../../_configuration';
import { buildSetAuthUser } from '../../../../lib/services/auth.service';
import AuthApiService from '../../../../lib/utils/auth-api.service';

// Components
import SetPasswordFormContainer from '../../../User/SetPasswordForm/set-password-form.container';
import SingleFormLayout from '../../_layout/SingleFormLayout/single-form.layout';

interface IVerifyAccountPage {
  location: any;
}

const VerifyAccountPage: React.FC<IVerifyAccountPage> = ({ location }) => {
  const [hasAuthenticated, setHasAuthenticated] = React.useState(false);
  const onSetAuthUser = buildSetAuthUser();
  const { token } = qs.parse(location.search, { ignoreQueryPrefix: true });

  if (token && !hasAuthenticated) {
    setHasAuthenticated(true);
    AuthApiService.authenticateWithToken({ token: String(token) })
      .then((nextUser: IUser) => onSetAuthUser(nextUser));
  }

  return (
    <SingleFormLayout>
      <p className="center">Email verified. Set your password to sign in</p>
      <SetPasswordFormContainer redirect={HOME_ROUTE} redirectAction="Sign In" />
    </SingleFormLayout>
  );
}

VerifyAccountPage.propTypes = {
  location: PropTypes.object.isRequired,
}

export default withRouter(VerifyAccountPage);
