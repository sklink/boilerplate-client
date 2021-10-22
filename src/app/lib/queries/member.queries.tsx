import { gql } from '@apollo/client';

export const MEMBER_FIELDS = gql`
  fragment MemberFields on Member {
    _id
    roles
    user {
      _id
      name
      email
    }
    createdAt
  }
`;

export const GET_CURR_MEMBER = gql`
  query GetCurrMember {
    getCurrMember {
      ...MemberFields
    }
  }

  ${MEMBER_FIELDS}
`;

export const GET_MEMBERS = gql`
  query GetMembers($companyId: ID!) {
    members(companyId: $companyId) {
      ...MemberFields
    }
  }

  ${MEMBER_FIELDS}
`;

export const REVOKE_MEMBER_ACCESS = gql`
  mutation RevokeMemberAccess($_id: ID!) {
    revokeMemberAccess(_id: $_id) {
      _id
    }
  }
`;

export const RESTORE_MEMBER_ACCESS = gql`
  mutation RestoreMemberAccess($_id: ID!) {
    restoreMemberAccess(_id: $_id) {
      ...MemberFields
    }
  }

  ${MEMBER_FIELDS}
`;
