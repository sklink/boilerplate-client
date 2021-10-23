import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Data
import { buildRequestPasswordReset } from '../../../user/user.service';

// Components
import ForgotPasswordForm from './forgot-password-form.component';
import { isValidEmail } from '../../../../lib/helpers/validation.helpers';
import { ForgotPasswordFields } from './forgot-password-form.interface';
import { HAS_PHI } from '../../../../../_configuration';

const ForgotPasswordFormContainer = () => {
  const [submitError, setSubmitError] = React.useState();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { requestPasswordReset } = buildRequestPasswordReset();
  const INITIAL_FORM_VALUES = { email: '' };

  async function handleSubmit(values: ForgotPasswordFields, { setSubmitting }: any) {
    setSubmitError(null);

    if (HAS_PHI) {
      setSubmitting(false);
      setIsSubmitted(true);
    }

    requestPasswordReset(values.email)
      .then(result => {
        if (!HAS_PHI) {
          setSubmitting(false);

          if (result.errors && result.errors.length) {
            setSubmitError('Could not find a user with that email address');
          } else {
            setIsSubmitted(true);
          }
        }
      })
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().test('valid-email', 'Enter a valid email address', isValidEmail),
  });

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <ForgotPasswordForm form={form} isSubmitted={isSubmitted} submitError={submitError} />}
    </Formik>
  );
};

ForgotPasswordFormContainer.propTypes = {
  redirect: PropTypes.string,
  redirectAction: PropTypes.string,
}

export default ForgotPasswordFormContainer;
