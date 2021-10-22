import { gql } from '@apollo/client';

export const CONTACT_FIELDS = gql`
  fragment ContactFields on PlayerContact {
    _id
    name
    phone
    email
    sendSMS
    sendEmail
  }
`;

export const CREATE_PLAYER_CONTACT = gql`
  mutation CreatePlayerContact($code: String, $data: CreatePlayerContactInput!) {
    createPlayerContact(code: $code, data: $data) {
      ...ContactFields
    }
  }

  ${CONTACT_FIELDS}
`;

export const REMOVE_PLAYER_CONTACT = gql`
  mutation RemovePlayerContact($_id: ID!, $code: String) {
    removePlayerContact(_id: $_id, code: $code) {
      _id
    }
  }
`;

export const UPDATE_PLAYER_CONTACT = gql`
  mutation UpdatePlayerContact($_id: ID!, $code: String, $data: UpdatePlayerContactInput!) {
    updatePlayerContact(_id: $_id, code: $code, data: $data) {
      ...ContactFields
    }
  }

  ${CONTACT_FIELDS}
`;
