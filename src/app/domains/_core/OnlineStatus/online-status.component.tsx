import React from 'react';
import { styled } from '@mui/material/styles';

// Material UI
import Typography from '@mui/material/Typography';

// Data
import theme from '../../../lib/_theme';
import { getOnlineStatus, getSyncing } from '../PersistGateContainer/persist-gate.container';
import { ENABLE_OFFLINE_GQL } from '../../../../_configuration';

// Components
const AlertWrapper = styled('div')`
  text-align: center;
  padding: 12px 16px;
  background: ${theme.palette.warning.main};
`;

const SyncWrapper = styled('div')`
  text-align: center;
  padding: 12px 16px;
  background: ${theme.palette.success.main};
`;

const OnlineStatus = () => {
  const isOnline = getOnlineStatus();
  const isSyncing = getSyncing();

  if (isSyncing) {
    return (
      <SyncWrapper>
        <Typography>
          Syncing
        </Typography>
      </SyncWrapper>
    );
  }

  if (isOnline) return <></>;

  return (
    <AlertWrapper>
      <Typography>
        You don't seem to be connected to the internet.
        Any changes you make will be saved and synchronized when your connection is restored
        {ENABLE_OFFLINE_GQL && ' or when you restart the app'}
      </Typography>
    </AlertWrapper>
  );
};

export default OnlineStatus;
