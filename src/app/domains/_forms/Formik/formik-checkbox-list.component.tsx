import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';

// Components
import IntlMsg from '../../misc/IntlMsg/intl-msg.component';
import { Spacer } from '../../misc/misc.styled-components';
import { CheckboxList, CheckboxListHeading, CheckboxListItem } from '../../_ui/form.components';
import FormLabel from '../FormLabel/form-label.styled';
import Required from '../required.component';

interface IFormikCheckboxList {
  id?: string;
  fid?: string;
  field: any;
  label: any;
  form: any;
  options: any[];
  loading?: boolean;
  hasNoOptionsMsg?: string;
  required?: boolean;
}

const FormikCheckboxList: React.FC<IFormikCheckboxList> = ({
  field,
  fid,
  id,
  label,
  form,
  options,
  loading,
  hasNoOptionsMsg,
  required
}) => {
  const { values, setFieldValue } = form;

  const _id = id || `${fid}_${field.name}`;
  const error = _.get(form, `errors.${field.name}`);
  const touched = _.get(form, `touched.${field.name}`);

  let eleLabel = label;
  if (label && label.id) {
    eleLabel = <FormLabel htmlFor={_id}><IntlMsg {...label} />{required && <Required />}</FormLabel>;
  } else if (label && _.isString(label)) {
    eleLabel = <FormLabel htmlFor={_id}>{label}{required && <Required />}</FormLabel>;
  }

  return (
    <div>
      <CheckboxListHeading>
        {eleLabel}
        <Spacer />
        <FormLabel htmlFor="co_toggleAll">Toggle All</FormLabel>
        <Checkbox
          id="co_toggleAll"
          checked={values && _.keys(_.get(values, field.name)).length === options.length}
          onChange={e => {
            if (e.currentTarget.checked) {
              setFieldValue(field.name, _.keyBy(options, option => option.value))
            } else {
              setFieldValue(field.name, {});
            }
          }}
        />
      </CheckboxListHeading>
      <CheckboxList>
        {options && _.map(options, option => (
          <CheckboxListItem key={option.value}>
            <FormLabel grow left htmlFor={`option__${option._id}`}>{option.label}</FormLabel>
            <Checkbox
              id={`option__${option.value}`}
              onChange={e => {
                const nextValues = { ..._.get(values, field.name, {}) };

                if (e.currentTarget.checked) {
                  nextValues[option.value] = true;
                } else {
                  delete nextValues[option.value];
                }

                setFieldValue(field.name, nextValues)
              }}
              checked={Boolean(_.get(values, `${field.name}.${option.value}`))}
            />
          </CheckboxListItem>
        ))}
        {loading && <CheckboxListItem><FormLabel grow left>Loading...</FormLabel></CheckboxListItem>}
        {hasNoOptionsMsg && !loading && options && !options.length && <CheckboxListItem><FormLabel grow left>{hasNoOptionsMsg}</FormLabel></CheckboxListItem>}
      </CheckboxList>
      {_.isString(error) && touched && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
};

FormikCheckboxList.propTypes = {
  _id: (props, propName, componentName) =>
    !props.id && !props.fid ? new Error(`One of props 'id' or 'fid' was not specified in '${componentName}'.`) : null,
  id: PropTypes.string,
  fid: PropTypes.string,
  field: PropTypes.object.isRequired,
  label: PropTypes.any,
  form: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  hasNoOptionsMsg: PropTypes.string,
};

export default FormikCheckboxList;
