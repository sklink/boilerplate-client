import { gql } from '@apollo/client';

export const ASSESSMENT_STAGE_FIELDS = gql`
  fragment AssessmentStageFields on AssessmentStage {
    _id
    order
    type
    config
  }
`;

export const CREATE_ASSESSMENT_STAGE = gql`
  mutation CreateAssessmentStage($data: CreateAssessmentStageInput!) {
    createAssessmentStage(data: $data) {
      ...AssessmentStageFields
    }
  }

  ${ASSESSMENT_STAGE_FIELDS}
`;

export const UPDATE_ASSESSMENT_STAGE = gql`
  mutation UpdateAssessmentStage($_id: ID!, $data: UpdateAssessmentStageInput!) {
    updateAssessmentStage(_id: $_id, data: $data) {
      ...AssessmentStageFields
    }
  }

  ${ASSESSMENT_STAGE_FIELDS}
`;

export const REMOVE_ASSESSMENT_STAGE = gql`
  mutation RemoveAssessmentStage($_id: ID!) {
    removeAssessmentStage(_id: $_id) {
      _id
    }
  }
`;
