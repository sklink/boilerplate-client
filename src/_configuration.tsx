export const APP_TITLE = process.env.APP_TITLE;
export const buildPageTitle = (title: string) => `${APP_TITLE} - ${title}`;
export const SUPPORT_EMAIL = 'contact@mattdoak.ca';

export const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const ENABLE_DEKSTOP = true;
export const ENABLE_MOBILE = true;

export const ENABLE_CHAT_SUPPORT = false;
export const ENABLE_SENTRY = true;
export const ENABLE_LOGROCKET = true;
export const ENABLE_CHAT = true;
export const HAS_PHI = false;
export const ENABLE_OFFLINE_GQL = !HAS_PHI && true;
export const PERSIST_CACHE = !HAS_PHI && true;
export const ENABLE_WEBSOCKETS = false;

export const HAS_USERS = true;
export const OPEN_REGISTRATION = HAS_USERS && true;

export const HAS_USER_MODES = false;
export const DEFAULT_USER_MODE = 'USER';

export const HAS_COMPANIES = true;
export const COMPANY_TERM = 'company';
export const COMPANIES_TERM = 'companies';

export const HAS_PROJECTS = true;
export const PROJECT_TERM = 'project';
export const PROJECTS_TERM = 'projects';

export const USE_24_HOUR = false;

export const ROLES: { [key: string]: string } = {
  // Add application roles here:
  // (e.g. ROLE: 'Role Label')
};

export const ROUTE_PATHS = {
  // Add application routes here

  // Boilerplate routes, change as necessary to move endpoints
  HOME: '/',
  LOGIN: '/login',
  SETTINGS: '/settings',
  MANAGE_USERS: '/users',
  ACCEPT_INVITE: '/join',
  REGISTER: '/register'
};

// Boilerplate
// ====
if (HAS_USERS) {
  ROLES.USER_MANAGEMENT = 'User Management';
}

export const ROUTE_ROLES: { [key: string]: string } = {
  PUBLIC: 'PUBLIC',
  AUTHORIZED: 'AUTHORIZED',
  ...ROLES
};
