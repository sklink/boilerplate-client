import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';

// Data
import messages from './create-practice-plan.messages';
import { ICreatePracticePlan } from './create-practice-plan.interface';

// Components
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import FormikInput from '../../_forms/Formik/formik-input.component';
import { FormHelperText } from '../../_core/_ui/forms.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { Typography } from '@material-ui/core';
import FormikCheckbox from '../../_forms/Formik/formik-checkbox.component';

const CreatePracticePlan: React.FC<ICreatePracticePlan> = ({
  form,
  submitError,
  showSaved,
  drillOptions,
  drillsLoading,
  drillsError,
  isAdmin
}) => {
  const { isSubmitting, isValid } = form;

  if (drillsError) return <Box mt={2}><Typography>Unable to create practice plans at this time. Please try again later</Typography></Box>;

  return (
    <Form>
      <Field fid="cppf" name="practicePlanName" component={FormikInput} label={messages.lblName} />
      <Field
        fid="cppf"
        name="drillIds"
        component={FormikSelect}
        label={messages.lblDrills}
        options={drillOptions}
        isLoading={drillsLoading}
        isMulti
      />
      {isAdmin && (
        <Field fid="cdf" name="isGlobal" component={FormikCheckbox} label={messages.lblGlobal} />
      )}

      <FormControl margin="dense">
        <Box>
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...messages.btnSubmit} />}
          </PrimaryButton>
        </Box>
        {submitError && <FormHelperText error>{submitError}</FormHelperText>}
        {showSaved && <FormHelperText className="success">Successfully created</FormHelperText>}
      </FormControl>
    </Form>
  );
}

export default CreatePracticePlan;
