import React from 'react';
import { styled } from '@mui/material/styles';

// Material UI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// Data
import logo from '../../../../assets/logo.svg';
import { APP_TITLE } from '../../../../../_configuration';
import { Logo } from '../../../_core/_ui/general.components';
import { Text } from '../../../_core/_ui/typography.component';

// Components

const NoDesktop = () => (
  <Container id="no-desktop">
    <Grid container spacing={3} justifyContent="center" alignItems="center">
      <Grid container item xs={12} justifyContent="center" alignItems="center">
        <Logo src={logo} alt={APP_TITLE} />
      </Grid>
      <Grid item xs={12}>
        <Text large>{APP_TITLE} is not supported on PC at this time</Text>
        <Text large>Please use your mobile device</Text>
      </Grid>
    </Grid>
  </Container>
);

export default NoDesktop;
