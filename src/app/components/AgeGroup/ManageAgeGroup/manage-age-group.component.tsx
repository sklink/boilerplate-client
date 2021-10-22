import React from 'react';
import { PageTitle } from '../../_core/_ui/typography.component';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import GroupStageHandlerGraphQL from '../../AssessmentStage/GroupStageHandler/group-stage-handler.graphql';
import SessionStageHandlerGraphQL from '../../AssessmentStage/SessionStageHandler/session-stage-handler.graphql';
import RouteStageHandlerGraphQL from '../../AssessmentStage/RouteStageHandler/route-stage-handler.graphql';

interface IManageAgeGroup {
  ageGroup: IAgeGroup;
  loading: boolean;
  fetchError: boolean;
}

const HANDLERS: { [key: string]: React.FC<any> } = {
  GROUP: GroupStageHandlerGraphQL,
  SESSION: SessionStageHandlerGraphQL,
  ROUTE: RouteStageHandlerGraphQL
};

const ManageAgeGroup: React.FC<IManageAgeGroup> = ({
  ageGroup,
  loading,
  fetchError
}) => {
  if (loading && !ageGroup) return <Typography>Loading...</Typography>;
  if (fetchError && !ageGroup) return <Typography>Unable to manage age groups at this time. Please try again later</Typography>;
  const CurrStageComponent = ageGroup.currentStage && HANDLERS[ageGroup.currentStage.type];
  const NextStageComponent = ageGroup.nextStage && HANDLERS[ageGroup.nextStage.type];

  return (
    <div>
      <PageTitle>{ageGroup.name}</PageTitle>
      {!ageGroup.currentStage && !ageGroup.nextStage && (
        <Typography>Next schedule stage is not set up. <Link to="/format">Create a schedule format</Link></Typography>
      )}
      {ageGroup.currentStage && <CurrStageComponent stage={ageGroup.currentStage} ageGroup={ageGroup} />}
      {ageGroup.nextStage && <NextStageComponent isNext stage={ageGroup.nextStage} ageGroup={ageGroup} />}
    </div>
  );
};

export default ManageAgeGroup;
