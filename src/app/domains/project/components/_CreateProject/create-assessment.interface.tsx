import { FormikProps } from 'formik';

export interface ICreateAssessmentContainer {
  createAssessmentMutation: Function;
}

export interface ICreateAssessment {
  form: FormikProps<ICreateAssessmentFields>;
  submitError?: string;
}

export interface ICreateAssessmentFields {
  name: string;
}
