import _ from 'lodash';
import React, { ReactNode } from 'react';

// Material UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';

// Components
import { FormHelperText, FormInput, FormLabel, StartIcon } from '../_ui/forms.component';
import IntlMsg from '../IntlMsg/intl-msg.component';
import Required from '../required.component';

interface FormikSliderProps {
  id?: string,
  fid?: string,
  field: any,
  label?: any,
  form: any,
  margin?: 'none' | 'dense' | 'normal';
  required?: boolean;
  marks?: { value: number, label: string }[];
  step?: number;
  scale?: (value: number) => number;
  orientation?: 'horizontal' | 'vertical';
  track?: 'normal' | false | 'inverted';
  max?: number;
  min?: number;
  valueLabelDisplay?: 'on' | 'auto' | 'off';
  valueLabelFormat?: string | ((value: number, index: number) => ReactNode);
}



const FormikSlider: React.FC<FormikSliderProps> = ({
  field,
  required,
  margin,
  fid,
  id,
  label,
  form,
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
    <FormControl margin={margin || 'normal'} fullWidth component="div" error={!!error && touched}>
      {labelOutput}
      <Box display="flex" mt={6} mx={4}>
        <Slider
          id={_id}
          name={field.name}
          onChange={field.onChange}
          {...rest}
        />
      </Box>
      {touched && _.isString(error) && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
}

export default FormikSlider;
