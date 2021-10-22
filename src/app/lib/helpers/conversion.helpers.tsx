import _ from 'lodash';

import { USE_24_HOUR } from '../constants';
import React from 'react';

export const numToAlpha = (num: number) =>
  (num + 9).toString(36).toUpperCase();

export const toPercent = (value: number) =>
  `${Math.round(value * 100 * 100) / 100}%`;

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

export const toListSentence = (list: string[]) => {
  let result = '';

  if (list.length === 2) return `${list[0]} and ${list[1]}`;

  list.forEach((item, index) => {
    result = `${result}${item}`;

    if (index <= list.length - 3) {
      result = `${result}, `;
    } else if (index === list.length - 2) {
      result = `${result}, and `;
    }
  });

  return result;
};

export const toScore = (value: string) => {
  return Number(value).toFixed(4);
}

export const numToTimeResult = (time: number) => {
  const minutes = getMinutes(time);

  if (minutes > 0) {
    return `${minutes}m ${getSeconds(time)}.${getHundredthSeconds(time)}s`;
  } else {
    return `${getSeconds(time)}.${getHundredthSeconds(time)}s`;
  }
}

export const getMinutes = (time: number) => Math.floor(time / 60000) % 60

export const getSeconds = (time: number) => Math.floor(time / 1000) % 60;

export const getHundredthSeconds = (time: number) => formatTime(
  Math.floor(time / 10) % 100
);

export const formatTime = (time: number) => {
  return time < 10 ? `0${time}` : time.toString();
}

export const toWeighted = (weightedScore?: string) => {
  let result = '-';

  if (weightedScore && weightedScore !== '-') {
    result = toScore(weightedScore);
  }

  return result;
}


