import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

// Material UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl/FormControl';
import DatePicker from '@mui/lab/DatePicker';

// Components
import { FormHelperText, FormInput, FormLabel } from '../../_core/_ui/forms.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import Required from '../required.component';

interface IFormikDatePicker {
  id?: string,
  fid?: string,
  field: any,
  htmlFor?: string,
  label?: any,
  form: any,
  uncontrolled?: boolean;
  placeholder?: string;
  dateFormat: string;
  required?: boolean;
}

const FormikDatePicker: React.FC<IFormikDatePicker> = ({
  required,
  field,
  fid,
  id,
  label,
  form,
  placeholder,
  dateFormat,
  ...rest
}) => {
  const _id = id || fid;
  const error = _.get(form, `errors.${field.name}`);
  const touched = _.get(form, `touched.${field.name}`);

  let labelOutput = label;
  if (label && label.id) {
    labelOutput = <FormLabel htmlFor={_id}><IntlMsg {...label} />{required && <Required />}</FormLabel>;
  } else if (label && _.isString(label)) {
    labelOutput = <FormLabel htmlFor={_id}>{label}{required && <Required />}</FormLabel>;
  }

  return (
    <FormControl margin="normal" fullWidth component="div" error={!!error && touched}>
      {labelOutput}
      <DatePicker
        inputFormat="yyyy/MM/dd"
        value={dayjs(field.value, dateFormat).format('YYYY/MM/DD')}
        onChange={(date: any) => {
          form.setFieldValue(field.name, date ? dayjs(date).format(dateFormat) : '');
        }}
        renderInput={(props) => <TextFieldComponent {...props} />}
      />
      {touched && _.isString(error) && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}


const AdornmentWrapper = styled('div')`
  margin-right: 16px;
  padding: 3px 0;

  & > .MuiInputAdornment-root {
    height: auto;
  }

   & > .MuiInputAdornment-positionEnd {
    margin-left: 0;
   }
`;

export const TextFieldComponent = (props: any) => {
  return (
    <Box>
      <Box display="flex" justifyContent="center">
        <AdornmentWrapper>
          {props.InputProps.endAdornment}
        </AdornmentWrapper>
        <FormInput {...props} style={{ flexGrow: 1 }} />
      </Box>
      {props.helperText && <FormHelperText error>{props.helperText}</FormHelperText>}
    </Box>
  );
};

export default FormikDatePicker;
