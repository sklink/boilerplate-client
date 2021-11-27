import React from 'react';
import { Route } from 'react-router-dom';

import { APP_TITLE, buildPageTitle, HAS_USERS, OPEN_REGISTRATION, ROUTE_PATHS, ROUTE_ROLES } from './_configuration';

// Components
import RouteByRole from './app/domains/_core/RouteByRole/route-by-role.component';
import ManageUsersPage from './app/domains/user/pages/ManageUsersPage/manage-users.page';
import LoginPage from './app/domains/_auth/pages/LoginPage/login.page';
import ForgotPasswordPage from './app/domains/_auth/pages/ForgotPasswordPage/forgot-password.page';
import ResetPasswordPage from './app/domains/_auth/pages/ResetPasswordPage/reset-password.page';
import SettingsPage from './app/domains/_auth/pages/SettingsPage/settings.page';
import AcceptInvitePage from './app/domains/_auth/pages/AcceptInvitePage/accept-invite.page';
import RegisterPageContainer from './app/domains/_auth/pages/RegisterPage/register.page';
import VerifyAccountPage from './app/domains/_auth/pages/VerifyAccountPage/verify-account.page';
import NotFoundPage from './app/domains/_pages/_general/NotFoundPage/not-found-page.component';
import DashboardPage from './app/domains/_pages/DashboardPage/dashboard.page';

// App Specific Routes
// ====
export const ROUTES = [
  <RouteByRole exact title={APP_TITLE} path={ROUTE_PATHS.HOME} componentsByRole={{
    [ROUTE_ROLES.AUTHORIZED]: DashboardPage,
  }} />,
];


// Boilerplate Routes
// ====
ROUTES.push(<RouteByRole title={buildPageTitle('Settings')} exact path={ROUTE_PATHS.SETTINGS} chat componentsByRole={{
  [ROUTE_ROLES.AUTHORIZED]: SettingsPage
}} />);

if (HAS_USERS) {
  ROUTES.push(<RouteByRole key="verify" title={buildPageTitle('Verify Account')} chat exact path="/verify" component={VerifyAccountPage} />);
  ROUTES.push(<RouteByRole exact title={buildPageTitle('Reset Password')} path="/password-reset" component={ResetPasswordPage} />);
  ROUTES.push(<RouteByRole title={buildPageTitle('Forgot Password')} exact path="/forgot-password" componentsByRole={{
    [ROUTE_ROLES.PUBLIC]: ForgotPasswordPage
  }} />);

  ROUTES.push(<RouteByRole exact title={buildPageTitle('Sign In')} path={ROUTE_PATHS.LOGIN} componentsByRole={{
    [ROUTE_ROLES.PUBLIC]: LoginPage
  }} />);

  ROUTES.push(<RouteByRole exact title={buildPageTitle('Manage Users')} path={ROUTE_PATHS.MANAGE_USERS} componentsByRole={{
    [ROUTE_ROLES.USER_MANAGEMENT]: ManageUsersPage
  }} />);

  if (OPEN_REGISTRATION) {
    ROUTES.push(<RouteByRole exact title={buildPageTitle('Join')} path={ROUTE_PATHS.ACCEPT_INVITE} component={AcceptInvitePage} />);
    ROUTES.push(<RouteByRole exact title={buildPageTitle('Register')} path={ROUTE_PATHS.REGISTER} component={RegisterPageContainer} />);
  }
}

ROUTES.push(<Route title={buildPageTitle('Page Not Found')} component={NotFoundPage} />);
