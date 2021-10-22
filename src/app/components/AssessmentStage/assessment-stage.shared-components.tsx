import styled from 'styled-components';

import { mainLightColor, sectionDarkerColor } from '../../lib/theme';

export const StageItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 8px 16px;
  background: #fff;
  border-radius: 8px;
`;


interface IStageItemPre {
  dark?: boolean;
}

export const StageItemPre = styled.div<IStageItemPre>`
  background: ${props => props.dark ? mainLightColor : sectionDarkerColor};
  color: rgba(0, 0, 0, 0.56);
  font-weight: bold;
  font-family: Quicksand, sans-serif;
  border-radius: 8px;
  display: flex;
  align-items: center;
`;

export const StageItemTitle = styled.div`
  flex-grow: 1;
  margin-left: 8px;
`;
