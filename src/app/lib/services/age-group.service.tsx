import _ from 'lodash';
import { useMutation, useQuery } from '@apollo/client';

import { createCacheModifier } from '../cache/basic.cache';
import { CREATE_AGE_GROUP, AGE_GROUP_FIELDS, GET_AGE_GROUPS } from '../queries/age-group.queries';
import { authUser, getAuthUser } from './auth.service';
import { getCurrUser } from './user.service';
import { USER_SETTINGS_FRAGMENT } from '../queries/user.queries';

export const getActiveAgeGroupIds = () => {
  const { user } = getCurrUser();

  return _.get(user, 'settings.activeAgeGroupIds');
};

export const getAgeGroups = () => {
  const user = getAuthUser();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, loading, error } = useQuery(GET_AGE_GROUPS, {
    skip: !user,
    variables: { assessmentId: user?.settings.activeAssessmentId },
    fetchPolicy: 'cache-and-network'
  });

  return {
    ageGroups: (data && data.ageGroups) || [],
    loading,
    error
  };
};

export const buildCreateAgeGroup = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation] = useMutation(CREATE_AGE_GROUP);

  return {
    createAgeGroup: (name: string) => mutation({
      variables: { data: { name, assessmentId: user?.settings?.activeAssessmentId } },
      update: (cache, {data}) => {
        if (data) {
          cache.modify({
            fields: {
              ageGroups: createCacheModifier({
                cache,
                createdDoc: data.createAgeGroup,
                fragment: AGE_GROUP_FIELDS,
                fragmentName: 'AgeGroupFields',
                modelName: 'AgeGroup'
              })
            }
          });

          if (user && data.createAgeGroup._id) {
            authUser({
              ...user,
              settings: {
                ...user?.settings,
                activeAgeGroupIds: [
                  ...user?.settings.activeAgeGroupIds,
                  data.createAgeGroup._id
                ]
              }
            });
          }
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createAgeGroup: {
          __typename: 'AgeGroup',
          name,
          companyId: user?.settings?.activeCompanyId
        }
      }
    })
  }
}

