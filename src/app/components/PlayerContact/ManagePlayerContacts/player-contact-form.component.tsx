import React from 'react';
import { Field, Form, FormikProps } from 'formik';

// Material UI
import Box from '@material-ui/core/Box';

// Data
import messages from './player-contact-form.messages';

// Components
import FormikInput from '../../_core/Formik/formik-input.component';
import FormControl from '@material-ui/core/FormControl';
import { PrimaryButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { Spacer } from '../../_core/_ui/structure.components';
import FormikCheckbox from '../../_core/Formik/formik-checkbox.component';

export interface IPlayerContactFormFields {
  name: string;
  email?: string;
  phone?: string;
  sendSMS: boolean;
  sendEmail: boolean;
}

interface IPlayerContactForm {
  form: FormikProps<IPlayerContactFormFields>;
  onCancel?: Function;
}

const PlayerContactForm: React.FC<IPlayerContactForm> = ({ form, onCancel }) => {
  const { isSubmitting, isValid } = form;

  return (
    <Form>
      <Field fid="cpcf" name="name" margin="dense" component={FormikInput} label={messages.lblName} />
      <Field fid="cpcf" name="email" margin="dense" component={FormikInput} label={messages.lblEmail} />
      <Field fid="cpcf" id="cpcf_sendEmail" name="sendEmail" component={FormikCheckbox} label={messages.lblSendEmail} />
      <Field fid="cpcf" name="phone" margin="dense" component={FormikInput} label={messages.lblPhone} />
      <Field fid="cpcf" id="cpcf_sendSMS" name="sendSMS" component={FormikCheckbox} label={messages.lblSendSMS} />

      <FormControl margin="dense">
        <Box display="flex" flexDirection="row">
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...messages.btnSubmit} />}
          </PrimaryButton>
          <Spacer />
          {onCancel && <SecondaryButton onClick={() => onCancel()}>Cancel</SecondaryButton>}
        </Box>
      </FormControl>
    </Form>
  );
};

export default PlayerContactForm;
