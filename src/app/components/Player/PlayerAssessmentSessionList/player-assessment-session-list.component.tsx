import React from 'react';
import { gql, useQuery } from '@apollo/client';
import dayjs from 'dayjs';

// Material UI
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

// Data
import { ASSESSMENT_SESSION_FIELDS } from '../../../lib/queries/assessment-session.queries';
import { numToTime } from '../../../lib/helpers/conversion.helpers';

const GET_PLAYER_ASSESSMENT_SESSION_LIST = gql`
  query GetPlayerAssessmentSessionList($playerAssessmentId: ID!) {
    playerAssessmentSessions(playerAssessmentId: $playerAssessmentId) {
      ...AssessmentSessionFields
    }
  }

  ${ASSESSMENT_SESSION_FIELDS}
`;

interface IPlayerAssessmentSessionListGraphQL {
  playerAssessmentId: string;
}

const PlayerAssessmentSessionListGraphQL: React.FC<IPlayerAssessmentSessionListGraphQL> = ({ playerAssessmentId }) => {
  const { data, loading, error } = useQuery(GET_PLAYER_ASSESSMENT_SESSION_LIST, {
    variables: { playerAssessmentId },
    fetchPolicy: 'cache-and-network'
  });

  const sessions: IAssessmentSession[] = (data && data.playerAssessmentSessions) || [];

  return (
    <List>
      {sessions.map(session => (
        <ListItem key={session._id}>
          <ListItemText
            primary={session.location || session.address}
            secondary={(
              <>
                {session.location && <>{session.address}<br /></>}
                {dayjs(session.date).format('MMMM Do')} at {numToTime(session.start)} for {session.duration} minutes
              </>
            )}
          />
        </ListItem>
      ))}
      {sessions.length === 0 && (
        <ListItem>
          <ListItemText primary="None" />
        </ListItem>
      )}
    </List>
  );
};

export default PlayerAssessmentSessionListGraphQL;
