import React from 'react';
import dayjs from 'dayjs';
import { gql, useMutation, useQuery } from '@apollo/client';
import AssessmentSessionUpcomingNotifications from './assessment-session-upcoming-notification.component';

const GET_UPCOMING_NOTIFICATIONS = gql`
  query GetAssessmentSessionUpcomingNotifications($_id: ID!) {
    assessmentSession(_id: $_id) {
      upcomingNotifications
    }
  }
`;

const CANCEL_UPCOMING_NOTIFICATION = gql`
  mutation CancelUpcomingNotification($_id: ID!, $scheduledAt: String!) {
    cancelNotification(_id: $_id, scheduledAt: $scheduledAt)
  }
`;

interface IAssessmentSessionUpcomingNotificationsGraphQL {
  assessmentSessionId: string;
}

const AssessmentSessionUpcomingNotificationsGraphQL: React.FC<IAssessmentSessionUpcomingNotificationsGraphQL> = ({ assessmentSessionId }) => {
  const [cancelNotification] = useMutation(CANCEL_UPCOMING_NOTIFICATION);
  const { data, loading, error, refetch } = useQuery(GET_UPCOMING_NOTIFICATIONS, {
    variables: { _id: assessmentSessionId },
    fetchPolicy: 'cache-and-network'
  });

  const notifications = data && data.assessmentSession.upcomingNotifications;
  const handleCancelNotification = (notification: string) => {
    if (window.confirm(`Are you sure you want to cancel the notification on ${dayjs(new Date(Number(notification))).format('YYYY/MM/DD @ h:mm A')}?`)) {
      cancelNotification({
        variables: {_id: assessmentSessionId, scheduledAt: notification }
      })
        .then(() => refetch());
    }
  }
  console.log(data);

  return <AssessmentSessionUpcomingNotifications
    cancelNotification={handleCancelNotification}
    notifications={notifications}
  />
};

export default AssessmentSessionUpcomingNotificationsGraphQL;
