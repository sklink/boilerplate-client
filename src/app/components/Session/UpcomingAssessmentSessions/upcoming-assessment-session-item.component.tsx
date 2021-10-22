import React from 'react';
import dayjs from 'dayjs';

// Material UI
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

// Data
import { numToTime } from '../../../lib/helpers/conversion.helpers';

interface IUpcomingAssessmentSessionItem {
  assessmentSession: IAssessmentSession;
  selectSession: Function;
}

const UpcomingAssessmentSessionItem: React.FC<IUpcomingAssessmentSessionItem> = ({ assessmentSession, selectSession }) => {
  return (
    <ListItem button onClick={() => selectSession(assessmentSession)}>
      <Box mr={2}><Avatar /></Box>
      <ListItemText
        primary={assessmentSession.location || assessmentSession.address}
        secondary={(
          <>
            {assessmentSession.location && <>{assessmentSession.address}<br /></>}
            {dayjs(assessmentSession.date).format('MMMM Do')} at {numToTime(assessmentSession.start)} for {assessmentSession.duration} minutes
          </>
        )}
      />
      <ListItemSecondaryAction>
        <Typography gutterBottom>{assessmentSession.playerCount} Player{assessmentSession.playerCount !== 1 && 's'}</Typography>
        <Typography>
          {assessmentSession.drillCount} Drill{assessmentSession.drillCount !== 1 && 's'}&nbsp;|&nbsp;
          {assessmentSession.practicePlanCount} Practice Plan{assessmentSession.practicePlanCount !== 1 && 's'}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default UpcomingAssessmentSessionItem;
