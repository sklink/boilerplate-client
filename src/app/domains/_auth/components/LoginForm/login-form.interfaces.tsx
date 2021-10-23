import { FormikProps } from 'formik';

export interface LoginFormFields {
  email: string;
  password: string;
}

export interface LoginFormContainerProps {
  token?: string;
}

export interface LoginFormProps {
  form: FormikProps<LoginFormFields>;
  submitError?: string;
}
