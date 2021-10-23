import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { makeVar, useReactiveVar } from '@apollo/client';

// Material UI
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Data
import { mainColor } from '../../../../lib/theme';
import { isNavCollapsedVar } from './dashboard-nav.component';

// Components
import AssessmentSelectorGraphQL from '../../../../domains/project/components/_ProjectSelector/assessment-selector.graphql';
import GlobalAgeGroupFilterGraphQL from '../../../AgeGroup/GlobalAgeGroupFilter/global-age-group-filter.graphql';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import withStyles from '@material-ui/core/styles/withStyles';
import { Fab } from '@material-ui/core';

interface IWrapper {
  isNavCollapsed?: boolean;
  isCollapsed?: boolean;
}

const Wrapper = styled.div<IWrapper>`
  background: #fff;
  padding: ${props => props.isCollapsed ? 0 : '24px'};
  margin-right: 24px;
  height: 100%;
  box-shadow: 0 0 24px 8px rgba(0,0,0,0.05);
  width: ${props => props.isCollapsed ? '16px' : '300px'};
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: ${props => props.isNavCollapsed ? '64px' : '180px'};

  & > *:first-child {
    margin-top: 0;
  }
`;

const ToggleFab = withStyles(() => ({
  root: {
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    position: 'fixed',
    top: '35px',
    color: '#fff',
    background: mainColor,
    width: '24px',
    height: '24px',
    minHeight: 'auto',
    zIndex: 101
  }
}))(Fab);

export const isContextCollapsedVar = makeVar(Boolean(localStorage.getItem('mea_contextCollapsed')));
const setCollapsed = (nextValue: boolean) => isContextCollapsedVar(nextValue);

const DashboardSidebar = () => {
  const isNavCollapsed = useReactiveVar(isNavCollapsedVar);
  const isCollapsed = useReactiveVar(isContextCollapsedVar);
  const history = useHistory();

  return (
    <Wrapper isNavCollapsed={isNavCollapsed} isCollapsed={isCollapsed}>
      {!isCollapsed && (<ToggleFab style={{ left: isNavCollapsed ? '352px' : '467px' }} onClick={() => setCollapsed(!isCollapsed)}>
        {isCollapsed
          ? <ArrowRightIcon style={{ position: 'relative', left: '1px', top: '1px' }} />
          : <ArrowLeftIcon style={{ position: 'relative', top: '1px' }} />
        }
      </ToggleFab>)}
      {!isCollapsed && <>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1} mr={1}><AssessmentSelectorGraphQL /></Box>
          <IconButton onClick={() => history.push('/assessments/create')}>
            <AddIcon style={{ color: mainColor }} />
          </IconButton>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Age Groups</Typography>
          <Box py={2}>
            <GlobalAgeGroupFilterGraphQL />
          </Box>
        </Box>
      </>}
    </Wrapper>
  );
};

export default DashboardSidebar;
