import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Data
import { createCacheModifier } from '../../../lib/cache/basic.cache';
import { PRACTICE_PLAN_FIELDS } from '../../../lib/queries/practice-plan.queries';
import { ICreatePracticePlanProps } from './create-practice-plan.interface'
import { getAuthUser } from '../../../lib/services/auth.service';

// Components
import CreatePracticePlanContainer from './create-practice-plan.container';

const GET_CREATE_PRACTICE_PLAN = gql`
  query GetCreatePracticePlan($companyId: ID!, $includeGlobal: Boolean) {
    drills(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
  }
`;

const CREATE_PRACTICE_PLAN = gql`
  mutation CreatePracticePlan($data: PracticePlanInput!) {
    createPracticePlan(data: $data) {
      ...PracticePlanFields
    }
  }

  ${PRACTICE_PLAN_FIELDS}
`;

const CreatePracticePlanGraphQL = () => {
  const user = getAuthUser();
  const { data, loading, error } = useQuery(GET_CREATE_PRACTICE_PLAN, {
    skip: !user,
    variables: {
      companyId: user?.settings.activeCompanyId,
      includeGlobal: user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });
  const drills = (data && data.drills) || [];

  const [createPracticePlanMutation]  = useMutation(CREATE_PRACTICE_PLAN);
  const createPracticePlan = (values: ICreatePracticePlanProps) => createPracticePlanMutation({
    variables: { data: values },
    update: (cache, { data }) => {
      if (data) {
        cache.modify({
          fields: {
            practicePlans: createCacheModifier({
              cache,
              createdDoc: data.createPracticePlan,
              fragment: PRACTICE_PLAN_FIELDS,
              fragmentName: 'PracticePlanFields',
              modelName: 'PracticePlan'
            })
          }
        });
      }
    },
    optimisticResponse: {
      __typename: 'Mutation',
      createPracticePlan: {
        __typename: 'PracticePlan',
        ...data
      }
    }
  });


  return <CreatePracticePlanContainer
    createPracticePlan={createPracticePlan}
    drills={drills}
    drillsLoading={loading}
    drillsError={Boolean(error)}
  />;
};

export default CreatePracticePlanGraphQL;
