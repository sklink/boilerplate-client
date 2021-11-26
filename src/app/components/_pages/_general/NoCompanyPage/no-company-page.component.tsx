import React from 'react';

// Material UI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Data
import { buildSignOut } from '../../../../domains/_auth/auth.service';
import logo from '../../../../assets/logo.svg';
import { APP_TITLE, COMPANY_TERM, SUPPORT_EMAIL } from '../../../../../_configuration';
import { pluralTerm } from '../../../../lib/helpers/content.helper';

// Components
import { PrimaryButton } from '../../../_core/_ui/buttons.component';
import { Text } from '../../../_core/_ui/typography.component';
import { Logo } from '../../../_core/_ui/general.components';

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
            <Text large>You do not belong to any {pluralTerm(COMPANY_TERM)}</Text>
            <Text large>Please contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></Text>
            <Box mt={2}>
              <PrimaryButton variant="contained" onClick={onSignOut}>Sign Out</PrimaryButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NoCompanyPage;
