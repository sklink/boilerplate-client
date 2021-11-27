import { styled } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import { FormHelperText as MuiFormHelperText } from '@mui/material';
import theme, { color } from '../../../lib/_theme';

export interface IFormOption {
  label: string;
  value: string;
}

interface IFormInput {
  light?: boolean;
  fullWidth?: boolean;
  ref?: any;
}

export const FormInput = styled('input')<IFormInput>`
  background: ${props => props.light ? color.input.light : color.input.main};
  border: 1px solid ${color.border.main};
  border-radius: 4px;
  padding: 8px;
  width: ${props => props.fullWidth ? '100%' : (props.width || 'auto')};

  &:focus {
    outline-color: ${theme.palette.primary.light};
  }
`;

export const FormLabel = styled('label')`
  margin-bottom: 8px;
  font-weight: 500;
`;

export const FormHelperText = withStyles({
  root: {
    fontFamily: 'Quicksand, sans-serif;',
    fontWeight: 700,
    '& .success': {
      color: `${theme.palette.success.main} !important`
    },
    margin: '4px 0 0'
  },
  error: {
    color: `${theme.palette.error.main} !important`,
  }
})(MuiFormHelperText);

