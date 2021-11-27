import _ from 'lodash';
import React from 'react';

import { USE_24_HOUR } from '../../../_configuration';

export const numToAlpha = (num: number) =>
  (num + 9).toString(36).toUpperCase();

export const numToTime = (value: number) => {
  let hours = Math.floor(value / 60);
  let minutes: any = value % 60;
  let suffix = 'AM';

  if (!USE_24_HOUR && hours >= 12) {
    suffix = 'PM';
  }

  if (!USE_24_HOUR && hours > 12) {
    hours = hours % 12;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}${USE_24_HOUR ? '' : ` ${suffix}`}`;
};

export const timeToNum = (time: string) => {
  let currTime = time;

  const ampm = _.takeRight(currTime, 2).join('');
  currTime = _.trimEnd(currTime, ampm);
  currTime = _.trim(currTime, ' ');

  const hours = currTime.split(':').shift();
  const minutes = currTime.split(':').pop();

  let sum = (Number(hours) % 12) * 60 + Number(minutes);
  if (ampm === 'PM') {
    sum += 12 * 60;
  }

  return sum;
};

export const listToSentence = (list: string[]) => {
  if (list.length === 1) {
    return list[0];
  }

  if (list.length === 2) {
    return `${list[0]} and ${list[1]}`;
  }

  return `${list.slice(0, -1).join(', ')}, and ${list.slice(-1)[0]}`;
};


