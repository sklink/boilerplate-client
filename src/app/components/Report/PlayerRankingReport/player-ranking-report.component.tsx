import _ from 'lodash';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ViewIcon from '@material-ui/icons/Visibility';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

// Component
import { FormInput, FormLabel, IFormOption } from '../../_core/_ui/forms.component';
import { EnhancedTable, IEnhancedTableRow } from '../../_core/_ui/table.components';
import { toScore } from '../../../lib/helpers/conversion.helpers';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { Spacer } from '../../_core/_ui/structure.components';
import { makeVar, useReactiveVar } from '@apollo/client';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import { buildSendEmails, getCountHasUnsentType } from '../../../lib/services/email-log.service';

const REPORT_OPTION_MAP: { [key: string]: IFormOption } = {
  PLAYER_RANKING: { value: 'PLAYER_RANKING', label: 'Player Ranking Report' },
  SKILL_REPORT: { value: 'SKILL_REPORT', label: 'Skill Report' }
};

const REPORT_OPTIONS = _.values(REPORT_OPTION_MAP);

interface IPlayerRankingReport {
  loading: boolean;
  fetchError: boolean;
  playerAssessments: IPlayerAssessment[];
  exportReports: ClickHandler;
  selected: IPlayerAssessment[];
  setSelected: Function;
  level: string;
  setLevel: Function;
  assignLevel: ClickHandler;
  ageGroup?: IAgeGroup;
  team: string;
  setTeam: Function;
  assignTeam: ClickHandler;
}

const now = dayjs();
const lastUpdated = makeVar(now.subtract(now.get('minute') % 10 % 5, 'minute'));
export const getLastUpdated = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useReactiveVar(lastUpdated);

setInterval(() => {
  const now = dayjs();
  lastUpdated(now.subtract(now.get('minute') % 10 % 5, 'minute'));
}, 60 * 1000);

const PlayerRankingReport: React.FC<IPlayerRankingReport> = ({
  fetchError,
  loading,
  playerAssessments,
  exportReports,
  selected,
  setSelected,
  level,
  setLevel,
  assignLevel,
  team,
  setTeam,
  assignTeam,
  ageGroup
}) => {
  const playersWithLevel: any = _.filter(playerAssessments, playerAssessment => playerAssessment.level);
  const levelPlayerAssessmentIds = _.map(playersWithLevel, '_id');
  const playersWithTeam: any = _.filter(playerAssessments, playerAssessment => playerAssessment.team);
  const teamPlayerAssessmentIds = _.map(playersWithTeam, '_id');

  const { count: countLevel, loading: loadingLevelEmail, refetch: refetchLevelEmail } = getCountHasUnsentType('LEVEL_ASSIGNMENT', ageGroup?._id, levelPlayerAssessmentIds);
  const [sendingLevel, setSendingLevel] = useState(false);
  const { count: countTeam, loading: loadingTeamEmail, refetch: refetchTeamEmail } = getCountHasUnsentType('TEAM_ASSIGNMENT', ageGroup?._id, teamPlayerAssessmentIds);
  const [sendingTeam, setSendingTeam] = useState(false);
  const { sendEmails } = buildSendEmails();

  const currUpdateValue = getLastUpdated();
  const history = useHistory();
  const rows: IEnhancedTableRow[] = [];

  const handleSendLevel = () => {
    setSendingLevel(true);

    return sendEmails('LEVEL_ASSIGNMENT', ageGroup?._id)
      .then(() => refetchLevelEmail())
      .then(() => setSendingLevel(false));
  }

  const handleSendTeam = () => {
    setSendingTeam(true);

    return sendEmails('TEAM_ASSIGNMENT', ageGroup?._id)
      .then(() => refetchTeamEmail())
      .then(() => setSendingTeam(false));
  }

  _.each(playerAssessments, (playerAssessment: IPlayerAssessment, index) => {
    let weightedScore = '-';

    if (playerAssessment.weightedScore && playerAssessment.weightedScore !== '-') {
      weightedScore = toScore(playerAssessment.weightedScore || '-');
    }

    rows.push({
      _id: playerAssessment._id,
      data: playerAssessment,
      cells: [
        <TableCell key="name">{playerAssessment.player?.lastName}, {playerAssessment.player?.firstName}</TableCell>,
        <TableCell key="position">{playerAssessment.position?.name}</TableCell>,
        <TableCell key="attendance">{playerAssessment.attendanceCount}</TableCell>,
        <TableCell key="rank">{index + 1}</TableCell>,
        <TableCell key="weight">{weightedScore}</TableCell>,
        <TableCell key="level">{playerAssessment.level}</TableCell>,
        <TableCell key="level">{playerAssessment.team}</TableCell>,
        <TableCell key="edit" padding="checkbox">
          <Tooltip title="View Score Breakdown (Bottom of Player Page)">
            <IconButton onClick={() => history.push(`/players/${playerAssessment.player._id}/${playerAssessment._id}`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </TableCell>,
        <TableCell key="report" padding="checkbox">
          <Tooltip title="View Report Card">
            <IconButton onClick={() => history.push(`/report-card/${playerAssessment.player.code}/${playerAssessment._id}`)}>
              <AssignmentTurnedInIcon />
            </IconButton>
          </Tooltip>
        </TableCell>,
      ]
    });
  });

  const columns = [
    { key: 'name', label: 'Name', path: 'player.lastName' },
    { key: 'position', label: 'Position', path: 'position.name' },
    { key: 'attendanceCount', label: '# Attended' },
    { key: 'rank', label: 'Rank' },
    { key: 'weighted', label: 'Overall Score (Weighted)' },
    { key: 'level', label: 'Level' },
    { key: 'team', label: 'Team' },
    { key: 'edit', disableSort: true, width: '60px', disablePadding: true },
    { key: 'report', disableSort: true, width: '60px', disablePadding: true }
  ];

  return (
    <>
      <Box mb={2} display="flex" alignItems="center">
        <Typography>Reports are automatically updated every 10 minutes (last updated at {currUpdateValue.format('h:mm A')})</Typography>
        <Spacer />
        <PrimaryButton onClick={exportReports}>Export with Contact Info</PrimaryButton>
      </Box>
      {(countLevel > 0 || loadingLevelEmail) && (
        <Box display="flex" alignItems="center" mb={2}>
          {loadingLevelEmail && <Typography>Checking whether any players need to receive a level notification...</Typography>}
          {!loadingLevelEmail && countLevel > 0 && <Typography>Send level notifications to {loadingLevelEmail ? '...' : countLevel} players that have not received one</Typography>}
          <Spacer />
          <PrimaryButton disabled={loadingLevelEmail || sendingLevel} endIcon={<SendIcon />} onClick={() => handleSendLevel()}>Send Level Emails</PrimaryButton>
        </Box>
      )}
      {(countTeam > 0 || loadingTeamEmail) && (
        <Box display="flex" alignItems="center" mb={2}>
          {loadingTeamEmail && <Typography>Checking whether any players need to receive a team notification...</Typography>}
          {!loadingTeamEmail && countTeam > 0 && <Typography>Send team notifications to {loadingTeamEmail ? '...' : countTeam} players that have not received one</Typography>}
          <Spacer />
          <PrimaryButton disabled={loadingTeamEmail || sendingTeam} endIcon={<SendIcon />} onClick={() => handleSendTeam()}>Send Team Emails</PrimaryButton>
        </Box>
      )}
      <EnhancedTable
        selected={selected}
        setSelected={setSelected}
        numCols={columns.length}
        rows={rows}
        columns={columns}
        defaultOrder="rank"
        entityName="players"
        showError={fetchError}
        showLoading={loading && rows.length === 0}
        checkboxTitle="Assign"
        title="Player Rankings"
        selectedAction={(
          <Box display="flex" p={2} style={{ height: '72px' }}>
              <FormInput type="text" placeholder="Level Placement" onKeyUp={(e: any) => setLevel(e.currentTarget.value)} />
              <PrimaryButton
                disabled={!level || level.length === 0}
                style={{ minWidth: '200px', marginLeft: '16px' }}
                onClick={assignLevel}
              >Assign Level</PrimaryButton>
            <Box mr={4} />
            <FormInput type="text" placeholder="Team Placement" onKeyUp={(e: any) => setTeam(e.currentTarget.value)} />
            <PrimaryButton
              disabled={!team || team.length === 0}
              style={{ minWidth: '200px', marginLeft: '16px' }}
              onClick={assignTeam}
            >Assign Team</PrimaryButton>
          </Box>
        )}
      />
    </>
  );
};

export default PlayerRankingReport;
