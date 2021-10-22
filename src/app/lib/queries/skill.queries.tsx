import { gql } from '@apollo/client';

export const SKILL_FIELDS = gql`
  fragment SkillFields on Skill {
    _id
    name
    type
    options
  }
`;

export const REMOVE_SKILL = gql`
  mutation RemoveSkill($_id: ID!) {
    removeSkill(_id: $_id) {
      _id
    }
  }
`;

export const RESTORE_SKILL = gql`
  mutation RestoreSkill($_id: ID!) {
    restoreSkill(_id: $_id) {
      ...SkillFields
    }
  }

  ${SKILL_FIELDS}
`;
