import { useApolloClient, useMutation, makeVar, useReactiveVar } from '@apollo/client';
import { useHistory } from 'react-router-dom';

// Data
import { DEFAULT_USER_MODE, HAS_USER_MODES } from '../../../_configuration';
import storage from '../../lib/utils/storage';
import SessionReporter from '../../lib/utils/session.reporter';

// Queries
import { LOGOUT } from './auth.queries';

export const authUser = makeVar<IUser | null>(null);
export const getAuthUser = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useReactiveVar(authUser);
}

const userMode = makeVar(storage.getItem('lth_userMode') || DEFAULT_USER_MODE);
export const setUserMode = (mode: string) => {
  storage.setItem('lth_userMode', mode);
  userMode(mode);
};
export const getUserMode = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useReactiveVar(userMode);
}

export const buildSetAuthUser = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const client = useApolloClient();

  return (user: any, currUserMode?: string, redirect?: string) =>
    client.clearStore()
      .then(() => {
        authUser(user);

        if (HAS_USER_MODES) {
          setUserMode(currUserMode || DEFAULT_USER_MODE);
        }
      })
      .then(() => {
        SessionReporter.identify({
          _id: user._id,
          name: user.name,
          email: user.email
        });

        if (redirect) {
          window.location.href = redirect;
        }
      });
};

export const buildSignOut = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const history = useHistory();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const client = useApolloClient();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [logout] = useMutation(LOGOUT);

  return (redirect?: boolean) => logout()
    .then(() => {
      authUser(null);
      SessionReporter.logout();
    })
    .then(() => client.clearStore())
    .then(() => {
      localStorage.setItem('logout', String(Date.now()));
      if (redirect) history.push('/');
    });
};

function syncLogout(event: StorageEvent) {
  if (event.key === 'logout') {
    window.location.href = '/';
  }
}

window.removeEventListener('storage', syncLogout);
window.addEventListener('storage', syncLogout);
