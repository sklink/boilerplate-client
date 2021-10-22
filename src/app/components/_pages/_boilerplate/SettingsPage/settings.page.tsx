import _ from 'lodash';
import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl/FormControl';

// Data
import messages from './settings-page.messages';
import { getAuthUser } from '../../../../lib/services/auth.service';

// Components
import IntlMsg from '../../../_core/IntlMsg/intl-msg.component';
import { FormInput, FormLabel } from '../../../_core/_ui/forms.component';
import DashboardLayout from '../../_layout/DashboardLayout/dashboard.layout';
import SetPasswordFormContainer from '../../../User/SetPasswordForm/set-password-form.container';

const SettingsPage = () => {
  const authUser: IUser | null = getAuthUser();
  const currEmail: string = _.get(authUser, 'email', '');

  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <h3><IntlMsg {...messages.headingAccount} /></h3>

          <FormControl margin="dense" fullWidth component="div">
            <FormLabel><IntlMsg {...messages.lblEmail} /></FormLabel>
            <FormInput value={currEmail} disabled />
          </FormControl>
          <h4><IntlMsg {...messages.headingChangePassword} /></h4>
          <SetPasswordFormContainer />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default SettingsPage;
