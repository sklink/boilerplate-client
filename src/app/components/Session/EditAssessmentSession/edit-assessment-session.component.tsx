import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';

// Data
import { IEditAssessmentSession } from './edit-assessment-session.interface'
import messages from './edit-assessment-session.messages'
import { GENDER_OPTIONS } from '../../../lib/constants';

// Components
import FormikInput from '../../_forms/Formik/formik-input.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { FormHelperText } from '../../_core/_ui/forms.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import { Typography } from '@material-ui/core';
import FormikDatePicker from '../../_forms/Formik/formik-datepicker.component';
import FormikTimePicker from '../../_forms/Formik/formik-timepicker.component';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormikCheckbox from '../../_forms/Formik/formik-checkbox.component';

const EditAssessmentSession: React.FC<IEditAssessmentSession> = ({
  form,
  submitError,
  showSaved,
  createAgeGroup,
  ageGroupOptions,
  ageGroupsLoading,
}) => {
  const { isSubmitting, isValid } = form;

  return (
    <Form>
      <Field fid="csf" name="location" component={FormikInput} label={messages.lblLocation} />
      <Field fid="csf" name="area" component={FormikInput} label={messages.lblArea} />
      <Field fid="csf" name="address" component={FormikInput} label={messages.lblAddress} />
      <Field fid="csf" name="date" component={FormikDatePicker} label={messages.lblDate} dateFormat="YYYY/MM/DD" />
      <Field fid="csf" name="start" component={FormikTimePicker} label={messages.lblStart} />
      <Field fid="csf" name="duration" component={FormikInput} label={messages.lblDuration} />
      <Field fid="csf" name="gender" component={FormikSelect} label={messages.lblGender} options={GENDER_OPTIONS} />
      {!ageGroupOptions.length && ageGroupsLoading
        ? <Typography>Loading age groups...</Typography>
        : <Field fid="csf" name="ageGroupId" component={FormikSelect} label={messages.lblAgeGroup} options={ageGroupOptions}
                 createMethod={createAgeGroup} canCreate />
      }
      <Field fid="csf" name="notify" component={FormikCheckbox} label={messages.lblNotify} />
      <FormControl margin="dense">
        <Box display="flex" flexDirection="row" alignItems="center">
          <PrimaryButton disabled={isSubmitting} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...messages.btnSubmit} />}
          </PrimaryButton>
          <Box ml={2}>
            {submitError && <FormHelperText error>{submitError}</FormHelperText>}
            {showSaved && <FormHelperText className="success">Successfully updated</FormHelperText>}
          </Box>
        </Box>
      </FormControl>
    </Form>
  );
};

export default EditAssessmentSession;
