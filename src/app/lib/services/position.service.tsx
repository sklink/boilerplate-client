import _ from 'lodash';

import { createCacheModifier } from '../cache/basic.cache';
import { useMutation, useQuery } from '@apollo/client';

import { CREATE_POSITION, GET_POSITIONS, POSITION_FIELDS } from '../queries/position.queries';
import { getAuthUser } from './auth.service';

export const getPositions = (includeGlobal?: boolean) => {
  const user = getAuthUser();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, loading, error } = useQuery(GET_POSITIONS, {
    skip: !user,
    variables: {
      companyId: user?.settings.activeCompanyId,
      includeGlobal: _.isBoolean(includeGlobal) ? includeGlobal : user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });

  return {
    positions: (data && data.positions) || [],
    loading,
    error
  };
};

export const buildCreatePosition = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation] = useMutation(CREATE_POSITION);

  return {
    createPosition: (name: string) => mutation({
      variables: { data: { name, companyId: user?.settings?.activeCompanyId } },
      update: (cache, {data}) => {
        if (data) {
          cache.modify({
            fields: {
              positions: createCacheModifier({
                cache,
                createdDoc: data.createPosition,
                fragment: POSITION_FIELDS,
                fragmentName: 'PositionFields',
                modelName: 'Position'
              })
            }
          });
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createPosition: {
          __typename: 'Position',
          name,
          companyId: user?.settings?.activeCompanyId
        }
      }
    })
  }
}

