import React from 'react';
import { withRouter } from 'react-router-dom';

// Components
import SingleFormLayout from '../../_layout/SingleFormLayout/single-form.layout';
import RegisterCompanyFormContainer from '../../../Company/RegisterCompanyForm/register-company-form.container';

interface RegisterPageProps {
  location: any;
}

const RegisterPageContainer: React.FC<RegisterPageProps> = ({ location }) => {

  return (
    <SingleFormLayout maxWidth="600px">
      <RegisterCompanyFormContainer />
    </SingleFormLayout>
  );
}

export default withRouter(RegisterPageContainer);
