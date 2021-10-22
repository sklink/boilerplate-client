import { gql } from '@apollo/client';

export const PLAYER_FIELDS = gql`
  fragment PlayerFields on Player {
    _id
    firstName
    lastName
    dateOfBirth
    gender
    externalId
  }
`;

