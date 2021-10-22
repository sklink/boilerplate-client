import { FetchResult } from '@apollo/client';
import { FormikProps } from 'formik';

import { IFormOption } from '../../_core/_ui/forms.component';

export interface IManagePracticePlansContainer {
  createDrill: (values: IManagePracticePlansProps) => Promise<FetchResult>;
  skills: ISkill[];
  skillsLoading: boolean;
  skillsError: boolean;
}

export interface IManagePracticePlans {
  form: FormikProps<IManagePracticePlansFields>;
  submitError?: string;
  showSaved: boolean;
  skillOptions: IFormOption[];
  skillsLoading: boolean;
  skillsError: boolean;
}


export interface IManagePracticePlansProps {
  name: string;
  skillIds: string[];
}

export interface IManagePracticePlansFields {
  name: string;
  skillIds: IFormOption[];
}
