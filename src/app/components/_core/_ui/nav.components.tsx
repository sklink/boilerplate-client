import React, { ReactNode } from 'react';
import styled from 'styled-components';

// Material UI
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import withStyles from '@mui/styles/withStyles';
import theme, { mainColor, sectionColor, sectionDarkerColor } from '../../../lib/theme';
import { getDenseStatus } from '../PersistGateContainer/persist-gate.container';

interface ICollapsibleNavItem {
  onClick?: Function;
  icon: ReactNode | false | null | undefined;
  isActive?: boolean;
  isCollapsed?: boolean;
  children: ReactNode;
  light?: boolean;
}

const Wrapper = styled.div<{ hasAction?: boolean, isActive?: boolean, dense?: boolean }>`
  cursor: ${props => (props.isActive || !props.hasAction) ? 'default' : 'pointer'};
  padding: ${props => props.dense ? '12px 16px' : '16px'};
  font-size: ${props => props.dense ? '14px' : '16px'};
  display: flex;
  align-items: center;
  background: ${props => props.isActive ? sectionColor : 'inherit'};

  &:hover {
    background: ${props => props.hasAction ? sectionColor : 'transparent'};
  }
`;

const NavAvatar = withStyles(() => ({
  root: {
    background: sectionDarkerColor,
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
    style.background = mainColor;
  } else if (light) {
    style.background = '#fff';
    style.color = '#555';
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
