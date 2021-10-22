import { IFormOption } from '../_ui/forms.component';

export const STEPS = {
  INSTRUCTIONS: 1,
  PROCESSING_STATUS: 2,
  HEADER_CHECK: 3,
  COLUMN_MATCHING: 4,
  DATA_REVIEW: 5
};

export const FORMAT_OPTIONS: { [key: string]: IFormOption[] } = {
  DATE: [
    { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }
  ]
}
