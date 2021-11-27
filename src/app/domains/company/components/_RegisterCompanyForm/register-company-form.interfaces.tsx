import { IFormOption } from '../../../_core/_ui/forms.component';

export interface IRegisterCompanyFields {
  email: string;
  companyName?: string;
  companyId?: string;
  name: string;
  enableDomainSignOn: boolean;
  timezone: IFormOption;
}

export interface IRegisterCompanyProps {
  email: string;
  companyName?: string;
  companyId?: string;
  name: string;
  enableDomainSignOn: boolean;
  timezone?: string;
}
