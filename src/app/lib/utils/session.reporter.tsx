import * as Sentry from '@sentry/react';
import LogRocket from 'logrocket';

import { ENABLE_CHAT, ENABLE_LOGROCKET, ENABLE_SENTRY, HAS_PHI } from '../../../_configuration';
import ChatWoot from './chat.service';

interface SessionInfo {
  _id: string;
  email: string;
  name: string;
}

class SessionReporter {
  static identify(user: SessionInfo, traits: object = {}) {
    if (ENABLE_SENTRY && !HAS_PHI) {
      Sentry.setUser({ email: user.email });
    }

    if (ENABLE_LOGROCKET && !HAS_PHI) {
      LogRocket.identify(user._id, {
        ...traits,
        name: user.name,
        email: user.email,
      });
    }

    if (ENABLE_CHAT && !HAS_PHI) {
      ChatWoot.setUser(user._id, {
        email: user.email,
        name: user.name
      });
    }
  }

  static logout() {
    if (ENABLE_SENTRY) {
      Sentry.configureScope(scope => scope.setUser(null));
    }

    if (ENABLE_CHAT) {
      ChatWoot.clearUser();
    }
  }
}

export default SessionReporter;
