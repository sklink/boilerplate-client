import React from 'react';

// Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Data
import ChatWoot from '../../../lib/utils/chat.service';
import { ENABLE_CHAT_SUPPORT } from '../../../../_configuration';

const ErrorBoundaryFallback = () => (
  <Box display="flex" flexDirection="column" alignItems="center" width="100%" my={2} textAlign="center">
    <Typography>Something went wrong, the support team has been notified.<br />Please contact support if you need immediate assistance</Typography>
    {ENABLE_CHAT_SUPPORT && <Box display="flex" justifyContent="center" mt={2}>
      <Button color="primary" onClick={ChatWoot.toggle}>Chat with Support</Button>
    </Box>}
  </Box>
);

ErrorBoundaryFallback.propTypes = {

};

export default ErrorBoundaryFallback;
