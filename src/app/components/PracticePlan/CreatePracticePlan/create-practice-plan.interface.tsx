import { FetchResult } from '@apollo/client';
import { FormikProps } from 'formik';
import { IFormOption } from '../../_core/_ui/forms.component';

export interface ICreatePracticePlanContainer {
  createPracticePlan: (values: ICreatePracticePlanProps) => Promise<FetchResult>;
  drills: IDrill[];
  drillsLoading: boolean;
  drillsError: boolean;
}

export interface ICreatePracticePlan {
  form: FormikProps<ICreatePracticePlanFields>;
  submitError?: string;
  showSaved: boolean;
  drillOptions: IFormOption[];
  drillsLoading: boolean;
  drillsError: boolean;
  isAdmin: boolean;
}


export interface ICreatePracticePlanProps {
  name: string;
  drillIds: string[];
  companyId?: string;
}

export interface ICreatePracticePlanFields {
  practicePlanName: string;
  drillIds: IFormOption[];
  isGlobal: boolean;
}
