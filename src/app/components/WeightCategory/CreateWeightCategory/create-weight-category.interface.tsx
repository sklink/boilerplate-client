import { FetchResult } from '@apollo/client';
import { FormikProps } from 'formik';
import { IFormOption } from '../../_core/_ui/forms.component';

export interface ICreateWeightCategoryContainer {
  createWeight: (values: ICreateWeightCategoryProps) => Promise<FetchResult>;
}

export interface ICreateWeightCategory {
  form: FormikProps<ICreateWeightCategoryFields>;
  skillOptions: IFormOption[];
  skillsLoading: boolean;
  submitError?: string;
  showSaved: boolean;
  isAdmin: boolean;
}


export interface ICreateWeightCategoryProps {
  name: string;
  weight: number;
  skillIds: string[];
  companyId: string;
  assessmentId: string;
  ageGroupId: string;
}

export interface ICreateWeightCategoryFields {
  name: string;
  weight: number;
  skillIds: IFormOption[];
}
