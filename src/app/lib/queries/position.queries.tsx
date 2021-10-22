import { gql } from '@apollo/client';

export const POSITION_FIELDS = gql`
  fragment PositionFields on Position {
    _id
    name
  }
`;

export const GET_POSITIONS = gql`
  query GetPositions($companyId: ID!, $includeGlobal: Boolean) {
    positions(companyId: $companyId, includeGlobal: $includeGlobal) {
      ...PositionFields
    }
  }

  ${POSITION_FIELDS}
`;

export const CREATE_POSITION = gql`
  mutation CreatePosition($data: CreatePositionInput!) {
    createPosition(data: $data) {
      ...PositionFields
    }
  }

  ${POSITION_FIELDS}
`;
