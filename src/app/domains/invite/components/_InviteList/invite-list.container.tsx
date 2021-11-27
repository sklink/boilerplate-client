import React, { useState } from 'react';

// Data
import { buildCancelInvite, buildResendInvite, getInvites } from '../../invite.service';
import { INVITE_STATUSES } from '../../../../lib/_constants';

// Components
import InviteList from './invite-list.component';

const InviteListContainer = () => {
  const [showSent, setShowSent] = useState();
  const { resendInvite } = buildResendInvite();
  const { cancelInvite } = buildCancelInvite();
  const { invites } = getInvites(INVITE_STATUSES.PENDING);

  const handleResendInvite = (_id: string) => {
    setShowSent(_id);
    setTimeout(() => {
      setShowSent(null);
    }, 3000);
    resendInvite(_id);
  };

  return <InviteList
    showSent={showSent}
    invites={invites}
    resendInvite={handleResendInvite}
    cancelInvite={cancelInvite}
  />;
};

export default InviteListContainer;
