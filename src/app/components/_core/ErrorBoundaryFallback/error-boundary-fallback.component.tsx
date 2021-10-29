import React from 'react';

// Material UI
import Box from '@mui/material/Box';

// Data
import ChatWoot from '../../../lib/utils/chat.service';

// Components
import { PrimaryButton } from '../_ui/buttons.component';
import { Text } from '../_ui/typography.component';

// Components

const ErrorBoundaryFallback = () => (
  <Box display="flex" flexDirection="column" alignItems="center" width="100%" my={2} textAlign="center">
    <Text>Something went wrong, the support team has been notified.<br />Please contact support if you need immediate assistance</Text>
    <Box display="flex" justifyContent="center" mt={2}>
      <PrimaryButton onClick={ChatWoot.toggle}>Chat with Support</PrimaryButton>
    </Box>
  </Box>
);

ErrorBoundaryFallback.propTypes = {

};

export default ErrorBoundaryFallback;
