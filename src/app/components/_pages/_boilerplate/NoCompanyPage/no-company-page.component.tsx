import React from 'react';

// Material UI
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// Data
import { buildSignOut } from '../../../../lib/services/auth.service';
import logo from '../../../../assets/logo.png';
import { APP_TITLE, COMPANY_TERM, SUPPORT_EMAIL } from '../../../../../_configuration';
import { pluralTerm } from '../../../../lib/helpers/term.helper';

// Components
import { PrimaryButton } from '../../../_core/_ui/buttons.component';
import { Text } from '../../../_core/_ui/typography.component';
import { Logo } from '../../../_core/_ui/general.components';

const NoCompanyPage = () => {
  const onSignOut: ClickHandler = buildSignOut();

  return (
    <Container>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid container item xs={12} justify="center" alignItems="center">
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
