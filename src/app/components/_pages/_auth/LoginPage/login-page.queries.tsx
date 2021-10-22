import { makeVar, useReactiveVar } from '@apollo/client';

export const loginError = makeVar<string | undefined>(undefined);
export const getLoginError = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useReactiveVar(loginError);
