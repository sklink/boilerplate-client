import React from 'react';

import { Form, Field, FormikProps } from 'formik';
import styled from 'styled-components';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';

// Components
import FormikInput from '../../_core/Formik/formik-input.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';

// Content
import messages from './set-password-form.messages';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';

const SuccessMessage = styled.div`
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
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting
              ? <IntlMsg {...messages.btnSubmitting} />
              : <span><IntlMsg {...messages.btnSubmit} />{redirectAction && <span> &amp; {redirectAction}</span>}</span>
            }
          </PrimaryButton>
          {showSaved && <SuccessMessage>Saved</SuccessMessage>}
        </Box>
      </FormControl>
    </Form>
  );
};

export default SetPasswordForm;
