import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';

// Components
import DrillListContainer from './drill-list.container';
import { buildRemoveDrill, buildRestoreDrill } from '../../../lib/services/drill.service';
import _ from 'lodash';

// Queries
const GET_DRILL_LIST = gql`
  query GetDrillList($companyId: ID!, $includeGlobal: Boolean) {
    drills(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
      skillSets {
        positions {
          name
        }
        skills {
          name
        }
      }
      companyId
    }
    countArchivedDrills(companyId: $companyId)
  }
`;

const GET_ARCHIVED_DRILL_LIST = gql`
  query GetArchivedDrillList($companyId: ID!) {
    archivedDrills(companyId: $companyId) {
      _id
      name
      skillSets {
        positions {
          name
        }
        skills {
          name
        }
      }
    }
  }
`;

const DrillListData = () => {
  const [viewingArchived, setViewingArchived] = useState(false);
  const user = getAuthUser();
  const { removeDrill } = buildRemoveDrill();
  const { restoreDrill } = buildRestoreDrill();

  const { data: drillData, loading: drillsLoading, error: drillsError } = useQuery(GET_DRILL_LIST, {
    skip: !user || viewingArchived,
    variables: { companyId: user?.settings?.activeCompanyId, includeGlobal: user?.settings.includeGlobal },
    fetchPolicy: 'cache-and-network'
  });

  const { data: archivedData, loading: archivedLoading, error: archivedError } = useQuery(GET_ARCHIVED_DRILL_LIST, {
    skip: !user || !viewingArchived,
    variables: { companyId: user?.settings?.activeCompanyId },
    fetchPolicy: 'cache-and-network'
  });

  let drills: IDrill[] = [];
  if (viewingArchived) {
    drills = (archivedData && archivedData.archivedDrills) || [];
  } else {
    drills = (drillData && drillData.drills) || [];
  }

  const countArchivedDrills = (drillData && _.isNumber(drillData.countArchivedDrills)) ? drillData.countArchivedDrills : 0;
  const loading = !drills.length && (drillsLoading || archivedLoading);

  return <DrillListContainer
    removeDrill={removeDrill}
    restoreDrill={restoreDrill}
    drills={drills}
    countArchivedDrills={countArchivedDrills}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    loading={loading}
    fetchError={Boolean(drillsError) || Boolean(archivedError)}
  />
};

export default DrillListData;
