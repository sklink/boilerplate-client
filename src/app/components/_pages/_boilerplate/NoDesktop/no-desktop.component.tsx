import React from 'react';
import styled from 'styled-components';

// Material UI
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

// Data
import logo from '../../../../assets/logo.png';
import { APP_TITLE } from '../../../../../_configuration';
import { Logo } from '../../../_core/_ui/general.components';
import { Text } from '../../../_core/_ui/typography.component';

// Components

const NoDesktop = () => (
  <Container id="no-desktop">
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid container item xs={12} justify="center" alignItems="center">
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
