import { FormikProps } from 'formik';

export interface ForgotPasswordFields {
  email: string;
}

export interface ForgotPasswordFormProps {
  form: FormikProps<ForgotPasswordFields>;
  isSubmitted: boolean;
  submitError?: string;
}
