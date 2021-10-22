import { gql } from '@apollo/client';

export const AGE_GROUP_FIELDS = gql`
  fragment AgeGroupFields on AgeGroup {
    _id
    name
    minAge
    maxAge
    assessmentId
    companyId
  }
`;

export const GET_AGE_GROUPS = gql`
  query GetAgeGroups($assessmentId: ID!) {
    ageGroups(assessmentId: $assessmentId) {
      _id
      name
      assessmentId
    }
  }
`;

export const CREATE_AGE_GROUP = gql`
  mutation CreateAgeGroup($data: CreateAgeGroupInput!) {
    createAgeGroup(data: $data) {
      ...AgeGroupFields
    }
  }

  ${AGE_GROUP_FIELDS}
`;
