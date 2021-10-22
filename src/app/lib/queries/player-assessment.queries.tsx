import { gql } from '@apollo/client';

// Queries
import { PLAYER_FIELDS } from './player.queries';
import { AGE_GROUP_FIELDS } from './age-group.queries';
import { POSITION_FIELDS } from './position.queries';

export const PLAYER_ASSESSMENT_FIELDS = gql`
  fragment PlayerAssessmentFields on PlayerAssessment {
    _id
    player {
      ...PlayerFields
    }
    ageGroup {
      ...AgeGroupFields
    }
    position {
      ...PositionFields
    }
  }

  ${PLAYER_FIELDS}
  ${AGE_GROUP_FIELDS}
  ${POSITION_FIELDS}
`;

export const ADD_PLAYER_TO_ASSESSMENT = gql`
  mutation AddPlayerToAssessment($data: AddPlayerAssessmentInput!) {
    addPlayerToAssessment(data: $data) {
      ...PlayerAssessmentFields
    }
  }

  ${PLAYER_ASSESSMENT_FIELDS}
`;

export const REMOVE_PLAYER_ASSESSMENT = gql`
  mutation RemovePlayerAssessment($_id: ID!) {
    removePlayerAssessment(_id: $_id) {
      _id
    }
  }
`;

export const CREATE_PLAYER_ASSESSMENTS = gql`
  mutation CreatePlayerAssessments($companyId: ID!, $rows: [CreatePlayerAssessmentInput!]!, $forceCreate: Boolean) {
    createPlayerAssessments(companyId: $companyId, rows: $rows, forceCreate: $forceCreate) {
      ...PlayerAssessmentFields
    }
  }

  ${PLAYER_ASSESSMENT_FIELDS}
`;

export const CREATE_PLAYER_ASSESSMENT = gql`
  mutation CreatePlayerAssessment($companyId: ID!, $data: CreatePlayerAssessmentInput!, $forceCreate: Boolean) {
    createPlayerAssessment(companyId: $companyId, data: $data, forceCreate: $forceCreate) {
      ...PlayerAssessmentFields
    }
  }

  ${PLAYER_ASSESSMENT_FIELDS}
`;

export const UPDATE_PLAYER_ASSESSMENT = gql`
  mutation UpdatePlayerAssessment($_id: ID!, $data: UpdatePlayerAssessmentInput!) {
    updatePlayerAssessment(_id: $_id, data: $data) {
      _id
      position {
        _id
        name
      }
    }
  }
`;
