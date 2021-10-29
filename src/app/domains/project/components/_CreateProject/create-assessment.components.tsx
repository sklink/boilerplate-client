import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';

// Data
import messages from './create-assessment.messages';
import { ICreateAssessment } from './create-assessment.interface';

// Components
import IntlMsg from '../../../../components/_core/IntlMsg/intl-msg.component';
import FormikInput from '../../../../components/_forms/Formik/formik-input.component';
import { PrimaryButton } from '../../../../components/_core/_ui/buttons.component';
import { FormHelperText } from '../../../../components/_core/_ui/forms.component';

const CreateAssessment: React.FC<ICreateAssessment> = ({ form, submitError }) => {
  const { isSubmitting, isValid } = form;

  return (
    <Form>
      <Field fid="caf" name="name" component={FormikInput} label={messages.lblName} />

      <FormControl margin="dense">
        <Box display="flex" flexDirection="row">
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...messages.btnSubmit} />}
          </PrimaryButton>
          {submitError && <Box ml={2}><FormHelperText error>{submitError}</FormHelperText></Box>}
        </Box>
      </FormControl>
    </Form>
  );
};

export default CreateAssessment;
