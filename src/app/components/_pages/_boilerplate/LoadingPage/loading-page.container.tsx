import React from 'react';

// Material UI
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

// Data
import logo from '../../../../assets/logo.png';
import { APP_TITLE } from '../../../../../_configuration';

// Components
import { Logo } from '../../../_core/_ui/general.components';
import { Text } from '../../../_core/_ui/typography.component';

const LoadingPage = () => (
  <Container>
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid container item xs={12} justify="center" alignItems="center">
        <Logo src={logo} alt={APP_TITLE} />
      </Grid>
      <Grid item xs={12}>
        <Text large align="center">Loading...</Text>
      </Grid>
    </Grid>
  </Container>
);

export default LoadingPage;
