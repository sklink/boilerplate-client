import { FetchResult } from '@apollo/client';
import { FormikProps } from 'formik';
import { IFormOption } from '../../_core/_ui/forms.component';

export interface ICreateSkillContainer {
  createSkill: (values: ICreateSkillProps) => Promise<FetchResult>;
}

export interface ICreateSkill {
  form: FormikProps<ICreateSkillFields>;
  submitError?: string;
  showSaved: boolean;
  isAdmin: boolean;
}


export interface ICreateSkillProps {
  name: string;
  type: string;
  options: any;
  companyId?: string;
}

export interface ICreateSkillFields {
  name: string;
  type: IFormOption;
  options: any;
  isGlobal: boolean;
}
