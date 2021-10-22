import _ from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

// Components
import { ButtonRow, OutlineButtonVertical, SecondaryButtonVertical } from '../../_core/_ui/buttons.component';

interface ISkillGroupNavigation {
  currentLocation: string;
  countSkills: number;
  countDrills: number;
  loading: boolean;
  fetchError: boolean;
}

const SkillGroupNavigation: React.FC<ISkillGroupNavigation> = ({
  currentLocation,
  countSkills,
  countDrills
}) => {
  const history = useHistory();

  const NAVIGATION_DATA: { [key: string]: any } = {
    SKILLS: {
      currentLocation: '/skills',
      primary: 'Manage Skills',
      secondary: '(single performance measure)',
      disableHover: true
    },
    DRILLS: {
      currentLocation: '/drills',
      primary: 'Manage Drills',
      secondary: '(a set of skills evaluated at once)',
      hoverTitle: 'Requires Skills',
      isDisabled: countSkills === 0,
    },
    PLANS: {
      currentLocation: '/practice-plans',
      primary: 'Manage Practice Plans',
      secondary: `(a set of drills for an ice time)`,
      hoverTitle: 'Requires Drills',
      isDisabled: countDrills === 0
    }
  };


  return <ButtonRow>
    {_.map(NAVIGATION_DATA, (data, key) => {
      const isActive = currentLocation === data.currentLocation;
      let Component: any = isActive ? OutlineButtonVertical : SecondaryButtonVertical;
      Component = data.isDisabled ? FakeDisabledButton : Component;

      return (
        <Tooltip key={key} disableHoverListener={data.disableHover || !data.isDisabled} title={data.hoverTitle || ''}>
          <Component
            style={{ flexGrow: 1 }}
            onClick={() => !isActive && history.push(data.currentLocation)}
          >
            {data.primary}<br />
            <Typography variant="body2">{data.secondary}</Typography>
          </Component>
        </Tooltip>
      );
    })}
  </ButtonRow>;
};

const FakeDisabledButton = styled.div`
  color: rgba(0, 0, 0, 0.26);
  margin: 0 8px;
  padding: 8px 16px;
  font-weight: 500;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  text-align: center;
  line-height: 1.75;
  cursor: default;
`;

export default SkillGroupNavigation;
