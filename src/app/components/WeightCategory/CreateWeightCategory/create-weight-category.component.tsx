import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';

// Data
import messages from './create-weight-category.messages';
import { ICreateWeightCategory } from './create-weight-category.interface';

// Components
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import FormikInput from '../../_forms/Formik/formik-input.component';
import { FormHelperText } from '../../_core/_ui/forms.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';

const CreateWeightCategory: React.FC<ICreateWeightCategory> = ({
  form,
  skillOptions,
  skillsLoading,
  submitError,
  showSaved,
}) => {
  const {isSubmitting, isValid} = form;

  return (
    <Form>
      <Field fid="cwc" name="name" component={FormikInput} label={messages.lblName} />
      <Field fid="cwc" name="weight" component={FormikInput} label={messages.lblWeight} />
      <FormHelperText>A number out of 100, representing the percentage of total assessment score</FormHelperText>
      <Field
        fid="cdf"
        name="skillIds"
        component={FormikSelect}
        label={messages.lblSkills}
        options={skillOptions}
        isLoading={skillsLoading}
        isMulti
      />
      <FormHelperText>Skills may be added after creating the category</FormHelperText>

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

export default CreateWeightCategory;
