import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Material UI
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import { FormHelperText } from '../../_core/_ui/forms.component';

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
                <IconButton aria-label="delete" onClick={() => resendInvite(invite._id)}>
                  <SendIcon/>
                </IconButton>
              </Box>
              <IconButton aria-label="delete" onClick={() => cancelInvite(invite._id)}>
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
