import _ from 'lodash';
import React from 'react';

// Material UI
import FormControl from '@mui/material/FormControl/FormControl';

// Components
import { FormHelperText, FormInput, FormLabel } from '../../_core/_ui/forms.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import Required from '../required.component';

interface FormikInputProps {
  id?: string,
  fid?: string,
  field: any,
  htmlFor?: string,
  label?: any,
  form: any,
  uncontrolled?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  type?: string;
  required?: boolean;
}

const FormikInput: React.FC<FormikInputProps> = ({ field, margin, fid, id, label, form, uncontrolled, type, required, ...rest }) => {
  const _id = id || fid;
  const error = _.get(form, `errors.${field.name}`);
  const touched = _.get(form, `touched.${field.name}`);

  let labelOutput = label;
  if (label && label.id) {
    labelOutput = <FormLabel htmlFor={_id}><IntlMsg {...label} />{required && <Required />}</FormLabel>;
  } else if (label && _.isString(label)) {
    labelOutput = <FormLabel htmlFor={_id}>{label}{required && <Required />}</FormLabel>;
  }

  const patch: any = { ...rest };
  if (!uncontrolled) {
    patch.value = field.value;
    delete patch.defaultValue;
  }

  return (
    <FormControl margin={margin || 'normal'} fullWidth component="div" error={!!error && touched}>
      {labelOutput}
      <FormInput
        id={_id}
        type={type || 'text'}
        name={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        {...patch}
      />
      {touched && _.isString(error) && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
}

export default FormikInput;
