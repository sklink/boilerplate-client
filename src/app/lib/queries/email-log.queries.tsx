import { gql } from '@apollo/client';

export const COMMUNICATION_FIELDS = gql`
  fragment CommunicationFields on Communication {
    _id
    to
    type
    method
    scheduledAt
    sentAt
  }
`;

export const REQUEST_EMAILS = gql`
  mutation RequestEmails($email: String!, $types: [String!]!) {
    requestEmails(email: $email, types: $types)
  }
`;

export const COUNT_HAS_UNSENT_TYPE = gql`
  query CountHasUnsentType($assessmentId: ID!, $ageGroupIds: [ID!]!, $playerAssessmentIds: [ID!], $type: String!) {
    countHasUnsentType(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds, playerAssessmentIds: $playerAssessmentIds, type: $type)
  }
`;

export const SEND_COMMUNICATION = gql`
  mutation SendCommunication($assessmentId: ID!, $ageGroupIds: [ID!]!, $type: String!, $resend: Boolean) {
    sendCommunication(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds, type: $type, resend: $resend)
  }
`;
