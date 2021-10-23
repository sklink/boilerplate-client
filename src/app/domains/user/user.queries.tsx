import { gql } from '@apollo/client';

export const USER_SETTINGS_FRAGMENT = gql`
  fragment UserSettings on User {
    settings {
      activeCompanyId
      activeAssessmentId
      activeAgeGroupIds
    }
  }
`;

export const UPDATE_USER_SETTINGS = gql`
  mutation UpdateUserSettings($_id: ID!, $settings: UserSettingsInput!) {
    updateUserSettings(_id: $_id, settings: $settings) {
      _id
      ...UserSettings
    }
  }

  ${USER_SETTINGS_FRAGMENT}
`;

export const GET_CURR_USER = gql`
  query getCurrUser {
    loggedInUser {
      _id
      name
      email
      settings {
        activeCompanyId
        activeAssessmentId
        activeAgeGroupIds
      }
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation SetPassword($password: String!) {
    resetPassword(password: $password) {
      success
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordResetLink(email: $email) {
      success
    }
  }
`;

export const RESET_PASSWORD_WITH_TOKEN = gql`
  mutation ResetPasswordWithToken($token: String!, $password: String!) {
    resetPasswordWithToken(token: $token, password: $password) {
      success
    }
  }
`;
