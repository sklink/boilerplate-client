import _ from 'lodash';
import React from 'react';
import { Formik } from 'formik';
import qs from 'qs';
import * as Yup from 'yup';
import { useHistory, withRouter } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

// Material UI
import Box from '@mui/material/Box';

// Data
import { buildAcceptInvite, getInvite } from '../../../invite/invite.service';
import { buildSignOut, getAuthUser } from '../../auth.service';
import { INVITE_STATUSES } from '../../../../lib/_constants';
import { isValidEmail } from '../../../../lib/helpers/validation.helpers';
import { COMPANY_TERM } from '../../../../../_configuration';

// Components
import AcceptInviteForm, { SignUpFormValues } from '../../../invite/components/_AcceptInviteForm/accept-invite-form.component';
import SingleFormLayout from '../../../_pages/_layout/SingleFormLayout/single-form.layout';
import { Button } from '../../../_core/_ui/buttons.component';

const Msg = styled('div')`
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
          <Button color="primary" variant="contained" onClick={() => history.push('/')}>Sign In</Button>
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
          <Button color="primary" variant="contained" onClick={() => history.push('/')}>Sign In</Button>
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
