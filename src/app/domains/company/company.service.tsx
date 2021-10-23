import _ from 'lodash';
import { useMutation, useQuery } from '@apollo/client';

// Data
import { getCurrUser } from '../user/user.service';
import { GET_COMPANY_BY_DOMAIN, REGISTER_COMPANY } from './company.queries';

export const getActiveCompanyId = () => {
  const { user } = getCurrUser();

  return _.get(user, 'settings.activeCompanyId');
};

export const getCompanyByDomain = (domain: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, ...rest } = useQuery(GET_COMPANY_BY_DOMAIN, {
    skip: !domain,
    variables: { domain },
    fetchPolicy: 'network-only'
  });

  return { ...rest, company: _.get(data, 'companyByDomain') };
};

interface IRegisterCompanyInput {
  companyId?: string;
  companyName?: string;
  name: string;
  email: string;
  enableDomainSignOn: boolean;
}

export const buildRegisterCompany = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [register, ...rest] = useMutation(REGISTER_COMPANY);

  return {
    ...rest,
    registerCompany: (data: IRegisterCompanyInput) =>
      register({ variables: { data } })
  }
};
