import _ from 'lodash';
import { ApolloClient, from } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import { InMemoryCache } from '@apollo/client/cache';
import { RetryLink } from '@apollo/client/link/retry';
import { onError } from '@apollo/client/link/error';
import SerializingLink from 'apollo-link-serialize';
import QueueLink from 'apollo-link-queue';
import { persistCache } from 'apollo3-cache-persist';

import { GRAPHQL_HTTP_URI } from './constants';
import { authUser } from '../domains/_auth/auth.service';
import AuthApiService from './utils/auth-api.service';
import trackerLink from './utils/tracker.link';

let currToken: string | undefined | null;

setInterval(() => {
  AuthApiService.refreshToken()
    .then(result => {
      authUser(_.get(result, 'user'));
    })
}, 15 * 60 * 1000);

async function createApolloClient(currUser: any) {
  if (currUser) {
    authUser(currUser);
  }

  const retryLink = new RetryLink();
  const serializingLink = new SerializingLink();
  const queueLink = new QueueLink();

  const errorLink = onError((e) => {
    // tslint:disable-next-line
    console.log('Caught Apollo Client Error', e);
  });

  const httpLink = createHttpLink({
    uri: GRAPHQL_HTTP_URI,
  });

  // Authentication
  const authLink = setContext((ctx, { headers }) => {
    const nextToken = _.get(authUser(), 'token');

    if (currToken !== nextToken) {
      currToken = nextToken;
    }

    const authorization = currToken ? `Bearer ${nextToken}` : null;

    return { headers: { authorization } };
  });

  const currStorage: any = localStorage;
  const cache = new InMemoryCache();
  await persistCache({ cache, storage: currStorage });

  const link = from([
    errorLink,
    trackerLink(),
    queueLink,
    serializingLink,
    retryLink,
    authLink.concat(httpLink)
  ]);

  const client = new ApolloClient({ cache, link, resolvers: {} });

  if (!currUser) {
    await client.clearStore();

    if (window.location.pathname !== '/') {
      localStorage.setItem('logout', String(Date.now()));
    }
  }

  return { client, queueLink };
};

export default createApolloClient;
