import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

// Material UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl/FormControl';
import TimePicker from '@mui/lab/TimePicker';

// Components
import { FormHelperText, FormInput, FormLabel } from '../../_core/_ui/forms.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { timeToNum } from '../../../lib/helpers/conversion.helpers';
import Required from '../required.component';

interface IFormikTimePicker {
  id?: string,
  fid?: string,
  field: any,
  htmlFor?: string,
  label?: any,
  form: any,
  required?: boolean,
}

const FormikTimePicker: React.FC<IFormikTimePicker> = ({
  field,
  fid,
  id,
  label,
  form,
  required,
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
    <FormControl margin="dense" fullWidth component="div" error={!!error && touched}>
      {labelOutput}
      <TimePicker
        minutesStep={5}
        mask="__:__ _M"
        value={dayjs().startOf('day').add(field.value, 'minute').toDate()}
        onChange={(date: any) => {
          if (date) {
            form.setFieldValue(field.name, timeToNum(dayjs(date).format('h:mm A')));
          }
        }}
        renderInput={(props) => <TextFieldComponent {...props} />}
      />
      {touched && _.isString(error) && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

const AdornmentWrapper = styled('div')`
  margin-right: 4px;
  padding: 3px 0px;

  & > .MuiInputAdornment-root {
    height: auto;
  }

   & > .MuiInputAdornment-positionEnd {
    margin-left: 0;
   }
`;

const TextFieldComponent = (props: any) => {
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

export default FormikTimePicker;
