import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { FormHelperText as MuiFormHelperText } from '@material-ui/core';
import { dangerColor, successColor } from '../../../lib/theme';

export interface IFormOption {
  label: string;
  value: string;
}

interface IFormInput {
  light?: boolean;
  fullWidth?: boolean;
  ref?: any;
}

export const FormInput = styled.input<IFormInput>`
  background: ${props => props.light ? '#fff' : '#fafcfe'};
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  width: ${props => props.fullWidth ? '100%' : (props.width || 'auto')};

  &:focus {
    outline-color: #bdd739;
  }
`;

export const FormLabel = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
`;

export const FormHelperText = withStyles({
  root: {
    fontFamily: 'Quicksand, sans-serif;',
    fontWeight: 700,
    '& .success': {
      color: `${successColor} !important`
    }
  },
  error: {
    color: `${dangerColor} !important`,
  }
})(MuiFormHelperText);

