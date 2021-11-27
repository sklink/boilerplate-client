import { styled } from '@mui/material/styles';
import { darken } from '@mui/material';

import withStyles from '@mui/styles/withStyles';
import { default as MuiButton }  from '@mui/material/Button';

import theme, { color } from '../../../lib/_theme';

export const BaseButton = withStyles(theme => ({
  root: {
    fontSize: '16px',
    textTransform: 'none',
    padding: '8px 16px',
    fontWeight: 500,
    fontFamily: 'Quicksand, sans-serif;',
  },
  sizeSmall: {
    padding: '4px 8px'
  }
}))(MuiButton);

interface IColoredButton extends React.HTMLAttributes<HTMLButtonElement> {
  bg?: string;
  isVertical?: boolean;
}

export const Button = styled(BaseButton)<IColoredButton>(({ bg = 'white', isVertical, theme }) => ({
  background: bg,
  color: theme.palette.getContrastText(bg),

  '&:hover': {
    background: darken(bg, 0.2)
  },

  '& .MuiButton-label': {
    flexDirection: isVertical ? 'column' : 'row',
  }
}));

interface ICardButton {
  active?: boolean;
}

export const CardButton = styled('div')<ICardButton>`
  background: ${props => props.active ? theme.palette.common.white : darken(theme.palette.common.white, 0.2)};
  border: 1px solid ${color.border.main};
  border-radius: 4px;
  cursor: pointer;
  padding: 16px;
  text-align: center;
  align-content: center;
  box-shadow: ${props => props.active ? '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12) !important' : 'none'};
  transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12);
  }
`;

export const CardButtonIcon = styled('div')`
  padding: 16px 0 0;

  & svg {
    font-size: 64px;
  }
`;
