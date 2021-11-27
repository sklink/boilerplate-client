import React from 'react';
import { withRouter } from 'react-router-dom';
import qs from 'qs';

// Components
import SingleFormLayout from '../../../_pages/_layout/SingleFormLayout/single-form.layout';
import LoginFormContainer from '../../components/LoginForm/login-form.container';

interface LoginPageProps {
  location: any;
}

const LoginPageContainer: React.FC<LoginPageProps> = ({ location }) => {
  const { token } = qs.parse(location.search, { ignoreQueryPrefix: true });

  return (
    <SingleFormLayout maxWidth="600px">
      <LoginFormContainer token={token && String(token)} />
    </SingleFormLayout>
  );
}

export default withRouter(LoginPageContainer);
