import React from 'react';

// Components
import GroupStageHandlerContainer from './group-stage-handler.container';
import { getPositions } from '../../../lib/services/position.service';

interface IGroupStageHandlerGraphQL {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  isSummary?: boolean
}

const GroupStageHandlerGraphQL: React.FC<IGroupStageHandlerGraphQL> = ({
  stage,
  ageGroup,
  isNext,
  isSummary
}) => {
  const { positions } = getPositions(true);

  return <GroupStageHandlerContainer
    stage={stage}
    isNext={isNext}
    isSummary={isSummary}
    ageGroup={ageGroup}
    positions={positions}
  />;
};

export default GroupStageHandlerGraphQL;
