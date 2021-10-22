import _ from 'lodash';
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';

// Components
import PracticePlanListContainer from './practice-plan-list.container';
import { buildRemovePracticePlan, buildRestorePracticePlan } from '../../../lib/services/practice-plan.service';

// Queries
const GET_PRACTICE_PLAN_LIST = gql`
  query GetPracticePlanList($companyId: ID!, $includeGlobal: Boolean) {
    practicePlans(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
      drills {
        name
      }
      companyId
    }
    countArchivedPracticePlans(companyId: $companyId)
  }
`;

const GET_ARCHIVED_PRACTICE_PLAN_LIST = gql`
  query GetArchivedPracticePlanList($companyId: ID!) {
    archivedPracticePlans(companyId: $companyId) {
      _id
      name
      drills {
        name
      }
    }
  }
`;

const PracticePlanListData = () => {
  const [viewingArchived, setViewingArchived] = useState(false);
  const user = getAuthUser();
  const { removePracticePlan } = buildRemovePracticePlan();
  const { restorePracticePlan } = buildRestorePracticePlan();

  const { data: planData, loading: plansLoading, error: plansError } = useQuery(GET_PRACTICE_PLAN_LIST, {
    skip: !user || viewingArchived,
    variables: { companyId: user?.settings.activeCompanyId, includeGlobal: user?.settings.includeGlobal },
    fetchPolicy: 'cache-and-network'
  });

  const { data: archivedData, loading: archivedLoading, error: archivedError } = useQuery(GET_ARCHIVED_PRACTICE_PLAN_LIST, {
    skip: !user || !viewingArchived,
    variables: { companyId: user?.settings.activeCompanyId },
    fetchPolicy: 'cache-and-network'
  });

  let plans: IPracticePlan[] = [];
  if (viewingArchived) {
    plans = (archivedData && archivedData.archivedPracticePlans) || [];
  } else {
    plans = (planData && planData.practicePlans) || [];
  }

  const countArchivedPracticePlans = (planData && _.isNumber(planData.countArchivedPracticePlans)) ? planData.countArchivedPracticePlans : 0;
  const loading = !plans.length && (plansLoading || archivedLoading);

  return <PracticePlanListContainer
    practicePlans={plans}
    fetchError={Boolean(plansError) || Boolean(archivedError)}
    removePlan={removePracticePlan}
    restorePlan={restorePracticePlan}
    countArchivedPlans={countArchivedPracticePlans}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    loading={loading}
  />
};

export default PracticePlanListData;
