import styled from 'styled-components';

import theme, { sectionColor } from '../../../lib/theme';

interface TextProps {
  align?: string;
  large?: boolean;
}

export const Text = styled.p<TextProps>`
  color: rgba(0, 0, 0, 0.56);
  text-align: ${props => props.align || 'inherit'};
  font-size: ${props => !props.large && '16px'}${props => props.large && '20px'};
`;

export const PageTitle = styled.h1`

`;


export const SectionHeading = styled.h3`

`;

export const Bold = styled.span`
  font-weight: 500;
`;

export const FieldName = styled.span`
  font-weight: 500;
  border-radius: 4px;
  background: ${sectionColor};
  padding: 4px 8px;
`;

export const Quote = styled.div`
  border-left: 1px solid #ddd;
  padding-left: ${theme.spacing(2)};
  margin: ${theme.spacing(2)} 0;
`;
