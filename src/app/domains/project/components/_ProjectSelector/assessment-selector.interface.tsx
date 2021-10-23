import { IFormOption } from '../../../../components/_core/_ui/forms.component';

export interface IAssessmentSelector {
  fetchError: boolean;
  loading: boolean;
  assessmentOptions: IFormOption[];
  activeAssessmentOption?: IFormOption;
  onChangeAssessment: Function;
}
