import { gql } from '@apollo/client';

export const SKILL_CATEGORY_FIELDS = gql`
  fragment SkillCategoryFields on SkillCategory {
    _id
    name
  }
`;

export const CREATE_SKILL_CATEGORY = gql`
  mutation CreateSkillCategory($data: CreateSkillCategoryInput!) {
    createSkillCategory(data: $data) {
      ...SkillCategoryFields
    }
  }

  ${SKILL_CATEGORY_FIELDS}
`;
