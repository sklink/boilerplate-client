import ResizeObserver from 'resize-observer-polyfill';
import _ from 'lodash';
import onlineCheck from 'is-online';
import React, { ReactNode, useEffect, useState } from 'react';
import { ApolloProvider, makeVar, useReactiveVar } from '@apollo/client';

import createApolloClient from '../../../lib/createApolloClient';
import AuthApiService from '../../../lib/utils/auth-api.service';
import ErrorPage from '../../_pages/_general/ErrorPage/error-page.container';
import LoadingPage from '../../_pages/_general/LoadingPage/loading-page.container';

interface PersistedApolloProps {
  children: ReactNode;
}

const DENSE_HEIGHT_TRIGGER = 660;
export const isDense = makeVar(document.body.clientHeight < DENSE_HEIGHT_TRIGGER);
export const getDenseStatus = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useReactiveVar(isDense);

// @ts-ignore
const resizeObserver = new ResizeObserver(entries => {
  const isCurrentlyDense = isDense();
  const currHeight = entries[0].target.clientHeight;

  if (isCurrentlyDense && currHeight >= DENSE_HEIGHT_TRIGGER) {
    isDense(false);
  } else if (!isCurrentlyDense && currHeight < DENSE_HEIGHT_TRIGGER) {
    isDense(true);
  }
});

// start observing a DOM node
resizeObserver.observe(document.body)

export const isSyncing = makeVar(false);
export const getSyncing = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useReactiveVar(isSyncing);

export const isOnline = makeVar(true);
export const getOnlineStatus = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useReactiveVar(isOnline);

export const isQueueOpen = makeVar(true);
export const getQueueOpen = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useReactiveVar(isQueueOpen);

let syncTimeout: any;

window.addEventListener('offline', () => {
  isOnline(false)
  isSyncing(false);
});
window.addEventListener('online', () => {
  if (!isOnline()) {
    isSyncing(true);

    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      isSyncing(false);
    }, 3000);
  }

  isOnline(true);
});

setInterval(async () => {
  const nextOnlineStatus = await onlineCheck();

  if (!isOnline() && nextOnlineStatus) {
    isSyncing(true);

    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      isSyncing(false);
    }, 5000);
  }

  isOnline(nextOnlineStatus);
}, 10 * 1000);

const PersistedApolloProvider: React.FC<PersistedApolloProps> = ({ children }) => {
  const online = getOnlineStatus();
  const [isBootstrapped, setBootstrapped] = useState(false);
  const [error, setError] = useState(false);
  const [client, setClient] = useState();
  const [queueLink, setQueueLink] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    AuthApiService.refreshToken()
      .then(result => createApolloClient(_.get(result, 'user')))
      .then(({ client, queueLink }) => {
        setBootstrapped(true);
        setClient(client);
        setQueueLink(queueLink);
      })
      .catch(err => {
        setError(true);
      });
  }, []);

  const hasQueueLink = Boolean(queueLink);
  useEffect(() => {
    if (queueLink) {
      if (online) {
        queueLink?.open();
        isQueueOpen(true);
      } else {
        queueLink?.close();
        isQueueOpen(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, hasQueueLink]);

  if (error) return <ErrorPage />;

  return isBootstrapped && client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <LoadingPage />
  );
};

export default PersistedApolloProvider;
