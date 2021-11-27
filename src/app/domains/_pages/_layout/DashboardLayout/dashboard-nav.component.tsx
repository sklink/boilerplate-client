import React from 'react';
import { styled } from '@mui/material/styles';
import { makeVar, useReactiveVar } from '@apollo/client';
import { useHistory } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import withStyles from '@mui/styles/withStyles';
import SignOutIcon from '@mui/icons-material/ExitToApp';
import UsersIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Data
import logo from '../../../../assets/logo.svg'
import logoIcon from '../../../../assets/logo-icon.svg'

// Components
import { CollapsibleNavItem } from '../../../_core/_ui/nav.components';
import { Spacer } from '../../../_core/_ui/structure.components';
import theme from '../../../../lib/_theme';
import { buildSignOut } from '../../../_auth/auth.service';
import CompanySelectorGraphQL from '../../../company/components/_CompanySelector/company-selector.graphql';
import { hasAnyRoles } from '../../../user/user.service';
import { isContextCollapsedVar } from './dashboard-sidebar.component';

const Logo = styled('img')`
  width: 136px;
`;

const ToggleFab = withStyles(() => ({
  root: {
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    position: 'absolute',
    right: '-12px',
    top: '35px',
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    width: '24px',
    height: '24px',
    minHeight: 'auto'
  }
}))(Fab);

interface IWrapper {
  isCollapsed?: boolean;
}
const Wrapper = styled('div')<IWrapper>`
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

        <CollapsibleNavItem
          isActive={history.location.pathname === '/'}
          isCollapsed={isCollapsed}
          icon={<DashboardIcon />}
          onClick={() => history.push('/')}
        >
          Dashboard
        </CollapsibleNavItem>

        <Spacer />
        {!isCollapsed && <Box p={2}><CompanySelectorGraphQL /></Box>}
        {hasAnyRoles(['USER_MANAGEMENT']) && <CollapsibleNavItem
          isActive={history.location.pathname === '/users'}
          isCollapsed={isCollapsed}
          icon={<UsersIcon />}
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
