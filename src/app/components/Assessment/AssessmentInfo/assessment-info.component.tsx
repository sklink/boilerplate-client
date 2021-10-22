import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';

// Data
import messages from './assessment-info.messages';
import { IAssessmentInfo } from './assessment-info.interface';

// Components
import FormikInput from '../../_forms/Formik/formik-input.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { FormHelperText } from '../../_core/_ui/forms.component';

const AssessmentInfo: React.FC<IAssessmentInfo> = ({ form, showSaved }) => {
  const { isSubmitting } = form;

  return (
    <Form>
      <Field fid="csf" name="covidLink" component={FormikInput} label={messages.lblCovidLink} />
      <Field fid="csf" name="infoLink" component={FormikInput} label={messages.lblInfoLink} />

      <FormControl margin="dense">
        <Box display="flex" flexDirection="row" alignItems="center">
          <PrimaryButton disabled={isSubmitting} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...messages.btnSubmit} />}
          </PrimaryButton>
          {showSaved && <Box ml={2}><FormHelperText className="success">Links Saved</FormHelperText></Box>}
        </Box>
      </FormControl>
    </Form>
  );
};

export default AssessmentInfo;
