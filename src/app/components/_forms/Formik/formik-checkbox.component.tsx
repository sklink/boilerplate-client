import React from 'react';

// Material UI
import FormControl from '@material-ui/core/FormControl/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormLabel } from '../../_core/_ui/forms.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import _ from 'lodash';

interface IFormikCheckboxProps {
  id?: string;
  fid?: string;
  field: any;
  label: any;
  margin?: 'none' | 'dense' | 'normal';
  autoWidth?: boolean;
}

const FormikCheckbox: React.FC<IFormikCheckboxProps> = ({ autoWidth, margin, field, fid, id, label, ...rest }) => {
  const _id = id || fid;
  let labelOutput = label;
  if (label && label.id) {
    labelOutput = <FormLabel htmlFor={_id}><IntlMsg {...label} /></FormLabel>;
  } else if (label && _.isString(label)) {
    labelOutput = <FormLabel htmlFor={_id}>{label}</FormLabel>;
  }

  const checkbox = <Checkbox
    {...rest}
    id={_id}
    name={field.name}
    checked={Boolean(field.value)}
    onChange={field.onChange}
  />;

 return (
    <FormControl margin={margin || 'normal'} fullWidth={!Boolean(autoWidth)} component="div" error={!!field.error}>
      {labelOutput ? <FormControlLabel control={checkbox} label={labelOutput}/> : checkbox}
    </FormControl>
  );
};

export default FormikCheckbox;
