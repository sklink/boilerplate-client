import React, { useState } from 'react';

// Data
import { buildSendInvite } from '../../invite.service';

// Components
import InviteForm from './invite-form.component';

const InviteFormContainer = () => {
  const [showSaved, setShowSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { sendInvite } = buildSendInvite();

  const handleSendInvite = (email: string, roles: string[]) => {

    sendInvite(email.toLowerCase(), roles)
      .then(() => {
        setShowSaved(true);
        setTimeout(() => {
          setShowSaved(false)
        }, 3000);
      })
      .catch(err => {
        setSubmitError(err.message);
        setTimeout(() => {
          setSubmitError(null);
        }, 3000);
      });
  }

  return <InviteForm
    showSaved={showSaved}
    sendInvite={handleSendInvite}
    submitError={submitError}
  />;
};

export default InviteFormContainer;
