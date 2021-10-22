import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Material UI
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Data
import { COMMUNICATION_FIELDS } from '../../../lib/queries/email-log.queries';
import { SESSION_TERM } from '../../../lib/constants';
import dayjs from 'dayjs';

const EMAIL_TYPE_LABELS: { [key: string]: string } = {
  WELCOME: 'Welcome Email',
  SESSION_START: `${SESSION_TERM} Start`,
  SESSION_UPDATE: `${SESSION_TERM} Update`,
  SESSION_REMINDER: `${SESSION_TERM} Reminder`,
  SESSION_CANCELLED: `${SESSION_TERM} Cancelled`,
  HOLD: `On Hold`,
  REPORT_CARD: 'Report Card'
};

const GET_COMMUNICATION_LIST = gql`
  query GetCommunicationList($playerAssessmentId: ID!) {
    communications(playerAssessmentId: $playerAssessmentId) {
      ...CommunicationFields
    }
  }

  ${COMMUNICATION_FIELDS}
`;

interface ICommunicationListGraphQL {
  playerAssessmentId: string;
}

const CommunicationListGraphQL: React.FC<ICommunicationListGraphQL> = ({ playerAssessmentId }) => {
  const { data, loading, error } = useQuery(GET_COMMUNICATION_LIST, {
    variables: { playerAssessmentId },
    fetchPolicy: 'cache-and-network'
  });

  const logs: ICommunication[] = (data && data.communications) || [];

  if (logs.length === 0 && loading) return <Typography>Loading...</Typography>;

  return (
    <List style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {logs.map(log => {
        const date = log.scheduledAt
          ? `Scheduled @ ${dayjs(log.scheduledAt).format('YYYY/MM/DD h:mm A')}`
          :  `Sent @ ${dayjs(log.sentAt).format('YYYY/MM/DD h:mm A')}`;

        return (
          <ListItem key={log._id}>
            <ListItemText
              primary={`${EMAIL_TYPE_LABELS[log.type]}`}
              secondary={<span>
                <span>{log.to}</span><br />
                <span>{date}</span>
              </span>}
            />
          </ListItem>
        );
      })}
      {logs.length === 0 && (
        <ListItem>
          <ListItemText primary="None" />
        </ListItem>
      )}
    </List>
  );
};

export default CommunicationListGraphQL;
