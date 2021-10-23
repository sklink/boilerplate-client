import { gql } from '@apollo/client';

export const ASSESSMENT_FIELDS = gql`
  fragment AssessmentFields on Assessment {
    _id
    name
  }
`;

export const UPDATE_ASSESSMENT = gql`
  mutation UpdateAssessment($_id: ID!, $data: UpdateAssessmentInput!) {
    updateAssessment(_id: $_id, data: $data) {
      ...AssessmentFields
    }
  }

  ${ASSESSMENT_FIELDS}
`;
