import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';

// Data
import messages from './manage-practice-plans.messages';
import { IManagePracticePlans } from './manage-practice-plans.interface';

// Components
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import FormikInput from '../../_forms/Formik/formik-input.component';
import { FormHelperText } from '../../_core/_ui/forms.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { Typography } from '@material-ui/core';

const ManagePracticePlans: React.FC<IManagePracticePlans> = ({
  form,
  submitError,
  showSaved,
  skillOptions,
  skillsLoading,
  skillsError
}) => {
  const { isSubmitting, isValid } = form;

  if (skillsError) return <Typography>Unable to create drills at this time. Please try again later</Typography>;

  return (
    <Form>
      <Field fid="cdf" name="name" component={FormikInput} label={messages.lblName} />
      <Field
        fid="cdf"
        name="drillIds"
        component={FormikSelect}
        label={messages.lblDrills}
        options={skillOptions}
        isLoading={skillsLoading}
        isMulti
      />

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

export default ManagePracticePlans;
