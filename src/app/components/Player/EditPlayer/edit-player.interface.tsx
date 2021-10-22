import { FormikProps } from 'formik';
import { IFormOption } from '../../_core/_ui/forms.component';

export interface IEditPlayerContainer {
  createPlayerMutation: Function;
  fetchError: boolean;
  loading: boolean;
}

export interface IEditPlayer {
  form: FormikProps<IEditPlayerFields>;
  submitError?: string;
  showSaved: boolean;
  fetchError: boolean;
  loading: boolean;
}

export interface IEditPlayerProps {
  firstName: String;
  lastName: String;
  dateOfBirth: String;
  gender?: String;
  externalId?: String;
}

export interface IEditPlayerFields {
  firstName?: string;
  lastName?: string;
  date?: string;
  gender: IFormOption;
  externalId?: string;
}
