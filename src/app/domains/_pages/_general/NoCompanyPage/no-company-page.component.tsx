import React from 'react';

// Material UI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Data
import { buildSignOut } from '../../../_auth/auth.service';
import { APP_TITLE, COMPANIES_TERM, SUPPORT_EMAIL } from '../../../../../_configuration';
import logo from '../../../../assets/logo.svg';

// Components
import { Logo } from '../../../_core/_ui/general.components';
import { Button } from '../../../_core/_ui/buttons.component';

const NoCompanyPage = () => {
  const onSignOut: ClickHandler = buildSignOut();

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid container item xs={12} justifyContent="center" alignItems="center">
          <Logo src={logo} alt={APP_TITLE} />
        </Grid>
        <Grid item xs={12}>
          <Box alignItems="center" textAlign="center">
            <Typography>You do not belong to any {COMPANIES_TERM}</Typography>
            <Typography>Please contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></Typography>
            <Box mt={2}>
              <Button color="primary" variant="contained" onClick={onSignOut}>Sign Out</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NoCompanyPage;
