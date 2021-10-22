import { FetchResult } from '@apollo/client';
import { FormikProps } from 'formik';
import { IFormOption } from '../../_core/_ui/forms.component';

export interface ICreateDrillContainer {
  drill?: IDrill;
  createDrill: (values: ICreateDrillProps) => Promise<FetchResult>;
  skills: ISkill[];
  positions: IPosition[];
  createPosition: Function;
  loading: boolean;
  fetchError: boolean;
  user?: IUser | null;
}

export interface ICreateDrill {
  isEditing: boolean;
  form: FormikProps<ICreateDrillFields>;
  submitError?: string;
  showSaved: boolean;
  skillOptions: IFormOption[];
  positionOptions: IFormOption[];
  createPosition: Function;
  loading: boolean;
  fetchError: boolean;
  isAdmin: boolean;
}


export interface ICreateDrillProps {
  name: string;
  skillSets: ISkillSet[];
  companyId: string;
}

export interface ISkillSetFields {
  positionIds: IFormOption[];
  skillIds: IFormOption[];
}

export interface ICreateDrillFields {
  drillName: string;
  skillSets: ISkillSetFields[];
  isGlobal: boolean;
}
