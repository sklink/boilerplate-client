import React from 'react';

// Components
import SessionStageHandler from './session-stage-handler.component';
import GroupStageHandler from '../GroupStageHandler/group-stage-handler.component';

interface ISessionStageHandlerContainer {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  isSummary?: boolean;
}

const SessionStageHandlerContainer: React.FC<ISessionStageHandlerContainer> = ({
  stage,
  ageGroup,
  isNext,
  isSummary,
}) => {
  return <SessionStageHandler
    stage={stage}
    ageGroup={ageGroup}
    isNext={isNext}
    isSummary={isSummary}
  />;
};

export default SessionStageHandlerContainer;
