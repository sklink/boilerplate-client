import React from 'react';
import styled from 'styled-components';

// Material UI
import Box from '@material-ui/core/Box';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import PlayersIcon from '@material-ui/icons/Group';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DrillsIcon from '@material-ui/icons/Assignment';
import SessionsIcon from '@material-ui/icons/DateRange';
import UpcomingIcon from '@material-ui/icons/Check';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import GearIcon from '@material-ui/icons/Settings';
import EqualizerIcon from '@material-ui/icons/Equalizer';

// Data
import { SESSION_TERM } from '../../../../lib/constants';
import logo from '../../../../assets/logo.png'
import logoIcon from '../../../../assets/logo-icon.png'

// Components
import { CollapsibleNavItem } from '../../../_core/_ui/nav.components';
import { Spacer } from '../../../_core/_ui/structure.components';
import { Fab } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { mainColor } from '../../../../lib/theme';
import { useHistory } from 'react-router-dom';
import { buildSignOut, getAuthUser } from '../../../../domains/_auth/auth.service';
import CompanySelectorGraphQL from '../../../../domains/company/components/_CompanySelector/company-selector.graphql';
import { pluralTerm } from '../../../../lib/helpers/content.helper';
import { makeVar, useReactiveVar } from '@apollo/client';
import { hasAnyRoles } from '../../../../domains/user/user.service';
import { isContextCollapsedVar } from './dashboard-sidebar.component';

const Logo = styled.img`
  width: 136px;
`;

const ToggleFab = withStyles(() => ({
  root: {
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    position: 'absolute',
    right: '-12px',
    top: '35px',
    color: '#fff',
    background: mainColor,
    width: '24px',
    height: '24px',
    minHeight: 'auto'
  }
}))(Fab);

interface IWrapper {
  isCollapsed?: boolean;
}
const Wrapper = styled.div<IWrapper>`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  padding: 8px 0;
  position: fixed;
  height: 100%;
  width: ${props => props.isCollapsed ? 'auto' : '180px'};
`;

export const isNavCollapsedVar = makeVar(Boolean(localStorage.getItem('mea_navCollapsed')));
const setCollapsed = (nextValue: boolean) => isNavCollapsedVar(nextValue);

const DashboardNav = () => {
  const history = useHistory();
  const signOut = buildSignOut();
  const isCollapsed = useReactiveVar(isNavCollapsedVar);

  const toggleCollapsed = () => {
    if (isCollapsed) {
      isContextCollapsedVar(false);
    }

    setCollapsed(!isCollapsed);
  }

  return (
    <>
      <ToggleFab style={{ position: 'fixed', zIndex: 101, left: isCollapsed ? '52px' : '167px' }} onClick={() => toggleCollapsed()}>
        {isCollapsed
          ? <ArrowRightIcon style={{ position: 'relative', left: '1px', top: '1px' }} />
          : <ArrowLeftIcon style={{ position: 'relative', top: '1px' }} />
        }
      </ToggleFab>
      <Wrapper isCollapsed={isCollapsed}>
        <Box style={{ marginTop: isCollapsed ? '8px' : '0' }} />
        <CollapsibleNavItem icon={isCollapsed && <Logo src={logoIcon} />} light isCollapsed={isCollapsed}>
          <Logo src={logo} />
        </CollapsibleNavItem>

        {hasAnyRoles(['REPORTS', 'CONFIGURATION']) && <CollapsibleNavItem
          isActive={history.location.pathname === '/'}
          isCollapsed={isCollapsed}
          icon={<DashboardIcon />}
          onClick={() => history.push('/')}
        >
          Dashboard
        </CollapsibleNavItem>}

        {hasAnyRoles(['CHECK_IN', 'SCORING']) && <CollapsibleNavItem
          isActive={history.location.pathname === '/upcoming'}
          isCollapsed={isCollapsed}
          icon={<UpcomingIcon />}
          onClick={() => history.push('/upcoming')}
        >
          Upcoming
        </CollapsibleNavItem>}

        {hasAnyRoles(['CONFIGURATION']) && <CollapsibleNavItem
          isActive={history.location.pathname === '/sessions'}
          isCollapsed={isCollapsed}
          icon={<SessionsIcon />}
          onClick={() => history.push('/sessions')}
        >
          {pluralTerm(SESSION_TERM)}
        </CollapsibleNavItem>}
        {hasAnyRoles(['CONFIGURATION', 'REPORTS']) && <CollapsibleNavItem
          isActive={history.location.pathname === '/players'}
          isCollapsed={isCollapsed}
          icon={<PlayersIcon />}
          onClick={() => history.push('/players')}
        >
          Players
        </CollapsibleNavItem>}
        {hasAnyRoles(['CONFIGURATION']) && <CollapsibleNavItem
          isActive={history.location.pathname === '/drills' || history.location.pathname === '/practice-plans' || history.location.pathname === '/skills'}
          isCollapsed={isCollapsed}
          icon={<DrillsIcon />}
          onClick={() => history.push('/drills')}
        >
          Drills
        </CollapsibleNavItem>}

        {hasAnyRoles(['CONFIGURATION']) && <CollapsibleNavItem
          isActive={history.location.pathname === '/format'}
          isCollapsed={isCollapsed}
          icon={<GearIcon />}
          onClick={() => history.push('/format')}
        >
          Format
        </CollapsibleNavItem>}



        <Spacer />
        {!isCollapsed && <Box p={2}><CompanySelectorGraphQL /></Box>}
        {hasAnyRoles(['USER_MANAGEMENT']) && <CollapsibleNavItem
          isActive={history.location.pathname === '/users'}
          isCollapsed={isCollapsed}
          icon={<PlayersIcon />}
          onClick={() => history.push('/users')}
        >
          Users
        </CollapsibleNavItem>}
        <CollapsibleNavItem
          onClick={() => signOut()}
          isCollapsed={isCollapsed}
          icon={<SignOutIcon />}
        >
          Sign Out
        </CollapsibleNavItem>
      </Wrapper>
    </>
  );
};

export default DashboardNav;


// <CollapsibleNavItem
//   isActive={history.location.pathname === '/reports'}
//   isCollapsed={isCollapsed}
//   icon={<ReportsIcon />}
//   onClick={() => history.push('/reports')}
// >
//   Reports
// </CollapsibleNavItem>

// {hasAnyRoles(['CONFIGURATION']) && <CollapsibleNavItem
//   isActive={history.location.pathname === '/weighting'}
//   isCollapsed={isCollapsed}
//   icon={<EqualizerIcon />}
//   onClick={() => history.push('/weighting')}
// >
//   Weighting
// </CollapsibleNavItem>}
