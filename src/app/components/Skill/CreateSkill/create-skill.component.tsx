import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';

// Data
import messages from './create-skill.messages';
import { ICreateSkill } from './create-skill.interface';

// Components
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import FormikInput from '../../_forms/Formik/formik-input.component';
import { FormHelperText } from '../../_core/_ui/forms.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { SKILL_TYPE_OPTIONS } from '../../../lib/constants';
import FormikCheckbox from '../../_forms/Formik/formik-checkbox.component';

const CreateSkill: React.FC<ICreateSkill> = ({
  form,
  submitError,
  showSaved,
  isAdmin
}) => {
  const {isSubmitting, isValid} = form;

  return (
    <Form>
      <Field fid="csf" name="type" component={FormikSelect} label={messages.lblType} defaultValue={SKILL_TYPE_OPTIONS[0]} options={SKILL_TYPE_OPTIONS} />
      <Field fid="cpf" name="name" component={FormikInput} label={messages.lblName} />
      {isAdmin && (
        <Field fid="cdf" name="isGlobal" component={FormikCheckbox} label={messages.lblGlobal} />
      )}

      <FormControl margin="dense">
        <Box>
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...messages.btnSubmit} />}
          </PrimaryButton>
        </Box>
        {submitError && <FormHelperText error>Something went wrong. Please try again later</FormHelperText>}
        {showSaved && <FormHelperText className="success">Successfully created</FormHelperText>}
      </FormControl>
    </Form>
  );
}

export default CreateSkill;
