import { gql } from '@apollo/client';

export const GET_COMPANY_BY_DOMAIN = gql`
  query GetCompanyByDomain($domain: String!) {
    companyByDomain(domain: $domain) {
      _id
      name
    }
  }
`;

export const REGISTER_COMPANY = gql`
  mutation RegisterCompany($data: RegistrationInput) {
    register(data: $data) {
      success
    }
  }
`;
