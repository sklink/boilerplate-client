import _ from 'lodash';
import { useMutation, useQuery } from '@apollo/client';

import { COUNT_HAS_UNSENT_TYPE, REQUEST_EMAILS, SEND_COMMUNICATION } from '../queries/email-log.queries';
import { getAuthUser } from './auth.service';

export const buildRequestEmails = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(REQUEST_EMAILS);

  return {
    ...rest,
    requestEmails: (email: string, types: string[]) => mutation({
      variables: { email, types }
    })
  };
};

export const getCountHasUnsentType = (type: string, ageGroupId?: string, playerAssessmentIds?: string[]) => {
  const user = getAuthUser();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, ...rest } = useQuery(COUNT_HAS_UNSENT_TYPE, {
    skip: !user,
    variables: {
      assessmentId: user?.settings.activeAssessmentId,
      ageGroupIds: ageGroupId ? [ageGroupId] : user?.settings.activeAgeGroupIds,
      playerAssessmentIds,
      type
    },
    fetchPolicy: 'cache-and-network'
  });

  return {
    ...rest,
    count: _.get(data, 'countHasUnsentType', 0)
  };
};

export const buildSendEmails = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(SEND_COMMUNICATION);

  return {
    ...rest,
    sendEmails: (type: string, ageGroupId?: string, resend?: boolean) => mutation({
      variables: {
        ageGroupIds: ageGroupId ? [ageGroupId] : user?.settings.activeAgeGroupIds,
        assessmentId: user?.settings.activeAssessmentId,
        type,
        resend: Boolean(resend)
      }
    })
  }
};
