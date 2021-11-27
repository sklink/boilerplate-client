import { MutationUpdaterFn } from '@apollo/client';

/**
 * UPDATE_HANDLERS
 *
 * Mapping of mutation name to the corresponding cache update handler
 * This is required by the OffineHydrator to update the cache after executing offline mutations
 */

export const UPDATE_HANDLERS: { [key: string]: MutationUpdaterFn<any> } = {

};
