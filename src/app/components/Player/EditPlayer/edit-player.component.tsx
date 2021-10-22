import _ from 'lodash';
import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';

// Data
import { IEditPlayer } from './edit-player.interface';
import messages from './edit-player.messages';
import { GENDER_OPTIONS } from '../../../lib/constants';

// Components
import FormikInput from '../../_forms/Formik/formik-input.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { FormHelperText } from '../../_core/_ui/forms.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import FormikDatePicker from '../../_forms/Formik/formik-datepicker.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import { Typography } from '@material-ui/core';

const EditPlayer: React.FC<IEditPlayer> = ({
  form,
  submitError,
  showSaved,
  fetchError,
  loading
}) => {
  const { isSubmitting, isValid } = form;
  const genderOptions = _.filter(GENDER_OPTIONS, option => option.value !== 'Any');

  if (fetchError) return <Box mt={2}><Typography>Unable to edit this player at this time. Please try again later</Typography></Box>;

  return (
    <Form>
      <Box display="flex">
        <Box mr={1} flexGrow={1} mt={-2}>
          <Field fid="cpf" name="firstName" component={FormikInput} label={messages.lblFirstName} />
        </Box>
        <Box flexGrow={1} mt={-2}>
          <Field fid="cpf" name="lastName" component={FormikInput} label={messages.lblLastName} />
        </Box>
      </Box>
      <Box display="flex">
        <Box mr={1} flexGrow={1}>
          <Field fid="csf" name="date" component={FormikDatePicker} label={messages.lblDate} dateFormat="YYYY/MM/DD" />
        </Box>
        <Box flexGrow={1}>
          <Field fid="csf" name="gender" component={FormikSelect} label={messages.lblGender} options={genderOptions} />
        </Box>
      </Box>
      <Field fid="cpf" name="externalId" component={FormikInput} label={messages.lblExternalId} />

      <FormControl margin="dense">
        <Box display="flex" flexDirection="row" alignItems="center">
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...messages.btnSubmit} />}
          </PrimaryButton>
          {submitError && <Box ml={2}><FormHelperText error>{submitError}</FormHelperText></Box>}
          {showSaved && <Box ml={2}><FormHelperText className="success">Successfully saved</FormHelperText></Box>}
        </Box>
      </FormControl>
    </Form>
  );
};

export default EditPlayer;
