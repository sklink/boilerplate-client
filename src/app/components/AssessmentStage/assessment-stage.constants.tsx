import _ from 'lodash';

import { IFormOption } from '../_core/_ui/forms.component';
import { SESSION_TERM, SESSIONS_TERM } from '../../lib/constants';

export const STAGE_ORDER_BY_OPTIONS = [
  { value: 'CURRENT_RANK', label: 'by current rank, bottom to top' },
  { value: 'CURRENT_EVEN', label: 'by current rank, evenly distributed' },
  { value: 'PREVIOUS_PLACEMENT_RANK', label: 'by previous placement, bottom to top' },
  { value: 'PREVIOUS_PLACEMENT_EVEN', label: 'by previous placement, evenly distributed' },
  { value: 'RANDOM', label: 'randomly' },
];

export const STAGE_ORDER_BY_LABELS: { [key: string]: string } = {
  CURRENT_RANK: 'by current rank, bottom to top',
  CURRENT_EVEN: 'by current rank, evenly distributed',
  PREVIOUS_PLACEMENT_RANK: 'by previous placement, bottom to top',
  PREVIOUS_PLACEMENT_EVEN: 'by previous placement, evenly distributed',
  RANDOM: 'randomly',
};

export const STAGE_ROUTE_BY_ORIGINS = [
  { value: 'FROM_TOP', label: 'from top ranked' },
  { value: 'FROM_BOTTOM', label: 'from bottom ranked' },
  { value: 'FROM_MIDDLE', label: 'from middle ranked' }
];

const STAGE_ROUTE_BY_ORIGINS_BY_VALUE: { [key: string]: IFormOption } = {
  FROM_TOP: {value: 'FROM_TOP', label: 'from top ranked'},
  FROM_BOTTOM: {value: 'FROM_BOTTOM', label: 'from bottom ranked'},
  FROM_MIDDLE: {value: 'FROM_MIDDLE', label: 'from middle ranked'}
};

export const STAGE_ROUTE_BY_DESTINATIONS = [
  { value: 'HOLD', label: `place on hold`},
  { value: 'CONCLUDE', label: 'conclude assessment' }
];

const STAGE_ROUTE_BY_DESTINATIONS_BY_VALUE: { [key: string]: IFormOption } = {
  HOLD: { value: 'HOLD', label: `place on hold`},
  CONCLUDE: { value: 'CONCLUDE', label: 'conclude assessment' }
};

export const buildOrderByOption = (value: string) => {
  if (!value) return STAGE_ORDER_BY_OPTIONS[0];

  return { value, label: STAGE_ORDER_BY_LABELS[value] };
};

export const buildPlayerLimitOptions = (positionOptions: IFormOption[], playerLimits: IPlayerLimit[]) => {
  const options: any[] = [];

  playerLimits.forEach(limit => {
    const positions = limit.positions.map(positionId =>
      _.find(positionOptions, option => option.value === positionId)
    );

    options.push({ positions, limit: limit.limit });
  });

  return options;
};

export const buildRouteOptions = (routes: IPlayerRoute[], positionOptions: IFormOption[]) => {
  const options: any[] = [];

  routes.forEach(route => {
    options.push({
      ...route,
      position: _.find(positionOptions, option => option.value === route.position) || { value: 'ALL', label: 'any' },
      takeFrom: STAGE_ROUTE_BY_ORIGINS_BY_VALUE[route.takeFrom],
      sendType: STAGE_ROUTE_BY_DESTINATIONS_BY_VALUE[route.sendType],
    })
  });

  return options;
}

export const buildOptions = (options: IFormOption[], _ids: string[]) => {
  const selectedOptions: IFormOption[] = [];

  _ids.forEach(_id => {
    const option = _.find(options, option => option.value === _id);

    if (option) selectedOptions.push(option);
  });

  return selectedOptions;
};

export const NOTIFICATION_OPTIONS = [
  { value: '7_DAYS', label: '7 days before' },
  { value: '5_DAYS', label: '5 days before' },
  { value: '3_DAYS', label: '3 days before' },
  { value: '2_DAYS', label: '2 days before' },
  { value: '24_HOURS', label: '24 hours before' },
  { value: '4_HOURS', label: '4 hours before' },
  { value: '2_HOURS', label: '2 hours before' },
];

export const ROUTE_NOTIFICATION_OPTIONS = [
  { value: 'IMMEDIATE', label: 'on route approval' },
  { value: 'ON_NEXT_SESSION', label: `when the next ${SESSION_TERM.toLowerCase()} notification goes out` },
];

export const DEFAULT_GROUP_CONFIG = {
  orderBy: 'RANDOM',
  playerLimits: [],
  manualApproval: true
};

export const DEFAULT_SESSION_CONFIG = {
  drills: [],
  practicePlans: [],
  notifications: [],
  enableNotifications: true
};

export const DEFAULT_ROUTE_CONFIG = {
  routes: [],
  manualApproval: true,
  enableNotifications: true
};

export const DEFAULT_CONFIGS: { [key: string]: any } = {
  GROUP: DEFAULT_GROUP_CONFIG,
  SESSION: DEFAULT_SESSION_CONFIG,
  ROUTE: DEFAULT_ROUTE_CONFIG
};
