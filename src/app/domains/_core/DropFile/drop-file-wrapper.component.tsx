import { styled } from '@mui/material/styles';
import theme, { color, structure } from '../../../lib/_theme';

export const DropFileWrapper = styled('div')`
  cursor: pointer;
  border-radius: ${structure.border.radius};
  border: 2px dashed ${color.border.main};
  text-align: center;
  padding: ${theme.spacing(4)};
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;
