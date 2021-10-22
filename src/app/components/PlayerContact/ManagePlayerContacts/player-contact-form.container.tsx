import _ from 'lodash';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Data
import { isValidEmail, isValidPhone } from '../../../lib/helpers/validation.helpers';

// Components
import PlayerContactForm, { IPlayerContactFormFields } from './player-contact-form.component';

interface PlayerContactFormContainerProps {
  contact?: IPlayerContact;
  onSubmit: Function;
  onCancel?: Function;
}

const PlayerContactFormContainer: React.FC<PlayerContactFormContainerProps> = ({
  onSubmit,
  onCancel,
  contact
}) => {
  const INITIAL_FORM_VALUES: IPlayerContactFormFields = {
    name: contact?.name || '',
    email: contact?.email,
    phone: contact?.phone,
    sendSMS: contact && _.isBoolean(contact?.sendSMS) ? contact.sendSMS : false,
    sendEmail: contact && _.isBoolean(contact?.sendEmail) ? contact.sendEmail : true
  };

  async function handleSubmit(values: IPlayerContactFormFields) {
    onSubmit(values);
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Enter a name'),
    email: Yup.string().test('valid-email', 'Email is invalid', (value) => value === '' || !value || isValidEmail(value)),
    phone: Yup.string().test('valid=phone', 'Phone is invalid', (value) => value === '' || !value || isValidPhone(value))
  });

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <PlayerContactForm {...{ form, onCancel }} />}
    </Formik>
  );
};

export default PlayerContactFormContainer;
