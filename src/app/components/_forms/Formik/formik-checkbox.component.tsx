import React from 'react';
import _ from 'lodash';

// Material UI
import FormControl from '@mui/material/FormControl/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// Components
import { FormLabel } from '../../_core/_ui/forms.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import Required from '../required.component';

interface IFormikCheckboxProps {
  id?: string;
  fid?: string;
  field: any;
  label: any;
  margin?: 'none' | 'dense' | 'normal';
  autoWidth?: boolean;
  required?: boolean;
}

const FormikCheckbox: React.FC<IFormikCheckboxProps> = ({ autoWidth, margin, field, fid, id, label, required, ...rest }) => {
  const _id = id || fid;
  let labelOutput = label;
  if (label && label.id) {
    labelOutput = <FormLabel htmlFor={_id}><IntlMsg {...label} />{required && <Required />}</FormLabel>;
  } else if (label && _.isString(label)) {
    labelOutput = <FormLabel htmlFor={_id}>{label}{required && <Required />}</FormLabel>;
  }

  const checkbox = <Checkbox
    {...rest}
    id={_id}
    name={field.name}
    checked={Boolean(field.value)}
    onChange={(event, test) => { form.setFieldValue(field.name, event.target.checked)}}
  />;

 return (
    <FormControl margin={margin || 'normal'} fullWidth={!Boolean(autoWidth)} component="div" error={!!field.error}>
      {labelOutput ? <FormControlLabel control={checkbox} label={labelOutput}/> : checkbox}
    </FormControl>
  );
};

export default FormikCheckbox;
