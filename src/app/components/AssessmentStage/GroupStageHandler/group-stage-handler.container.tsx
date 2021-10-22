import React, { useEffect, useState } from 'react';

// Components
import GroupStageHandler from './group-stage-handler.component';

interface IGroupStageHandlerContainer {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  isSummary?: boolean;
  positions: IPosition[];
}

const GroupStageHandlerContainer: React.FC<IGroupStageHandlerContainer> = ({
  stage,
  ageGroup,
  isNext,
  isSummary,
  positions
}) => {
  const [positionHash, setPositionHash] = useState({});

  useEffect(() => {
    const nextPositionHash: { [key: string]: string } = {};

    positions.forEach(position => {
      nextPositionHash[position._id] = position.name;
    });

    setPositionHash(nextPositionHash);
  }, [positions]);

  return <GroupStageHandler
    stage={stage}
    ageGroup={ageGroup}
    isNext={isNext}
    isSummary={isSummary}
    positionHash={positionHash}
  />;
};

export default GroupStageHandlerContainer;
