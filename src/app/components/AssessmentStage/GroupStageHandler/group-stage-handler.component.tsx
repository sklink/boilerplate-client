import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Material UI
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

// Data
import { SESSION_TERM, SESSIONS_TERM } from '../../../lib/constants';
import { numToTime, toListSentence } from '../../../lib/helpers/conversion.helpers';
import { Bold } from '../../_core/_ui/typography.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import ApproveGroupingsGraphQL from '../ApproveGroupings/approve-groupings.graphql';

dayjs.extend(utc)
dayjs.extend(timezone)

interface IGroupStageHandler {
  stage: IAssessmentStage;
  ageGroup: IAgeGroup;
  isNext?: boolean;
  positionHash: { [key: string]: string };
  isSummary?: boolean;
}

const GroupStageHandler: React.FC<IGroupStageHandler> = ({
  ageGroup,
  stage,
  isNext,
  positionHash,
  isSummary
}) => {
  const history = useHistory();

  let isInvalid = false;
  const content = [];

  if (isNext) {
    if (stage.order !== 1) {
      content.push(<Box mt={2}><Typography key="first" variant="subtitle1"><Bold>Next Stage:</Bold> Group Players</Typography></Box>);
    }

    return <>{content}</>;
  }

  content.push(
    <Typography key="title" variant="subtitle1"><Bold>Current Stage:</Bold> Group Players</Typography>,
  );

  content.push(<Box my={1} key="divider"><Divider /></Box>);
  if (!ageGroup.numPlayers) {
    isInvalid = true;
    content.push(<Typography key="players">Missing players. <Link to="/players">Add some here</Link></Typography>);
  }

  if (!ageGroup.numSessions) {
    isInvalid = true;
    content.push(<Typography key="sessions">Missing {SESSIONS_TERM.toLowerCase()}. <Link to="/sessions">Add some here</Link></Typography>);
  }

  if (!isInvalid && stage.isReady?.noSessions) {
    isInvalid = true;
    content.push(
      <Typography key="no-configs">
        No {SESSION_TERM.toLowerCase()} format found following this grouping. <Link to="/format">Add some here</Link>
      </Typography>
    );
  }

  if (!isInvalid && stage.isReady?.numFound < stage.isReady?.numRequired) {
    const playerLimits = stage.config.playerLimits.map((playerLimit: IPlayerLimit) => {
      const positionNames = playerLimit.positions.map(positionId => positionHash[positionId]);

      return `${toListSentence(positionNames)} to ${playerLimit.limit}`;
    });
    const { numFound, numRequired, sessionNum, afterDate, afterEnd } = stage.isReady;
    isInvalid = true;

    content.push(
      <Typography key="missing-sessions">
        {stage.config.playerLimits.length && <>Based on player limits of: <Bold>{toListSentence(playerLimits)}</Bold>, you</>}
        {stage.config.playerLimits.length === 0 && 'You'} need <Bold>{numRequired}</Bold> {SESSIONS_TERM.toLowerCase()} scheduled&nbsp;
        <Bold>after {afterDate ? `${afterDate} at ${numToTime(afterEnd)}` : 'now'}</Bold>.
        We only found <Bold>{numFound}</Bold> for <Bold>{SESSION_TERM} Configuration #{sessionNum}</Bold>. <Link to="/sessions">Add more here</Link>
      </Typography>
    );
  }

  if (!isInvalid) {
    if (stage.config.manualApproval) {
      if (isSummary) {
        content.push(
          <PrimaryButton fullWidth onClick={() => history.push(`/age-group/${ageGroup._id}`)} key="review">Review & Approve
            Groupings</PrimaryButton>
        );
      } else {
        content.push(<ApproveGroupingsGraphQL ageGroupId={ageGroup._id} stage={stage} />);
      }
    } else {
      content.push(<Typography>Automated scheduling is not enabled. Please contact your account manager for assistance</Typography>);
    }
  }

  return <Box mt={2}>{content}</Box>;
};

export default GroupStageHandler;
