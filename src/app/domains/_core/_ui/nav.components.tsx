import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';

// Material UI
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import withStyles from '@mui/styles/withStyles';
import theme, { color } from '../../../lib/_theme';
import { getDenseStatus } from '../PersistGateContainer/persist-gate.container';

interface ICollapsibleNavItem {
  onClick?: Function;
  icon: ReactNode | false | null | undefined;
  isActive?: boolean;
  isCollapsed?: boolean;
  children: ReactNode;
  light?: boolean;
}

const Wrapper = styled('div')<{ hasAction?: boolean, isActive?: boolean, dense?: boolean }>`
  cursor: ${props => (props.isActive || !props.hasAction) ? 'default' : 'pointer'};
  padding: ${props => props.dense ? '12px 16px' : '16px'};
  font-size: ${props => props.dense ? '14px' : '16px'};
  display: flex;
  align-items: center;
  background: ${props => props.isActive ? color.section.main : 'inherit'};

  &:hover {
    background: ${props => props.hasAction ? color.section.main : 'transparent'};
  }
`;

const NavAvatar = withStyles(() => ({
  root: {
    background: color.section.dark,
    padding: '4px',
    width: '32px',
    height: '32px',
    '& > svg': {
      fontSize: '18px'
    }
  }
}))(Avatar);


const NavAvatarSmall = withStyles(() => ({
  root: {
    width: '28px',
    height: '28px'
  }
}))(NavAvatar);

export const CollapsibleNavItem: React.FC<ICollapsibleNavItem> = ({
  onClick,
  isActive,
  isCollapsed,
  icon,
  children,
  light
}) => {
  const dense = getDenseStatus();
  const NavAvatarComponent = dense ? NavAvatarSmall : NavAvatar;
  const style: any = {};

  if (isActive) {
    style.background = theme.palette.primary.main;
  } else if (light) {
    style.background = theme.palette.common.white;
    style.color = theme.palette.text.primary;
  }

  return (
    <Wrapper dense={dense} isActive={isActive} onClick={() => { onClick && onClick()}} hasAction={Boolean(onClick)}>
      {icon && (
        <NavAvatarComponent style={style}>{icon}</NavAvatarComponent>
      )}
      {!isCollapsed && <Box px={icon ? 2 : 0}>{children}</Box>}
    </Wrapper>
  );
};
