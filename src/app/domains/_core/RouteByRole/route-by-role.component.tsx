import _ from 'lodash';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';

// Data
import { getAuthUser } from '../../_auth/auth.service';
import { APP_TITLE, ROUTE_PATHS, ROUTE_ROLES } from '../../../../_configuration';

// Components
import ErrorPage from '../../_pages/_general/ErrorPage/error-page.container';
import NoCompanyPage from '../../_pages/_general/NoCompanyPage/no-company-page.component';
import { getCurrMember } from '../../member/member.service';
import LoadingPage from '../../_pages/_general/LoadingPage/loading-page.container';

interface RouteByRoleProps {
  componentsByRole?: any;
  component?: any;
  title?: string;
  exact?: boolean;
  path: string;
  activeTab?: string;
  wrapper?: any;
  chat?: boolean;
}

const RoleByRoute: React.FC<RouteByRoleProps> = ({ chat, componentsByRole, component, title, ...rest })  => {
  const user = getAuthUser();
  const { member, loading } = getCurrMember();

  let Component: any;
  if (componentsByRole && user) {
    if (!member && loading) {
      Component = LoadingPage;
    } else if (!_.get(user, 'settings.activeCompanyId')) {
      Component = NoCompanyPage;
    } else if (member) {
      const roleKeys = Object.keys(componentsByRole);
      for (let i = 0; i < roleKeys.length && !Component; i += 1) {
        if (_.includes(member.roles, roleKeys[i])) {
          Component = componentsByRole[roleKeys[i]];
        }
      }

      if (!Component) {
        Component = componentsByRole[ROUTE_ROLES.AUTHORIZED];
      }
    }
  }

  Component = Component || component;

  if (!Component && user)
    return <Route render={() => <Redirect to={ROUTE_PATHS.HOME} />} />;

  Component = Component || componentsByRole[ROUTE_ROLES.PUBLIC];

  if (!Component)
    return <Route render={() => <Redirect to={ROUTE_PATHS.LOGIN} />} />;

  document.title = title || APP_TITLE;

  return (
    <Route
      {...rest}
      render={props => (
        <Sentry.ErrorBoundary fallback={ErrorPage}>
          <Component {...props} />
        </Sentry.ErrorBoundary>
      )}
    />
  );
};

export default RoleByRoute;
