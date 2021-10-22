import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';
import { FormattedMessage } from 'react-intl';

// data
import { ENABLE_SENTRY } from '../../../../_configuration';

const IntlMsg = (message: any) => {
  if (ENABLE_SENTRY && (!message || !message.id)) {
    Sentry.captureMessage('Missing message for Intl');
  }

  return message && message.id ? <FormattedMessage {...message} /> : <></>;
};

IntlMsg.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string,
};

export default IntlMsg;
