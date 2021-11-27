import React from 'react';
import { Form, Field } from 'formik';

// Material UI
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Data
import messages from './forgot-password-form.messages';
import { ForgotPasswordFormProps } from './forgot-password-form.interface';

// Components
import IntlMsg from '../../../_core/IntlMsg/intl-msg.component';
import FormikInput from '../../../_forms/Formik/formik-input.component';
import { FormHelperText } from '../../../_core/_ui/forms.component';
import { Button } from '../../../_core/_ui/buttons.component';


const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ form, isSubmitted, submitError }) => {
  const { isSubmitting, isValid } = form;

  if (isSubmitted) return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography key="submitted">An email has been sent. Please follow the instructions there to reset your password</Typography>
    </Box>
  );

  return (
    <Form>
      <h3>Reset your password</h3>
      <Typography>Enter the email address associated with your account and we&#8217;ll send you a link to reset your password.</Typography>

      <Field fid="fpf" name="email" type="email" label={messages.lblEmail} component={FormikInput} />

      <FormControl margin="dense">
        <Box display="flex" flexDirection="row">
          <Button color="primary" disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting
              ? <IntlMsg {...messages.btnSubmitting} />
              : <span><IntlMsg {...messages.btnSubmit} /></span>
            }
          </Button>
        </Box>
      </FormControl>

      {submitError && <FormHelperText error>{submitError}</FormHelperText>}
    </Form>
  );
};

export default ForgotPasswordForm;
