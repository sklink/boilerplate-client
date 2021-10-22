import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';
import DateFnsUtils from '@date-io/date-fns';

// Material UI
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl/FormControl';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

// Components
import { FormHelperText, FormInput, FormLabel } from '../_ui/forms.component';
import IntlMsg from '../IntlMsg/intl-msg.component';
import { timeToNum } from '../../../lib/helpers/conversion.helpers';
import styled from 'styled-components';

interface IFormikTimePicker {
  id?: string,
  fid?: string,
  field: any,
  htmlFor?: string,
  label?: any,
  form: any,
}

const FormikTimePicker: React.FC<IFormikTimePicker> = ({
  field,
  fid,
  id,
  label,
  form,
  ...rest
}) => {
  const _id = id || fid;
  const error = form.errors[field.name];
  const touched = form.touched[field.name];

  let labelOutput = label;
  if (label && label.id) {
    labelOutput = <FormLabel htmlFor={_id}><IntlMsg {...label} /></FormLabel>;
  } else if (label && _.isString(label)) {
    labelOutput = <FormLabel htmlFor={_id}>{label}</FormLabel>;
  }

  return (
    <FormControl margin="dense" fullWidth component="div" error={!!error && touched}>
      {labelOutput}
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          id={_id}
          autoOk
          minutesStep={5}
          margin="normal"
          mask="__:__ _M"
          value={dayjs().startOf('day').add(field.value, 'minute').toDate()}
          onChange={(value: MaterialUiPickersDate) => {
            if (value) {
              form.setFieldValue(field.name, timeToNum(dayjs(value).format('h:mm A')));
            }
          }}
          TextFieldComponent={TextFieldComponent}
        />
      </MuiPickersUtilsProvider>
      {touched && _.isString(error) && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

const AdornmentWrapper = styled.div`
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
