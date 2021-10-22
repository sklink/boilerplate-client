import { gql } from '@apollo/client';

export const PRACTICE_PLAN_FIELDS = gql`
  fragment PracticePlanFields on PracticePlan {
    _id
    name
  }
`;

export const REMOVE_PRACTICE_PLAN = gql`
  mutation RemovePracticePlan($_id: ID!) {
    removePracticePlan(_id: $_id) {
      _id
    }
  }
`;

export const RESTORE_PRACTICE_PLAN = gql`
  mutation RestorePracticePlan($_id: ID!) {
    restorePracticePlan(_id: $_id) {
      ...PracticePlanFields
    }
  }

  ${PRACTICE_PLAN_FIELDS}
`;
