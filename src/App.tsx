import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ThemeProvider } from '@material-ui/core/styles';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { IntlProvider } from 'react-intl';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './theme/global.css';
import theme, { backgroundColor } from './app/lib/theme';

// Components
import { APP_TITLE, HAS_USERS, OPEN_REGISTRATION, ROUTE_ROLES } from './_configuration';
import PersistedApolloProvider from './app/components/_core/PersistGateContainer/persist-gate.container';
import RouteByRole from './app/components/_core/RouteByRole/route-by-role.component';
import LoginPage from './app/components/_pages/_auth/LoginPage/login.page';
import NotFoundPage from './app/components/_pages/_boilerplate/NotFoundPage/not-found-page.component';
import ResetPasswordPage from './app/components/_pages/_auth/ResetPasswordPage/reset-password.page';
import ForgotPasswordPage from './app/components/_pages/_auth/ForgotPasswordPage/forgot-password.page';
import SettingsPage from './app/components/_pages/_boilerplate/SettingsPage/settings.page';
import DashboardPage from './app/components/_pages/DashboardPage/dashboard.page';
import ManageUsersPage from './app/components/_pages/ManageUsersPage/manage-users.page';
import VerifyAccountPage from './app/components/_pages/_auth/VerifyAccountPage/verify-account.page';
import { ROUTES } from './_routes';
import UpcomingAssessmentSessionsPage
  from './app/components/_pages/UpcomingAssessmentSessions/upcoming-assessment-sessions.page';
import RegisterPageContainer from './app/components/_pages/_auth/RegisterPage/register.page';
import AcceptInvitePage from './app/components/_pages/_auth/AcceptInvitePage/accept-invite.page';
import OfflineHydrator from './app/components/_core/OfflineHandler/offline-handler.container';

if (process.env.REACT_APP_SENTRY_ENV && process.env.REACT_APP_SENTRY_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY,
    environment: process.env.REACT_APP_SENTRY_ENV,
    integrations: [
      new Integrations.BrowserTracing()
    ],
    tracesSampleRate: process.env.REACT_APP_SENTRY_ENV === 'production' ? 0.1 : 1.0
  });
}

const App: React.FC = () => (
  <PersistedApolloProvider>
    <OfflineHydrator>
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en">
          <IonApp style={{ background: backgroundColor }}>
            <IonReactRouter>
              <Switch>
                {ROUTES}
                <RouteByRole exact title={APP_TITLE} path="/" componentsByRole={{
                  [ROUTE_ROLES.REPORTS]: DashboardPage,
                  [ROUTE_ROLES.CONFIGURATION]: DashboardPage,
                  [ROUTE_ROLES.CHECK_IN]: UpcomingAssessmentSessionsPage,
                  [ROUTE_ROLES.SCORING]: UpcomingAssessmentSessionsPage,
                  [ROUTE_ROLES.USER_MANAGEMENT]: ManageUsersPage,
                  [ROUTE_ROLES.AUTHORIZED]: DashboardPage
                }} />
                {HAS_USERS && <RouteByRole exact title={`${APP_TITLE} - Sign In`} path="/login" componentsByRole={{
                  [ROUTE_ROLES.PUBLIC]: LoginPage
                }} />}
                {HAS_USERS && <RouteByRole title={`${APP_TITLE} - Forgot Password`} exact path="/forgot-password" componentsByRole={{
                  [ROUTE_ROLES.PUBLIC]: ForgotPasswordPage
                }} />}
                {HAS_USERS && <RouteByRole exact title={`${APP_TITLE} - Reset Password`} path="/password-reset" component={ResetPasswordPage} />}
                {HAS_USERS && <RouteByRole exact title={`${APP_TITLE} - Manage Users`} path="/users" componentsByRole={{
                  [ROUTE_ROLES.USER_MANAGEMENT]: ManageUsersPage
                }} />}
                <RouteByRole title={`${APP_TITLE} - Settings`} exact path="/settings" chat componentsByRole={{
                  [ROUTE_ROLES.AUTHORIZED]: SettingsPage
                }} />
                {OPEN_REGISTRATION && <RouteByRole exact title={`${APP_TITLE}  - Join`} path="/join" component={AcceptInvitePage} />}
                {OPEN_REGISTRATION && <RouteByRole exact title={`${APP_TITLE}  - Register`} path="/register" component={RegisterPageContainer} />}
                {HAS_USERS && <RouteByRole key="verify" title={`Verify Account - ${APP_TITLE}`} chat exact path="/verify" component={VerifyAccountPage} />}
                <Route title={`${APP_TITLE} - Page Not Found`} component={NotFoundPage} />
              </Switch>
            </IonReactRouter>
          </IonApp>
        </IntlProvider>
      </ThemeProvider>
    </OfflineHydrator>
  </PersistedApolloProvider>
);

export default App;
