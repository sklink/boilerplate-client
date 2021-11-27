import _ from 'lodash';
import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

// Material UI
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl/FormControl';

// Components
import { FormLabel } from '../../_core/_ui/forms.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import Required from '../required.component';

interface IFormikSelect {
  canCreate?: boolean;
  createMethod?: Function;
  id?: string;
  fid?: string;
  label?: any;
  field: any;
  htmlFor?: string;
  form: any;
  options: any[];
  margin?: 'none' | 'dense' | 'normal';
  isMulti?: boolean;
  required?: boolean;
}

export const FormikSelect: React.FC<IFormikSelect> = ({ margin, canCreate, createMethod, options, field, form, fid, id, label, isMulti, required, ...rest }) => {
  const Control: any = canCreate ? CreatableSelect : Select;
  const _id = id || fid;
  const error = _.get(form, `errors.${field.name}`);
  const touched = _.get(form, `touched.${field.name}`);

  let labelOutput = label;
  if (label && label.id) {
    labelOutput = <FormLabel htmlFor={_id}><IntlMsg {...label} />{required && <Required />}</FormLabel>;
  } else if (label && _.isString(label)) {
    labelOutput = <FormLabel htmlFor={_id}>{label}{required && <Required />}</FormLabel>;
  }

  options = options.length && _.isString(options[0])
    ? _.map(options, option => ({ value: option, label: option }))
    : options;

  return (
    <FormControl margin={margin || 'dense'} fullWidth component="div" error={!!error && touched}>
      {labelOutput}
      <Control
        id={_id}
        {...rest}
        options={options}
        name={field.name}
        noOptionsMessage={() => canCreate ? 'Type to create new' : 'No Options'}
        value={field.value}
        onChange={(option: any, context: any) => {
          if (canCreate && context.action === 'create-option') {
            if (!createMethod) {
              form.setFieldValue(`create${_.upperFirst(field.name)}`, true)
            } else {
              createMethod(form, context.option.value, field.name);
            }
          }

          if (!canCreate || !createMethod || context.action !== 'create-option') {
            form.setFieldValue(field.name, option)
          }
        }}
        onBlur={field.onBlur}
        isMulti={isMulti}
      />
      {_.isString(error) && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FormikSelect;
