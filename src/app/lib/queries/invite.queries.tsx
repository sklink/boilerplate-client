import { gql } from '@apollo/client';

export const INVITE_FIELDS = gql`
  fragment InviteFields on Invite {
    _id
    email
    status
    companyName
    sentAt
    expiresAt
    isPasswordRequired
  }
`;

export const GET_INVITE = gql`
  query GetInvite($code: String!) {
    invite(code: $code) {
      ...InviteFields
    }
  }

  ${INVITE_FIELDS}
`;

export const GET_INVITES = gql`
  query GetInvites($status: String!, $companyId: ID!) {
    invites(status: $status, companyId: $companyId) {
      ...InviteFields
    }
  }

  ${INVITE_FIELDS}
`;

export const SEND_INVITE = gql`
  mutation SendInvite($data: CreateMemberInviteInput!) {
    sendInvite(data: $data) {
      ...InviteFields
    }
  }

  ${INVITE_FIELDS}
`;

export const REMOVE_INVITE = gql`
  mutation RemoveInvite($_id: ID!) {
    removeInvite(_id: $_id) {
      _id
    }
  }
`;

export const RESEND_INVITE = gql`
  mutation ResendInvite($_id: ID!) {
    resendInvite(_id: $_id) {
      _id
    }
  }
`;

export const ACCEPT_INVITE = gql`
  mutation AcceptInvite($data: AcceptInviteInput!) {
    acceptInvite(data: $data) {
      _id
    }
  }
`;
