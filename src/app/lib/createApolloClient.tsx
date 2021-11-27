import _ from 'lodash';
import { ApolloClient, from, split } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import { InMemoryCache } from '@apollo/client/cache';
import { RetryLink } from '@apollo/client/link/retry';
import { onError } from '@apollo/client/link/error';
import SerializingLink from 'apollo-link-serialize';
import QueueLink from 'apollo-link-queue';
import { persistCache } from 'apollo3-cache-persist';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Data
import {
  ENABLE_OFFLINE_GQL,
  ENABLE_WEBSOCKETS,
  PERSIST_CACHE,
  TOKEN_REFRESH_INTERVAL
} from '../../_configuration';
import { GRAPHQL_HTTP_URI, GRAPHQL_WS_URI } from './_constants';

// Services
import { authUser } from '../domains/_auth/auth.service';
import AuthApiService from './utils/auth-api.service';
import trackerLink from './utils/tracker.link';

let currToken: string | undefined | null;

setInterval(() => {
  AuthApiService.refreshToken()
    .then(result => {
      authUser(_.get(result, 'user'));
    })
}, TOKEN_REFRESH_INTERVAL);

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

  let wsLink: WebSocketLink | undefined;
  if (ENABLE_WEBSOCKETS) {
    wsLink = new WebSocketLink({
      uri: GRAPHQL_WS_URI,
      options: {
        reconnect: true,
        connectionParams: () => ({
          token: _.get(authUser(), 'token'),
        }),
      }
    });
  }

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

  if (PERSIST_CACHE) {
    await persistCache({ cache, storage: currStorage });
  }

  const links = [errorLink];
  if (ENABLE_OFFLINE_GQL) {
    links.push(trackerLink());
  }

  // Handle intermittent network connection drops
  links.push(queueLink);
  links.push(serializingLink);
  links.push(retryLink);

  const requestLink = wsLink
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    )
    : authLink.concat(httpLink);
  links.push(requestLink);

  const link = from(links);
  const client = new ApolloClient({ cache, link, resolvers: {} });

  if (!currUser) {
    await client.clearStore();

    if (window.location.pathname !== '/') {
      localStorage.setItem('logout', String(Date.now()));
    }
  }

  return { client, queueLink };
}

export default createApolloClient;
