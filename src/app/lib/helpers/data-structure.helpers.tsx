import _ from 'lodash';

export const toHash = (items: any[], key: string, value: any) => {
  const hash: { [key: string]: any } = {};

  items.forEach(item => {
    if (item && item[key]) {
      hash[String(item[key].toLowerCase())] = item[value];
    }
  });

  return hash;
};

export const replaceKeyWithID = (
  items: any[],
  idHash: { [key: string]: any },
  itemSearchKey: string,
  itemReplacementKey?: string
) => {
  const missingValues: string[] = [];

  items.forEach(item => {
    if (item[itemSearchKey]) {
      const value = item[itemSearchKey].trim();

      if (idHash[value.toLowerCase()]) {
        item[itemReplacementKey || itemSearchKey] = idHash[value.toLowerCase()];

        if (itemReplacementKey) {
          delete item[itemSearchKey];
        }
      } else {
        missingValues.push(value);
      }
    }
  });

  return _.uniq(missingValues);
};

export const toggleListItem = (list: string[], item: string) => {
  let nextList = [...list];

  if (_.includes(nextList, item)) {
    nextList = _.filter(nextList, currType => currType !== item);
  } else {
    nextList = [...nextList, item];
  }

  return nextList
}
