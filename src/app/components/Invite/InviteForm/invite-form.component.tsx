import _ from 'lodash';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Box from '@material-ui/core/Box';
import SendIcon from '@material-ui/icons/Send';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

// Data
import { isValidEmail } from '../../../lib/helpers/validation.helpers';
import messages from './invite-form.messages';

// Components
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { FormHelperText, FormInput } from '../../_core/_ui/forms.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { ROLE_LABELS, ROLES } from '../../../../_configuration';
import { toggleListItem } from '../../../lib/helpers/data-structure.helpers';

interface InviteFormProps {
  sendInvite: Function;
  showSaved: boolean;
  submitError: string | null;
}

const InviteForm: React.FC<InviteFormProps> = ({
  sendInvite,
  showSaved,
  submitError
}) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const eleEmail = useRef();

  function onKeyUpEmail(e: any) {
    if (email && isValidEmail(email) && e.key === "Enter" && roles.length > 0) {
      sendInvite(email, roles);
      setEmail('');
      setRoles([]);

      if (eleEmail.current) {
        // @ts-ignore
        eleEmail.current.value = '';
      }
    } else {
      setEmail(e.currentTarget.value);
    }
  }

  const toggleRole = (role: string) => {
    setRoles(toggleListItem(roles, role));
  }

  return (
    <Box>
      <Box flexGrow={1}>
        <Box mb={2}>
          <FormInput
            ref={eleEmail}
            fullWidth
            placeholder="Email address"
            type="email"
            autoComplete="off"
            onKeyUp={onKeyUpEmail}
          />
        </Box>

        <Typography variant="h6" gutterBottom>Roles</Typography>
        {_.map(ROLES, role => (
          <FormControlLabel
            key={role}
            control={<Checkbox checked={_.includes(roles, role)} onChange={() => toggleRole(role)} />}
            label={ROLE_LABELS[role]}
          />
        ))}
      </Box>
      <Box mt={2} display="flex" flexDirection="row" alignItems="center">
        <PrimaryButton disabled={roles.length === 0 || !isValidEmail(email)} onClick={() => {
          sendInvite(email, roles);
          setEmail('');
          setRoles([]);
        }} endIcon={<SendIcon />}>
          <IntlMsg {...messages.btnSendInvite} />
        </PrimaryButton>
        {submitError && <Box ml={2}><FormHelperText error>{submitError}</FormHelperText></Box>}
        {showSaved && <Box ml={2}><FormHelperText className="success">Invite sent</FormHelperText></Box>}
      </Box>
    </Box>
  );
};

InviteForm.propTypes = {
  sendInvite: PropTypes.func.isRequired,
};

export default InviteForm;
