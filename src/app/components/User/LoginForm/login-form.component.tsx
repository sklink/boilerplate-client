import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, Form } from 'formik';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';

// Material UI
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';

// Data
import messages from './login-form.messages';
import { LoginFormProps } from './login-form.interfaces';

// Components
import FormikInput from '../../_core/Formik/formik-input.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { Spacer } from '../../_core/_ui/structure.components';
import { FormHelperText, FormLabel } from '../../_core/_ui/forms.component';
import { SectionHeading, Text } from '../../_core/_ui/typography.component';

const LoginForm: React.FC<LoginFormProps> = ({ form, submitError }) => {
  const history = useHistory();

  return (
    <Form>
      <SectionHeading>Sports Association Staff</SectionHeading>
      <Field fid="lf" name="email" type="email" component={FormikInput} label="Email" />
      <Field fid="lf" name="password" type="password" component={FormikInput} label={
        <Box display="flex">
          <FormLabel>Password</FormLabel>
          <Spacer />
          <NavLink tabIndex={-1} to="/forgot-password">Forgot your password?</NavLink>
        </Box>
      } />
      <FormControl margin="normal" fullWidth>
        <PrimaryButton type="submit" variant="contained">
          <FormattedMessage {...messages.btnSubmit} />
        </PrimaryButton>
      </FormControl>
      {submitError && <FormHelperText error>{submitError}</FormHelperText>}
      <Box my={4}><Divider /></Box>
      <SectionHeading>Parents & Players</SectionHeading>
      <Text>Unable to find an email with your ice times? Request below:</Text>
      <PrimaryButton onClick={() => history.push('/request-emails')} variant="contained">Resend Hockey Emails</PrimaryButton>
    </Form>
  );
};

export default LoginForm;
