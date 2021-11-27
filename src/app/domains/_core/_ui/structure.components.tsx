import { styled } from '@mui/material/styles';
import { color } from '../../../lib/_theme';

export const Spacer = styled('div')`
  flex-grow: 1;
`;

interface ISingleFormWrapper {
  width: string;
  padding?: string;
  maxWidth?: string;
}

export const SingleFormWrapper = styled('div')<ISingleFormWrapper>`
  box-sizing: content-box;
  padding: ${props => props.padding || '48px'};
  width: ${props => props.width};
  max-width: ${props => props.maxWidth || 'auto'};

  & > *:first-child, > form:first-child > *:first-child {
    margin-top: 0;
  }

  & > *:last-child, > form:last-child > *:last-child {
    margin-bottom: 0;
  }
`;

interface ISectionWrapper {
  dark?: boolean;
  padding?: string;
}

export const SectionWrapper = styled('div')<ISectionWrapper>`
  background: ${props => props.dark ? color.section.dark : color.section.main};
  border-radius: 8px;
  padding: ${props => props.padding  || '24px'};
  height: 100%;

  & > *:first-child, > form:first-child > *:first-child {
    margin-top: 0;
  }

  & > *:last-child, > form:last-child > *:last-child {
    margin-bottom: 0;
  }
`;

interface ISpacedRow {
  padding?: string;
}

export const SpacedRow = styled('div')<ISpacedRow>`
  display: flex;
  align-items: center;
  padding: ${props => props.padding || '16px'};

  & > * {
    margin-right: 16px;

    &:last-child {
      margin-right: 0;
    }
  }
`;
