import { FormikProps } from 'formik';
import { IFormOption } from '../../_core/_ui/forms.component';

export interface ICreatePlayerContainer {
  createPlayerContact: Function;
  createPlayerMutation: Function;
  ageGroups: IAgeGroup[];
  createAgeGroup: Function;
  positions: IPosition[];
  createPosition: Function;
  fetchError: boolean;
  loading: boolean;
}

export interface ICreatePlayer {
  form: FormikProps<ICreatePlayerFields>;
  submitError?: string;
  showSaved: boolean;
  ageGroupOptions: IFormOption[];
  createAgeGroup: Function;
  positionOptions: IFormOption[];
  createPosition: Function;
  fetchError: boolean;
  loading: boolean;
}

interface ICreatePlayerPropsPlayer {
  _id?: string;
  firstName: String;
  lastName: String;
  dateOfBirth: String;
  gender?: String;
  externalId?: String;
}

export interface ICreatePlayerProps {
  player: ICreatePlayerPropsPlayer;
  assessmentId: string;
  positionId: string;
  ageGroupId: string;
}

export interface ICreatePlayerFields {
  firstName: string;
  lastName: string;
  date: string;
  gender: IFormOption;
  positionId?: IFormOption;
  ageGroupId?: IFormOption;
  primaryContact?: IPlayerContact;
  contacts: IPlayerContact[];
  externalId?: string;
}
