import React from 'react';

// Components
import RouteStageHandlerContainer from './route-stage-handler.container';
import SessionStageHandlerContainer from '../SessionStageHandler/session-stage-handler.container';

interface IRouteStageHandlerGraphQL {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  isSummary?: boolean
}

const RouteStageHandlerGraphQL: React.FC<IRouteStageHandlerGraphQL> = ({
  stage,
  ageGroup,
  isNext,
  isSummary
}) => {
  return <RouteStageHandlerContainer
    stage={stage}
    isNext={isNext}
    isSummary={isSummary}
    ageGroup={ageGroup}
  />;
};

export default RouteStageHandlerGraphQL;
