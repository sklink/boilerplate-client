import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';

// Material UI
import Box from '@mui/material/Box';

const ItemText = styled('div')`
`;

interface ISidebarListItem {
  icon: ReactNode;
  label: string;
  onClick?: Function;
}

const Wrapper = styled('button')`
  background: #fff;
  display: flex;
  padding: 16px;
  width: 100%;

  &:hover {
    background: #fafafa;
  }
`;

const ItemLabel = styled('div')`
  font-size: 21px;
  font-weight: 500;
`;

const SidebarListItem: React.FC<ISidebarListItem> = ({ icon, label, onClick }) => {
  return (
    <Wrapper onClick={() => onClick && onClick()}>
      <Box mr={2}>{icon}</Box>
      <ItemLabel>{label}</ItemLabel>
    </Wrapper>
  );
};

export default SidebarListItem;
