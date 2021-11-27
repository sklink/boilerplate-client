import React from 'react';

// Material UI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// Data
import logo from '../../../../assets/logo.svg';
import { APP_TITLE } from '../../../../../_configuration';

// Components
import { Logo } from '../../../_core/_ui/general.components';
import { Text } from '../../../_core/_ui/typography.component';

const NotFoundPage = () => (
  <Container>
    <Grid container spacing={3} justifyContent="center" alignItems="center">
      <Grid container item xs={12} justifyContent="center" alignItems="center">
        <Logo src={logo} alt={APP_TITLE} />
      </Grid>
      <Grid item xs={12}>
        <Text large align="center">Could not find the content you were looking for (404)</Text>
      </Grid>
    </Grid>
  </Container>
);

export default NotFoundPage;
