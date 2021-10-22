import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { USER_SETTINGS_FRAGMENT } from '../../../lib/queries/user.queries';
import { getAuthUser } from '../../../lib/services/auth.service';
import CompanySelectorContainer from './company-selector.container';
import { buildUpdateUserSettings } from '../../../lib/services/user.service';

const GET_COMPANY_SELECTOR_QUERY = gql`
  query GetCompanySelector {
    companies {
      _id
      name
    }
  }
`;

const CompanySelectorGraphQL = () => {
  const { data, error, loading } = useQuery(GET_COMPANY_SELECTOR_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  const user = getAuthUser();
  const { updateUserSettings } = buildUpdateUserSettings();
  const companies = (data && data.companies) || [];

  const switchCompanyMutation = (companyId: string) => {
    return updateUserSettings({ activeCompanyId: companyId });
  }

  return <CompanySelectorContainer
    switchCompanyMutation={switchCompanyMutation}
    fetchError={Boolean(error)}
    loading={loading}
    user={user}
    companies={companies}
  />;
};

export default CompanySelectorGraphQL;
