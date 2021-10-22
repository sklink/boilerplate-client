import { gql } from '@apollo/client';

export const CREATE_SCORE_FIELDS = gql`
  fragment CreateScoreFields on Score {
    _id
    raw
    type
    assessmentId
    playerAssessmentId
    drillId
    skillId
    assessmentSessionId
    ageGroupId
    round
  }
`;
