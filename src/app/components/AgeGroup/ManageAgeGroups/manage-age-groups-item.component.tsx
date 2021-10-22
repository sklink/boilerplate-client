import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Components
import GroupStageHandlerGraphQL from '../../AssessmentStage/GroupStageHandler/group-stage-handler.graphql';
import SessionStageHandlerGraphQL from '../../AssessmentStage/SessionStageHandler/session-stage-handler.graphql';
import { Spacer } from '../../_core/_ui/structure.components';
import { OutlineButton } from '../../_core/_ui/buttons.component';
import RouteStageHandlerGraphQL from '../../AssessmentStage/RouteStageHandler/route-stage-handler.graphql';

interface IManageAgeGroupsItem {
  ageGroup: IAgeGroup;
  activateAgeGroup: Function;
}

const HANDLERS: { [key: string]: React.FC<any> } = {
  GROUP: GroupStageHandlerGraphQL,
  SESSION: SessionStageHandlerGraphQL,
  ROUTE: RouteStageHandlerGraphQL
};

const ManageAgeGroupsItem: React.FC<IManageAgeGroupsItem> = ({
  ageGroup,
  activateAgeGroup
}) => {
  const history = useHistory();
  const CurrStageComponent = ageGroup.currentStage && HANDLERS[ageGroup.currentStage.type];
  const NextStageComponent = ageGroup.nextStage && HANDLERS[ageGroup.nextStage.type];
  const nextStage = ageGroup.nextStage;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" alignItems="center">
        <Typography variant="h6">{ageGroup.name}</Typography>
        <Spacer />
        {ageGroup.currentStageNum !== 0 && <OutlineButton onClick={() => history.push(`/reports/${ageGroup._id}`)}>Reports</OutlineButton>}
        {nextStage?.order === 1 && <OutlineButton onClick={() => activateAgeGroup(ageGroup._id)}>Activate Assessment</OutlineButton>}
      </Box>
      {!ageGroup.currentStage && !ageGroup.nextStage && (
        <Typography>Next schedule stage is not set up. <Link to="/format">Create a schedule format</Link></Typography>
      )}
      {ageGroup.currentStage && <CurrStageComponent isSummary stage={ageGroup.currentStage} ageGroup={ageGroup} />}
      {ageGroup.nextStage && <NextStageComponent isSummary isNext stage={ageGroup.nextStage} ageGroup={ageGroup} />}
    </Box>
  );
};

export default ManageAgeGroupsItem;
