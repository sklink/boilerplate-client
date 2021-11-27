import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, Form } from 'formik';
import { NavLink } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';

// Data
import messages from './login-form.messages';
import { LoginFormProps } from './login-form.interfaces';

// Components
import FormikInput from '../../../_forms/Formik/formik-input.component';
import { Spacer } from '../../../_core/_ui/structure.components';
import { FormHelperText, FormLabel } from '../../../_core/_ui/forms.component';
import { Button } from '../../../_core/_ui/buttons.component';

const LoginForm: React.FC<LoginFormProps> = ({ form, submitError }) => {
  return (
    <Form>
      <Typography variant="h5">Sign in</Typography>
      <Field fid="lf" name="email" type="email" component={FormikInput} label="Email" />
      <Field fid="lf" name="password" type="password" component={FormikInput} label={
        <Box display="flex">
          <FormLabel>Password</FormLabel>
          <Spacer />
          <NavLink tabIndex={-1} to="/forgot-password">Forgot your password?</NavLink>
        </Box>
      } />
      <FormControl margin="normal" fullWidth>
        <Button color="primary" type="submit" variant="contained">
          <FormattedMessage {...messages.btnSubmit} />
        </Button>
      </FormControl>
      {submitError && <FormHelperText error>{submitError}</FormHelperText>}
    </Form>
  );
};

export default LoginForm;
