export const APP_TITLE = 'Max Analytics';
export const SUPPORT_EMAIL = 'support@maxanalytics.ca';

export const ENABLE_DEKSTOP = true;
export const ENABLE_MOBILE = true;

export const ENABLE_SENTRY = true;
export const ENABLE_LOGROCKET = true;
export const ENABLE_CHAT = true;
export const HAS_PHI = false;

export const HAS_USERS = true;
export const OPEN_REGISTRATION = HAS_USERS && true;

export const HAS_USER_MODES = false;
export const DEFAULT_USER_MODE = 'USER';

export const HAS_COMPANIES = true;
export const COMPANY_TERM = 'association';

export const HAS_PROJECTS = true;
export const PROJECT_TERM = 'assessment';

export const ROLES = {
  CHECK_IN: 'CHECK_IN',
  SCORING: 'SCORING',
  REPORTS: 'REPORTS',
  CONFIGURATION: 'CONFIGURATION',
  USER_MANAGEMENT: 'USER_MANAGEMENT'
};

export const ROLE_LABELS: { [key: string]: string } = {
  CHECK_IN: 'Check-In',
  SCORING: 'Scoring',
  REPORTS: 'Reports',
  CONFIGURATION: 'Configuration',
  USER_MANAGEMENT: 'User Management'
};

export const ROUTE_ROLES = {
  PUBLIC: 'PUBLIC',
  AUTHORIZED: 'AUTHORIZED',
  ...ROLES
};

export const HOME_ROUTE = '/';
export const LOGIN_ROUTE = '/login';
