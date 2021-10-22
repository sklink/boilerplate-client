import _ from 'lodash';
import React, { useEffect, useState } from 'react';

// Components
import CompanySelector from './company-selector.component';
import { IFormOption } from '../../_core/_ui/forms.component';

interface ICompanySelectorContainer {
  fetchError: boolean;
  loading: boolean;
  companies: ICompany[];
  user?: IUser | null;
  switchCompanyMutation: Function;
}

const CompanySelectorContainer: React.FC<ICompanySelectorContainer> = ({
  fetchError,
  loading,
  companies,
  user,
  switchCompanyMutation,
}) => {
  const [activeCompanyOption, setActiveCompanyOption] = useState<IFormOption>();
  const [companyOptions, setCompanyOptions] = useState<IFormOption[]>([]);

  useEffect(() => {
    const options: IFormOption[] = [];
    companies.forEach(company => {
     if (company) options.push({ value: company?._id, label: company.name });
    });
    setCompanyOptions(options);

    let nextActiveCompanyOption = _.find(options, option => option.value === user?.settings.activeCompanyId);
    if (!nextActiveCompanyOption && companies.length) nextActiveCompanyOption = options[0];
    setActiveCompanyOption(nextActiveCompanyOption);
  }, [user, companies]);

  const handleSwitchCompany = (_id: string) => {
    console.log('swtich', switchCompanyMutation)
    if (switchCompanyMutation) {
      switchCompanyMutation(_id);

      if (_.includes(window.location.pathname, 'reports')) {
        console.log('redirect');
        window.location.pathname = '/';
      }
    }
  }

  return <CompanySelector
    fetchError={fetchError}
    loading={loading}
    companyOptions={companyOptions}
    activeCompanyOption={activeCompanyOption}
    onChangeCompany={handleSwitchCompany}
  />
};

export default CompanySelectorContainer;
