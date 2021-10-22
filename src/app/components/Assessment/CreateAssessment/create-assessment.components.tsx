import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';

// Data
import messages from './create-assessment.messages';
import { ICreateAssessment } from './create-assessment.interface';

// Components
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import FormikInput from '../../_forms/Formik/formik-input.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { FormHelperText } from '../../_core/_ui/forms.component';

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
