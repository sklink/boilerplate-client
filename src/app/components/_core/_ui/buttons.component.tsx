import styled from 'styled-components';

// Material Ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import theme, { dangerColor, dangerColorLight, warnColor, warnColorLight } from '../../../lib/theme';

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
}))(Button);

export const PrimaryButton = withStyles(theme => ({
  root: {
    background: '#bdd739',
    color: '#fff',

    '&:hover': {
      background: '#adb729'
    }
  }
}))(BaseButton);

export const PrimaryWhiteButton = withStyles(theme => ({
  root: {
    background: '#fff',
    color: 'rgba(0, 0, 0, 0.82)',

    '&:hover': {
      background: '#eaecee'
    }
  }
}))(BaseButton);

export const DangerButton = withStyles(theme => ({
  root: {
    background: dangerColor,
    color: '#fff',

    '&:hover': {
      background: dangerColorLight
    }
  }
}))(BaseButton);

export const WarnButton = withStyles(theme => ({
  root: {
    background: warnColor,
    color: '#fff',

    '&:hover': {
      background: warnColorLight
    }
  }
}))(BaseButton);

export const SecondaryButton = withStyles(theme => ({
  root: {
  }
}))(BaseButton);

export const SecondaryButtonVertical = withStyles(theme => ({
  root: {
    '& .MuiButton-label': {
      flexDirection: 'column'
    }
  }
}))(SecondaryButton);

export const OutlineButton = withStyles(theme => ({
  root: {
    borderRadius: '8px',
    border: '2px solid #bdd739',
  },
}))(BaseButton);

export const OutlineButtonVertical = withStyles(theme => ({
  root: {
    '& .MuiButton-label': {
      flexDirection: 'column'
    },
    '&:hover': {
      background: '#fff',
      cursor: 'default'
    }
  },
}))(OutlineButton);

interface ICardButton {
  active?: boolean;
}

export const CardButton = styled.div<ICardButton>`
  background: ${props => props.active ? '#fff' : '#fff'};
  border: 1px solid #ddd;
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

export const CardButtonIcon = styled.div`
  padding: 16px 0 0;

  & svg {
    font-size: 64px;
  }
`;

export const ButtonRow = styled.div`
  display: flex;

  & > button, & > div {
    margin: 0 ${theme.spacing(1)}px;
  }

  & > button:first-child, & > div:first-child {
    margin-left: 0;
  }

  & > button:last-child, & > div:last-child {
    margin-right: 0;
  }
`;
