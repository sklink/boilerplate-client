import { ApolloError } from '@apollo/client';
import { FormikProps } from 'formik';

import { IFormOption } from '../../_core/_ui/forms.component';

export interface ICreateAssessmentSessionContainer {
  createAgeGroup: Function;
  createAssessmentSession: Function;
  ageGroups: IAgeGroup[];
  ageGroupsLoading: boolean;
  ageGroupsError?: ApolloError;
}

export interface ICreateAssessmentSession {
  form: FormikProps<ICreateAssessmentSessionFields>;
  submitError?: string;
  showSaved: boolean;
  createAgeGroup: Function;
  ageGroupOptions: IFormOption[];
  ageGroupsLoading?: boolean;
}

export interface ICreateAssessmentSessionFields {
  location?: string;
  area?: string;
  address: string;
  date: string;
  start: number;
  duration: number;
  gender?: IFormOption;
  ageGroupId?: IFormOption;
}
