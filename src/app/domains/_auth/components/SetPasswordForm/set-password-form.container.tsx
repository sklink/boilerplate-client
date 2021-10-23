import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

// Data
import { buildResetPassword, buildResetPasswordWithToken } from '../../../user/user.service';

// Components
import SetPasswordForm, { SetPasswordFormValues } from './set-password-form.component';

interface SetPasswordFormContainerProps {
  redirect?: string;
  redirectAction?: string;
  token?: string;
}

const SetPasswordFormContainer: React.FC<SetPasswordFormContainerProps> = ({ redirect, redirectAction, token }) => {
  const [showSaved, setShowSaved] = React.useState(false);
  const { resetPassword } = buildResetPassword();
  const { resetPasswordWithToken } = buildResetPasswordWithToken();
  const history = useHistory();
  const INITIAL_FORM_VALUES = { password: '', confirmPassword: '' };

  async function handleSubmit(values: SetPasswordFormValues, { setSubmitting }: any) {
    const reset = token
      ? resetPasswordWithToken({ password: values.password, token })
      : resetPassword(values.password);

    try {
      await reset;

      if (redirect) {
        history.push(redirect);
      } else {
        setSubmitting(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
      }
    } catch (err) {
      // TODO: Handle error
    }
  }

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Enter a password')
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*?[a-zA-Z0-9])(?=.*?[#?!@$_%^&*-]).{8,}$/, 'Password must contain at least one special character: #?!@$%^&*-_')
      .matches(/^[\S]+$/, 'Password cannot contain any spaces'),
    confirmPassword: Yup.string().required('Enter your password again').oneOf([Yup.ref('password')], 'Passwords must match')
  });

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <SetPasswordForm {...{ form, redirectAction, showSaved }} />}
    </Formik>
  );
};

export default SetPasswordFormContainer;
