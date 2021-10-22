import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Bold } from '../../_core/_ui/typography.component';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import dayjs from 'dayjs';

interface ISessionStageHandler {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  isSummary?: boolean;
}

const SessionStageHandler: React.FC<ISessionStageHandler> = ({
  ageGroup,
  stage,
  isNext,
  isSummary
}) => {
  const content = [];

  if (!isNext) {
    const date = stage.endsAt ? ` on ${dayjs(stage.endsAt).format('YYYY/MM/DD @ h:mm A')}` : '';
    content.push(
      <Typography key="title" variant="subtitle1"><Bold>Current Stage:</Bold> Ice Time Sessions</Typography>,
    );
    content.push(<Box my={1} key="divider"><Divider/></Box>);
    content.push(
      <Typography key="endsAt">Waiting for ice times to end{date}</Typography>
    );
  }

  return <>{content}</>;
};

export default SessionStageHandler;
