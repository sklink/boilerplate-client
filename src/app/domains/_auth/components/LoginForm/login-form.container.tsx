import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Data
import { LoginFormContainerProps, LoginFormFields } from './login-form.interfaces';
import AuthApiService from '../../../../lib/utils/auth-api.service';
import { isValidEmail } from '../../../../lib/helpers/validation.helpers';
import { buildSetAuthUser } from '../../auth.service';
import { DEFAULT_USER_MODE } from '../../../../../_configuration';

// Components
import LoginForm from './login-form.component';

const LoginFormContainer: React.FC<LoginFormContainerProps> = ({ token }) => {
  const [submitError, setSubmitError] = useState();
  const onSetAuthUser = buildSetAuthUser();

  // Auto sign in if we have a token...
  if (token) {
    AuthApiService.authenticateWithToken({ token })
      .then((nextUser: IUser) => {
        return onSetAuthUser(nextUser)
      })
  }

  async function handleSubmit(values: LoginFormFields, { setSubmitting }: any) {
    setSubmitError(null);
    try {
      const nextUser = await AuthApiService.authenticate(values);

      await onSetAuthUser(nextUser, DEFAULT_USER_MODE, '/');
    } catch (err) {
      setSubmitError(err.message);
    }

    setSubmitting(false);
  }

  const INITIAL_FORM_VALUES = { email: '', password: '' };


  const validationSchema = Yup.object().shape({
    email: Yup.string().test('valid-email', 'Enter a valid email address', isValidEmail),
    password: Yup.string().required('Password is required')
  });

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <LoginForm form={form} submitError={submitError} />}
    </Formik>
  );
}

export default LoginFormContainer;
