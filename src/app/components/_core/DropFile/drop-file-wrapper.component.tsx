import styled from 'styled-components';
import theme, { borderColor, borderRadius } from '../../../lib/theme';

export const DropFileWrapper = styled.div`
  cursor: pointer;
  border-radius: ${borderRadius};
  border: 2px dashed ${borderColor};
  text-align: center;
  padding: ${theme.spacing(4)};
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;
