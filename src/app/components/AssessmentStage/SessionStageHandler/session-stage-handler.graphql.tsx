import React from 'react';

// Components
import SessionStageHandlerContainer from './session-stage-handler.container';

interface ISessionStageHandlerGraphQL {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  isSummary?: boolean
}

const SessionStageHandlerGraphQL: React.FC<ISessionStageHandlerGraphQL> = ({
  stage,
  ageGroup,
  isNext,
  isSummary
}) => {
  return <SessionStageHandlerContainer
    stage={stage}
    isNext={isNext}
    isSummary={isSummary}
    ageGroup={ageGroup}
  />;
};

export default SessionStageHandlerGraphQL;
