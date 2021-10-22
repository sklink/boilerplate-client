import React from 'react';

// Components
import RouteStageHandler from './route-stage-handler.component';
import SessionStageHandler from '../SessionStageHandler/session-stage-handler.component';

interface IRouteStageHandlerContainer {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  isSummary?: boolean;
}

const RouteStageHandlerContainer: React.FC<IRouteStageHandlerContainer> = ({
  stage,
  ageGroup,
  isNext,
  isSummary,
}) => {
  return <RouteStageHandler
    stage={stage}
    ageGroup={ageGroup}
    isNext={isNext}
    isSummary={isSummary}
  />;
};

export default RouteStageHandlerContainer;
