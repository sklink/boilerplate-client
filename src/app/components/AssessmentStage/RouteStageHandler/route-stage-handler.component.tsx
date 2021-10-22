import React from 'react';
import { useHistory } from 'react-router';

// Material UI
import Typography from '@material-ui/core/Typography';
import { Bold } from '../../_core/_ui/typography.component';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

// Components
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import ApproveGroupingsGraphQL from '../ApproveGroupings/approve-groupings.graphql';
import ApproveRoutesGraphQL from '../ApproveRoutes/approve-routes.graphql';

interface IRouteStageHandler {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  isSummary?: boolean;
}

const RouteStageHandler: React.FC<IRouteStageHandler> = ({
  ageGroup,
  stage,
  isNext,
  isSummary
}) => {
  const history = useHistory();
  const content = [];

  console.log(stage);
  if (!isNext) {
    content.push(
      <Typography key="title" variant="subtitle1"><Bold>Current Stage:</Bold> Route Players</Typography>,
    );
    content.push(<Box my={1} key="divider"><Divider/></Box>);

    if (isSummary) {
      content.push(
        <PrimaryButton fullWidth onClick={() => history.push(`/age-group/${ageGroup._id}`)} key="review">Review & Approve
          Routes</PrimaryButton>
      );
    } else {
      content.push(<ApproveRoutesGraphQL ageGroupId={ageGroup._id} stage={stage} />);
    }
  } else {
    content.push(<Box mt={2}><Typography key="first" variant="subtitle1"><Bold>Next Stage:</Bold> Route Players</Typography></Box>);
  }

  return <>{content}</>;
};

export default RouteStageHandler;
