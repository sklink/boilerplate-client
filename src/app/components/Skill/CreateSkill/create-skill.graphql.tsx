import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Data
import { createCacheModifier } from '../../../lib/cache/basic.cache';
import { SKILL_FIELDS } from '../../../lib/queries/skill.queries';
import { ICreateSkillProps } from './create-skill.interface'
import { getAuthUser } from '../../../lib/services/auth.service';

// Components
import CreateSkillContainer from './create-skill.container';
import { buildCreatePosition } from '../../../lib/services/position.service';
import { buildCreateSkillCategory } from '../../../lib/services/skill-category.service';

const CREATE_SKILL = gql`
  mutation CreateSkill($data: CreateSkillInput!) {
    createSkill(data: $data) {
      ...SkillFields
    }
  }

  ${SKILL_FIELDS}
`;

const CreateSkillGraphQL = () => {
  const user = getAuthUser();

  const [createSkillMutation]  = useMutation(CREATE_SKILL);
  const createSkill = (values: ICreateSkillProps) => createSkillMutation({
    variables: { data: values },
    update: (cache, { data }) => {
      if (data) {
        cache.modify({
          fields: {
            skills: createCacheModifier({
              cache,
              createdDoc: data.createSkill,
              fragment: SKILL_FIELDS,
              fragmentName: 'SkillFields',
              modelName: 'Skill'
            })
          }
        });
      }
    },
    optimisticResponse: {
      __typename: 'Mutation',
      createSkill: {
        __typename: 'Skill',
        ...values
      }
    }
  });


  return <CreateSkillContainer createSkill={createSkill} />;
};

export default CreateSkillGraphQL;
