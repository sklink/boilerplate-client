import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc)
dayjs.extend(timezone)

export const TIMEZONE_NAMES = [
  "Canada/Atlantic",
  "Canada/Central",
  "Canada/Eastern",
  "Canada/Mountain",
  "Canada/Newfoundland",
  "Canada/Pacific",
  "Canada/Saskatchewan",
  "Canada/Yukon",
];

export const GUESSED_TIMEZONE = dayjs.tz.guess();

if (!_.includes(TIMEZONE_NAMES, GUESSED_TIMEZONE)) {
  TIMEZONE_NAMES.unshift(GUESSED_TIMEZONE);
}

export const TIMEZONE_NAME_OPTIONS = TIMEZONE_NAMES.map(name => ({ value: name, label: name }));
