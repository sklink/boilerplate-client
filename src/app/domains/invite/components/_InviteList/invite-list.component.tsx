import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Material UI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { FormHelperText } from '../../../_core/_ui/forms.component';

dayjs.extend(relativeTime);

interface InviteListProps {
  invites: Array<IInvite>;
  cancelInvite: Function;
  resendInvite: Function;
  showSent: string | null;
}

const InviteList: React.FC<InviteListProps> = ({
  invites,
  cancelInvite,
  resendInvite,
  showSent
}) => (
  <Paper>
    <List>
      {_.map(invites, (invite: IInvite) => (
        <ListItem key={invite._id}>
          <ListItemText
            primary={invite.email}
            secondary={`Sent ${dayjs(invite.sentAt).fromNow()}`}
          />
          <ListItemSecondaryAction>
            <Box display="flex" alignItems="center">
              {showSent === invite._id && (
                <Box mr={2}>
                  <FormHelperText>Invite sent</FormHelperText>
                </Box>
              )}
              <Box mr={1}>
                <IconButton aria-label="delete" onClick={() => resendInvite(invite._id)} size="large">
                  <SendIcon/>
                </IconButton>
              </Box>
              <IconButton aria-label="delete" onClick={() => cancelInvite(invite._id)} size="large">
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      {!invites.length && (
        <ListItem>
          <ListItemText primary="None" />
        </ListItem>
      )}
    </List>
  </Paper>
);

export default InviteList;
