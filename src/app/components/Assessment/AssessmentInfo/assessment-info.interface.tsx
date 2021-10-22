import { FormikProps } from 'formik';

export interface IAssessmentInfoContainer {
  assessment?: IAssessment;
  updateAssessment: Function;
  loading: boolean;
  fetchError: boolean;
}

export interface IAssessmentInfoFields {
  covidLink?: string;
  infoLink?: string;
}

export interface IAssessmentInfo {
  form: FormikProps<IAssessmentInfoFields>;
  showSaved: boolean;
}
