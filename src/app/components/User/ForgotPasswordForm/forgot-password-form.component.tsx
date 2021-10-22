import React from 'react';
import { Form, Field } from 'formik';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';

// Data
import messages from './forgot-password-form.messages';
import { ForgotPasswordFormProps } from './forgot-password-form.interface';

// Components
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { Text } from '../../_core/_ui/typography.component';
import FormikInput from '../../_forms/Formik/formik-input.component';
import { FormHelperText } from '../../_core/_ui/forms.component';


const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ form, isSubmitted, submitError }) => {
  const { isSubmitting, isValid } = form;

  if (isSubmitted) return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Text key="submitted">An email has been sent. Please follow the instructions there to reset your password</Text>
    </Box>
  );

  return (
    <Form>
      <h3>Reset your password</h3>
      <Text>Enter the email address associated with your account and we&#8217;ll send you a link to reset your password.</Text>

      <Field fid="fpf" name="email" type="email" label={messages.lblEmail} component={FormikInput} />

      <FormControl margin="dense">
        <Box display="flex" flexDirection="row">
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting
              ? <IntlMsg {...messages.btnSubmitting} />
              : <span><IntlMsg {...messages.btnSubmit} /></span>
            }
          </PrimaryButton>
        </Box>
      </FormControl>

      {submitError && <FormHelperText error>{submitError}</FormHelperText>}
    </Form>
  );
};

export default ForgotPasswordForm;
