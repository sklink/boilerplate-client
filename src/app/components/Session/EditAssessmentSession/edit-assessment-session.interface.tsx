import { ApolloError } from '@apollo/client';
import { FormikProps } from 'formik';

import { IFormOption } from '../../_core/_ui/forms.component';

export interface IEditAssessmentSessionContainer {
  assessmentSession?: IAssessmentSession;
  createAgeGroup: Function;
  updateAssessmentSession: Function;
  ageGroups: IAgeGroup[];
  ageGroupsLoading: boolean;
  ageGroupsError?: ApolloError;
}

export interface IEditAssessmentSession {
  form: FormikProps<IEditAssessmentSessionFields>;
  submitError?: string;
  showSaved: boolean;
  createAgeGroup: Function;
  ageGroupOptions: IFormOption[];
  ageGroupsLoading?: boolean;
  sendNotification: boolean;
  setSendNotification: Function;
}

export interface IEditAssessmentSessionFields {
  location?: string;
  area?: string;
  address: string;
  date: string;
  start: number;
  duration: number;
  gender?: IFormOption;
  ageGroupId?: IFormOption;
  notify: boolean;
}
