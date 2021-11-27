import _ from 'lodash';
import { ApolloLink, makeVar, Operation, useReactiveVar } from '@apollo/client';
import uuidv4 from 'uuid/v4';

const STORAGE_REF = 'max_TrackedQueries';
let currentTrackedQueries: ITrackedQuery[] = [];

try {
  currentTrackedQueries = JSON.parse(localStorage.getItem(STORAGE_REF) || '').queries;
} catch(e) {
  currentTrackedQueries = [];
}

export const trackedQueries = makeVar<ITrackedQuery[]>(currentTrackedQueries);
export const getTrackedQueries = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useReactiveVar(trackedQueries);
};

export const removeTrackedQuery = (id: string) => {
  const nextTrackedQueries = [...trackedQueries()];
  _.remove(nextTrackedQueries, query => query.id);

  trackedQueries(nextTrackedQueries);
  localStorage.setItem(STORAGE_REF, JSON.stringify({ queries: nextTrackedQueries }));
};

export const addTrackedQuery = (query: ITrackedQuery) => {
  const nextTrackedQueries = [...trackedQueries(), query];

  trackedQueries(nextTrackedQueries);
  localStorage.setItem(STORAGE_REF, JSON.stringify({ queries: nextTrackedQueries }));
};

const createTrackerLink = () =>
  new ApolloLink((operation: Operation, forward) => {
    if (forward === undefined) {
      return null;
    }

    const name: string = operation.operationName;
    const queryJSON: string = JSON.stringify(operation.query);
    const variablesJSON: string = JSON.stringify(operation.variables);
    const context = operation.getContext();
    const contextJSON = JSON.stringify({}); // JSON.stringify(context);
    const id = uuidv4();

    if (context.tracked !== undefined) {
      const trackedQuery: ITrackedQuery = {
        contextJSON,
        id,
        name,
        queryJSON,
        variablesJSON,
      };

      addTrackedQuery(trackedQuery);
    }

    return forward(operation).map(data => {
      if (context.tracked !== undefined) {
        removeTrackedQuery(id);
      }

      return data;
    });
  });

export default createTrackerLink;
