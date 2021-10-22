import { gql } from '@apollo/client';

export const ASSESSMENT_SESSION_FIELDS = gql`
  fragment AssessmentSessionFields on AssessmentSession {
    _id
    location
    area
    address
    date
    start
    duration
    gender
  }
`;

export const CREATE_ASSESSMENT_SESSION = gql`
  mutation CreateAssessmentSession($data: CreateAssessmentSessionInput!) {
    createAssessmentSession(data: $data) {
      ...AssessmentSessionFields
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;


export const CREATE_ASSESSMENT_SESSIONS = gql`
  mutation CreateAssessmentSessions($assessmentId: ID!, $rows: [CreateAssessmentSessionInput!]!) {
    createAssessmentSessions(assessmentId: $assessmentId, rows: $rows) {
      ...AssessmentSessionFields
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;

export const REMOVE_ASSESSMENT_SESSION = gql`
  mutation RemoveSkill($_id: ID!) {
    removeAssessmentSession(_id: $_id) {
      _id
    }
  }
`;

export const RESTORE_ASSESSMENT_SESSION = gql`
  mutation RestoreSkill($_id: ID!) {
    restoreAssessmentSession(_id: $_id) {
      ...AssessmentSessionFields
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;


export const ASSIGN_JERSEY = gql`
  mutation assignJersey($_id: ID!, $playerAssessmentId: ID!, $jersey: Jersey) {
    assignJersey(_id: $_id, playerAssessmentId: $playerAssessmentId, jersey: $jersey) {
      _id
      jerseys
    }
  }
`;

export const UNASSIGN_JERSEY = gql`
  mutation unassignJersey($_id: ID!, $playerAssessmentId: ID!) {
    unassignJersey(_id: $_id, playerAssessmentId: $playerAssessmentId) {
      _id
      jerseys
    }
  }
`;

export const ADD_CHECKED_IN_PLAYER = gql`
  mutation addCheckedInPlayer($_id: ID!, $playerAssessmentId: ID!) {
    addCheckedInPlayer(_id: $_id, playerAssessmentId: $playerAssessmentId) {
      _id
      checkedInPlayers {
        _id
      }
    }
  }
`;

export const REMOVE_CHECKED_IN_PLAYER = gql`
  mutation removeCheckedInPlayer($_id: ID!, $playerAssessmentId: ID!) {
    removeCheckedInPlayer(_id: $_id, playerAssessmentId: $playerAssessmentId) {
      _id
      checkedInPlayers {
        _id
      }
    }
  }
`;
