import _ from 'lodash';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

// Data
import { isValidEmail } from '../../../../lib/helpers/validation.helpers';
import messages from './invite-form.messages';
import { ROLES } from '../../../../../_configuration';

// Components
import { FormHelperText, FormInput } from '../../../_core/_ui/forms.component';
import IntlMsg from '../../../_core/IntlMsg/intl-msg.component';
import { toggleListItem } from '../../../../lib/helpers/data-structure.helpers';
import { Button } from '../../../_core/_ui/buttons.component';

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
        {_.map(ROLES, (role, label) => (
          <FormControlLabel
            key={role}
            control={<Checkbox checked={_.includes(roles, role)} onChange={() => toggleRole(role)} />}
            label={label}
          />
        ))}
      </Box>
      <Box mt={2} display="flex" flexDirection="row" alignItems="center">
        <Button color="primary" disabled={roles.length === 0 || !isValidEmail(email)} onClick={() => {
          sendInvite(email, roles);
          setEmail('');
          setRoles([]);
        }} endIcon={<SendIcon />}>
          <IntlMsg {...messages.btnSendInvite} />
        </Button>
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
