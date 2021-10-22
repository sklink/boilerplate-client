import { useMutation } from '@apollo/client';
import { CREATE_SKILL_CATEGORY, SKILL_CATEGORY_FIELDS } from '../queries/skill-category.queries';
import { getAuthUser } from './auth.service';
import { createCacheModifier } from '../cache/basic.cache';
import { nanoid } from 'nanoid';

export const buildCreateSkillCategory = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(CREATE_SKILL_CATEGORY);

  return {
    ...rest,
    createSkillCategory: (name: string) =>
      mutation({
        variables: { data: { name, companyId: user?.isAdmin ? undefined : user?.settings.activeCompanyId } },
        update: (cache, {data}) => {
          if (data) {
            cache.modify({
              fields: {
                positions: createCacheModifier({
                  cache,
                  createdDoc: data.createSkillCategory,
                  fragment: SKILL_CATEGORY_FIELDS,
                  fragmentName: 'SkillCategoryFields',
                  modelName: 'SkillCategory'
                })
              }
            });
          }
        },
        optimisticResponse: {
          createPosition: {
            __typename: 'SkillCategory',
            _id: nanoid(),
            name
          }
        }
      })
  }
}
