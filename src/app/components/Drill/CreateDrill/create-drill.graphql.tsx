import _ from 'lodash';
import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Data
import { createCacheModifier } from '../../../lib/cache/basic.cache';
import { DRILL_FIELDS } from '../../../lib/queries/drill.queries';
import { ICreateDrillProps } from './create-drill.interface'
import { getAuthUser } from '../../../lib/services/auth.service';

// Components
import CreateDrillContainer from './create-drill.container';
import { buildCreatePosition } from '../../../lib/services/position.service';

const GET_CREATE_DRILL = gql`
  query GetCreateDrill($companyId: ID!, $includeGlobal: Boolean) {
    positions(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
    skills(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
  }
`;

const CREATE_DRILL = gql`
  mutation CreateDrill($data: CreateDrillInput!) {
    createDrill(data: $data) {
      ...DrillFields
    }
  }

  ${DRILL_FIELDS}
`;

const UPDATE_DRILL = gql`
  mutation UpdateDrill($_id: ID!, $data: UpdateDrillInput!) {
    updateDrill(_id: $_id, data: $data) {
      ...DrillFields
    }
  }

  ${DRILL_FIELDS}
`;

interface ICreateDrillGraphQL {
  drill?: IDrill;
}

const CreateDrillGraphQL: React.FC<ICreateDrillGraphQL> = ({ drill }) => {
  const user = getAuthUser();
  const { createPosition } = buildCreatePosition();

  const { data, loading, error } = useQuery(GET_CREATE_DRILL, {
    skip: !user,
    variables: {
      companyId: user?.settings.activeCompanyId,
      includeGlobal: user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });

  const skills = (data && data.skills) || [];
  const positions = (data && data.positions) || [];

  const [createDrillMutation]  = useMutation(CREATE_DRILL);
  const [updateDrillMutation] = useMutation(UPDATE_DRILL);
  const createDrill = (values: ICreateDrillProps) => {
    if (drill) {
      return updateDrillMutation({
        variables: { _id: drill._id, data: { ..._.omit(values, 'companyId') } },
        optimisticResponse: {
          updateDrill: {
            __typename: 'Drill',
            ...drill,
            ...data
          }
        }
      })
    }

    return createDrillMutation({
      variables: {data: {...values}},
      update: (cache, {data}) => {
        if (data) {
          cache.modify({
            fields: {
              drills: createCacheModifier({
                cache,
                createdDoc: data.createDrill,
                fragment: DRILL_FIELDS,
                fragmentName: 'DrillFields',
                modelName: 'Drill'
              })
            }
          });
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createDrill: {
          __typename: 'Drill',
          ...data
        }
      }
    });
  }


  return <CreateDrillContainer
    drill={drill}
    user={user}
    createDrill={createDrill}
    createPosition={createPosition}
    positions={positions}
    skills={skills}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default CreateDrillGraphQL;
