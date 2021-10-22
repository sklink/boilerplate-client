import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';

// Material UI
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';

interface IAssessmentSessionUpcomingNotifications {
  notifications: string[];
  cancelNotification: Function;
}

const AssessmentSessionUpcomingNotifications: React.FC<IAssessmentSessionUpcomingNotifications> = ({ notifications, cancelNotification }) => {
  return <List>
    {_.map(notifications, notification => (
      <ListItem key={notification}>
        <ListItemText primary={dayjs(new Date(Number(notification))).format('YYYY/MM/DD @ h:mm A')} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => cancelNotification(notification)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>;
};

export default AssessmentSessionUpcomingNotifications;
