import _ from 'lodash';
import React, { useState } from 'react';
import Select from 'react-select';

// Material UI
import Box from '@material-ui/core/Box';

// Component
import { FormInput, IFormOption } from '../../_core/_ui/forms.component';
import { EnhancedTable, IEnhancedTableRow } from '../../_core/_ui/table.components';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { toListSentence } from '../../../lib/helpers/conversion.helpers';
import ArchiveIcon from '@material-ui/icons/Archive';
import PlayerRankingReportGraphQL from '../../Report/PlayerRankingReport/player-ranking-report.graphql';
import SkillComparisonReportGraphQL from '../../Report/SkillComparisonReport/skill-comparison-report.graphql';
import { SectionWrapper, Spacer } from '../../_core/_ui/structure.components';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import SendIcon from '@material-ui/icons/Send';
import { buildSendEmails, getCountHasUnsentType } from '../../../lib/services/email-log.service';

const REPORT_OPTION_MAP: { [key: string]: IFormOption } = {
  PLAYER_RANKING: { value: 'PLAYER_RANKING', label: 'Player Ranking Report' },
  SKILL_REPORT: { value: 'SKILL_REPORT', label: 'Skill Report' }
};

const REPORT_OPTIONS = _.values(REPORT_OPTION_MAP);

interface IReports {
  ageGroupId: string;
  ageGroup?: IAgeGroup;
}

const REPORT_COMPONENTS: { [key: string]: any } = {
  RANKING: PlayerRankingReportGraphQL,
  SKILL: SkillComparisonReportGraphQL
}

const Reports: React.FC<IReports> = ({ ageGroupId, ageGroup }) => {
  const [sending, setSending] = useState(false);
  const { count, loading, refetch } = getCountHasUnsentType('REPORT_CARD', ageGroup?._id);
  const { sendEmails } = buildSendEmails();

  const handleSendReportCards = () => {
    if (window.confirm(`Are you sure you want to send report cards to the ${ageGroup?.name} age group?`)) {
      setSending(true);

      return sendEmails('REPORT_CARD', ageGroupId)
        .then(() => refetch())
        .then(() => setSending(false));
    }
  }

  const reportOptions: IFormOption[] = [
    { value: 'RANKING', label: 'Player Ranking' },
    { value: 'SKILL', label: 'Skill Comparison'}
  ];
  const [activeReportOption, setActiveReportOption] = useState(reportOptions[0]);
  const Component = REPORT_COMPONENTS[activeReportOption.value];

  return (
    <>
      {(count > 0 || loading) && (<Grid item xs={12}>
        <Box display="flex" alignItems="center" mb={2}>
          {loading && <Typography>Checking whether any players need to receive a report card...</Typography>}
          {!loading && count > 0 && <Typography>Send report cards to {loading ? '...' : count} players that have not received one</Typography>}
          <Spacer />
          <PrimaryButton disabled={loading || sending} endIcon={<SendIcon />} onClick={() => handleSendReportCards()}>Send Report Cards</PrimaryButton>
        </Box>
      </Grid>)}
      <Box mb={2}>
        <Select
          options={reportOptions}
          defaultValue={activeReportOption}
          onChange={option => option && setActiveReportOption(option)}
        />
      </Box>
      <SectionWrapper>
        <Component ageGroupId={ageGroupId} />
      </SectionWrapper>
    </>
  )
};

export default Reports;
