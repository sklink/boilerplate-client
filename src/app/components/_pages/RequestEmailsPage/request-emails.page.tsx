import _ from 'lodash';
import React, { useState } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Data
import { SESSIONS_TERM } from '../../../lib/constants';
import { buildRequestEmails } from '../../../lib/services/email-log.service';

// Components
import { FormHelperText, FormInput, FormLabel } from '../../_core/_ui/forms.component';
import FormControl from '@material-ui/core/FormControl';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import SingleFormLayout from '../_layout/SingleFormLayout/single-form.layout';
import Checkbox from '@material-ui/core/Checkbox';
import { isValidEmail } from '../../../lib/helpers/validation.helpers';


const RequestEmailsPage = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [email, setEmail] = useState('');
  const [types, setTypes] = useState<string[]>([]);

  const { requestEmails } = buildRequestEmails();

  const handleSubmit = () => {
    setSubmitting(true);
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);

    requestEmails(email, types)
      .then(() => {
        setSubmitting(false);
        setEmail('');
      })
  };

  const toggleType = (type: string) => {
    if (_.includes(types, type)) {
      setTypes(_.filter(types, currType => currType !== type));
    } else {
      setTypes([...types, type]);
    }
  }

  return (
    <SingleFormLayout>
      <Typography gutterBottom>Lost an email with your {SESSIONS_TERM.toLowerCase()} or report card?</Typography>
      <Typography gutterBottom>Enter your email address and choose which emails you would like to receive</Typography>
      <Box display="flex" flexDirection="column">
        <FormControl margin="dense">
          <FormLabel>Email Address</FormLabel>
          <FormInput name="email" type="email" onKeyUp={e => setEmail(e.currentTarget.value)} />
        </FormControl>
        <Box mt={2} mb={1}>
          <FormLabel>Email Types</FormLabel>
          <Box mt={1}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Checkbox id="welcome" checked={_.includes(types, 'WELCOME')} onClick={() => toggleType('WELCOME')} />
              <label htmlFor="welcome">Welcome Email</label>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Checkbox id="sessions" checked={_.includes(types, 'SESSION')} onClick={() => toggleType('SESSION')} />
              <label htmlFor="sessions">{SESSIONS_TERM}</label>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Checkbox id="report" checked={_.includes(types, 'REPORT_CARD')} onClick={() => toggleType('REPORT_CARD')} />
              <label htmlFor="report">Report Card</label>
            </Box>
          </Box>
        </Box>
        <FormControl margin="dense">
          <Box display="flex" alignItems="center">
            <PrimaryButton onClick={handleSubmit} disabled={isSubmitting || types.length === 0 || !isValidEmail(email)} variant="contained">
              Request Emails
            </PrimaryButton>
            {showSaved && <Box p={2}><FormHelperText className="success">Emails sent</FormHelperText></Box>}
          </Box>
        </FormControl>
      </Box>
    </SingleFormLayout>
  );
}

export default RequestEmailsPage;
