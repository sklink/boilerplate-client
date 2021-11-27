import React from 'react';

import { Form, Field, FormikProps } from 'formik';
import { styled } from '@mui/material/styles';

// Material UI
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

// Components
import FormikInput from '../../../_forms/Formik/formik-input.component';

// Content
import messages from './set-password-form.messages';
import IntlMsg from '../../../_core/IntlMsg/intl-msg.component';
import { Button } from '../../../_core/_ui/buttons.component';

const SuccessMessage = styled('div')`
  color: #3cf2b1;
  line-height: 36px;
  margin-left: 16px;
`;

export interface SetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface SetPasswordFormProps {
  form: FormikProps<SetPasswordFormValues>;
  redirectAction?: string;
  showSaved?: boolean;
}

const SetPasswordForm: React.FC<SetPasswordFormProps> = ({ form, redirectAction, showSaved }) => {
  const {
    isSubmitting,
    isValid,
  } = form;

  return (
    <Form>
      <Field fid="spf" name="password" type="password" component={FormikInput} label={messages.labelPassword} />
      <Field fid="spf" name="confirmPassword" type="password" component={FormikInput} label={messages.labelConfirmPassword} />

      <FormControl margin="dense">
        <Box display="flex" flexDirection="row">
          <Button color="primary" disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting
              ? <IntlMsg {...messages.btnSubmitting} />
              : <span><IntlMsg {...messages.btnSubmit} />{redirectAction && <span> &amp; {redirectAction}</span>}</span>
            }
          </Button>
          {showSaved && <SuccessMessage>Saved</SuccessMessage>}
        </Box>
      </FormControl>
    </Form>
  );
};

export default SetPasswordForm;
