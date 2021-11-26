import React, { ReactNode } from 'react';

// Material UI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

// Data
import logo from '../../../../assets/logo.svg';
import { APP_TITLE } from '../../../../../_configuration';

// Components
import { Logo } from '../../../_core/_ui/general.components';
import { SingleFormWrapper } from '../../../_core/_ui/structure.components';

interface ISingleFormLayout {
  children: ReactNode;
  width?: string;
  maxWidth?: string;
}

const SingleFormLayout: React.FC<ISingleFormLayout> = ({ children, width = 'auto', maxWidth }) => {
  return (
    <React.Fragment>
      <Container>
        <Grid container justifyContent="center">
          <Grid item>
            <Logo src={logo} alt={APP_TITLE} />
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item>
            <Paper>
              <SingleFormWrapper width={width} maxWidth={maxWidth}>
                {children}
              </SingleFormWrapper>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default SingleFormLayout;
