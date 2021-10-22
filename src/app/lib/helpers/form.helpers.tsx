import _ from 'lodash';

// Boilerplate
// ====

/**
 * Exchanges default values from an object with values in a new object
 *
 * @param defaults - { key: value } object used to initialize form values for "create" form actions
 * @param currDoc - document to replace default values for "edit" form actions
 */
export const buildInitialFormValues = (defaults: { [key: string]: any }, currDoc: object) => {
  const result: { [key: string]: any } = {};

  _.each(defaults, (value, key) => {
    result[key] = _.get(currDoc, key, value);
  });

  return result;
};

/**
 * Convert config constant of format { key: label } into options using
 * @param keyValueObj - Object formatted { key: label }
 */
export const objToSelectOptions = (keyValueObj: { [key: string]: string }) =>
  _.map(keyValueObj, (value, key) => ({ value: key, label: value }));

/**
 * Convert config constant of format { key: label } into options using
 * @param arr - Array of objects to be converted into select options
 * @param valueKey - Key within the objects to use as the value prop
 * @param labelKey - Key within the objects to use as the
 */
export const arrToSelectOptions = (arr: { [key: string]: string }[], valueKey: string, labelKey: string) =>
  _.map(arr, item => ({ value: item[valueKey], label: item[labelKey] }));


// Application
// ====

// NOTE: write your own form helpers here
