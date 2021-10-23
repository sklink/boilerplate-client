import { IFormOption } from '../../../../components/_core/_ui/forms.component';

export interface ICompanySelector {
  fetchError: boolean;
  loading: boolean;
  companyOptions: IFormOption[];
  activeCompanyOption?: IFormOption;
  onChangeCompany: Function;
}
