import React, { ReactNode, useEffect, useState } from 'react';
import { makeVar, useApolloClient, useReactiveVar } from '@apollo/client';

import { removeTrackedQuery, trackedQueries } from '../../../lib/utils/tracker.link';
import { UPDATE_HANDLERS } from '../../../lib/services/update-handler.service';

import LoadingPage from '../../_pages/_general/LoadingPage/loading-page.container';
import { getQueueOpen, isSyncing } from '../PersistGateContainer/persist-gate.container';

interface IOfflineHydrator {
  children: ReactNode;
}

let timeout: any;

const OfflineHydrator: React.FC<IOfflineHydrator> = ({ children }) => {
  const client = useApolloClient();
  const isQueueOpen = getQueueOpen();
  const [isLoaded, setLoaded] = useState(false);

  console.log('isQueueOpen', isQueueOpen)
  useEffect(() => {
    console.log('running...');
    const promises: Array<Promise<any>> = [];

    trackedQueries().forEach(trackedQuery => {
      const context = JSON.parse(trackedQuery.contextJSON);
      const query = JSON.parse(trackedQuery.queryJSON);
      const variables = JSON.parse(trackedQuery.variablesJSON);

      promises.push(
        client.mutate({
          context,
          mutation: query,
          optimisticResponse: context.optimisticResponse,
          update: UPDATE_HANDLERS[trackedQuery.name],
          variables
        })
      );

      removeTrackedQuery(trackedQuery.id);
    });

    try {
      if (promises.length) isSyncing(true);
      Promise.all(promises)
        .then(() => {
          if (promises.length) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
              isSyncing(false);
            }, 3000);
          }
        });
    } catch(e) {
      // ALLOW TRACKED QUERIES TO FAIL
      console.error('Offline mutation hydration failed...', e);
    }

    setLoaded(true);
  }, [isQueueOpen]);

  if (!isLoaded) return <LoadingPage />;

  return <>{children}</>;
};

export default OfflineHydrator;
