import { gql } from '@apollo/client';

export const DRILL_FIELDS = gql`
  fragment DrillFields on Drill {
    _id
    name
  }
`;

export const REMOVE_DRILL = gql`
  mutation RemoveDrill($_id: ID!) {
    removeDrill(_id: $_id) {
      _id
    }
  }
`;

export const RESTORE_DRILL = gql`
  mutation RestoreDrill($_id: ID!) {
    restoreDrill(_id: $_id) {
      ...DrillFields
    }
  }

  ${DRILL_FIELDS}
`;
