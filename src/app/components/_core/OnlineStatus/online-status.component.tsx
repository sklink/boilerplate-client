import React from 'react';
import styled from 'styled-components';

// Material UI
import Typography from '@mui/material/Typography';

// Data
import { successColor, warnColor } from '../../../lib/theme';
import { getOnlineStatus, getSyncing } from '../PersistGateContainer/persist-gate.container';

// Components
const AlertWrapper = styled.div`
  text-align: center;
  padding: 12px 16px;
  background: ${warnColor};
`;

const SyncWrapper = styled.div`
  text-align: center;
  padding: 12px 16px;
  background: ${successColor};
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
      </Typography>
    </AlertWrapper>
  );
};

export default OnlineStatus;
