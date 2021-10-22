import React from 'react';

// Material UI
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';
import { buildUpdateUserSettings } from '../../../lib/services/user.service';

interface IToggleGlobal {
  label: string;
}

const ToggleGlobal: React.FC<IToggleGlobal> = ({ label }) => {
  const user = getAuthUser();
  const { updateUserSettings } = buildUpdateUserSettings();

  const handleToggleGlobal = () =>
    updateUserSettings({ includeGlobal: !user?.settings.includeGlobal });

  return (
    <FormControlLabel
      control={<Checkbox checked={user?.settings.includeGlobal} onChange={handleToggleGlobal} />}
      label={label}
    />
  );
};

export default ToggleGlobal;
