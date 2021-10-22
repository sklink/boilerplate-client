import _ from 'lodash';
import React from 'react';
import { Formik } from 'formik';
import qs from 'qs';
import * as Yup from 'yup';
import { useHistory, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

// Material UI
import Box from '@material-ui/core/Box';

// Data
import { buildAcceptInvite, getInvite } from '../../../../lib/services/invite.service';
import { buildSignOut, getAuthUser } from '../../../../lib/services/auth.service';
import { INVITE_STATUSES } from '../../../../lib/constants';
import { isValidEmail } from '../../../../lib/helpers/validation.helpers';
import { COMPANY_TERM } from '../../../../../_configuration';

// Components
import { PrimaryButton } from '../../../_core/_ui/buttons.component';
import AcceptInviteForm, { SignUpFormValues } from '../../../Invite/AcceptInviteForm/accept-invite-form.component';
import SingleFormLayout from '../../_layout/SingleFormLayout/single-form.layout';

const Msg = styled.div`
  margin-top: 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.56);
  line-height: 22px;
`;

interface IJoinPage {
  location: any;
}

const AcceptInvitePage: React.FC<IJoinPage> = ({ location }) => {
  const onSignOut = buildSignOut();
  const user: IUser | null = getAuthUser();
  const history = useHistory();
  const [submitted, setSubmitted] = React.useState(false);
  const { code }: any = qs.parse(location.search, { ignoreQueryPrefix: true });
  const { invite, loading } = getInvite(code);
  const onAcceptInvite = buildAcceptInvite();

  // Sign up server error
  const initialValues: SignUpFormValues = { email: invite && invite.email };

  async function handleSubmit(values: SignUpFormValues) {
    delete values.confirmPassword;

    onAcceptInvite({ code, ...values, email: values.email.toLowerCase() })
      .then(() => setSubmitted(true));
  }

  const validationShape: any = {
    email: Yup.string().test('valid-email', 'Enter a valid email', isValidEmail),
  };

  if (invite && invite.isPasswordRequired) {
    initialValues.name = '';
    validationShape.name = Yup.string().required('Enter your name');

    initialValues.password = '';
    validationShape.password = Yup.string()
      .required('Enter a password')
      .min(8, 'Password must be at least 8 characters')
      .matches(/^[\S]+$/, 'Password cannot contain any spaces');

    initialValues.confirmPassword = '';
    validationShape.confirmPassword = Yup.string().required().oneOf([Yup.ref('password')], 'Passwords must match');
  }

  if (invite && user && invite.email !== _.get(user, 'email')) {
    onSignOut();
  }

  const validationSchema = Yup.object().shape(validationShape);
  let content;

  if (submitted && invite) {
    content = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Msg key="submitted">Successfully registered with {invite.companyName}. Sign in</Msg>
        <Box key="sign_in" mt={2}>
          <PrimaryButton variant="contained" onClick={() => history.push('/')}>Sign In</PrimaryButton>
        </Box>
      </Box>
    );
  } else if (loading) {
    content = <Msg key="loading">Loading...</Msg>;
  } else if (invite && invite.status === INVITE_STATUSES.ACCEPTED) {
    content = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Msg key="accepted">Invite has already been accepted</Msg>
        <Box key="sign_in" mt={2}>
          <PrimaryButton variant="contained" onClick={() => history.push('/')}>Sign In</PrimaryButton>
        </Box>
      </Box>
    );
  } else if (!loading && (!invite || dayjs() > dayjs(invite.expiresAt))) {
    content = <Msg key="expired">Unable to find a valid invitation<br />Please request another invite from your {COMPANY_TERM}</Msg>;
  } else {
    content = (
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {form => <AcceptInviteForm form={form} invite={invite}/>}
      </Formik>
    );
  }

  return (
    <SingleFormLayout>
      {content}
    </SingleFormLayout>
  );
};

export default withRouter(AcceptInvitePage);
