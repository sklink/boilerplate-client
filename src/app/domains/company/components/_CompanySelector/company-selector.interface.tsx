import { IFormOption } from '../../../_core/_ui/forms.component';

export interface ICompanySelector {
  fetchError: boolean;
  loading: boolean;
  companyOptions: IFormOption[];
  activeCompanyOption?: IFormOption;
  onChangeCompany: Function;
}
