import _ from 'lodash';
import React from 'react';
import Select from 'react-select';
import dayjs from 'dayjs';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Component
import { FormInput, IFormOption } from '../../_core/_ui/forms.component';
import { EnhancedTable, IEnhancedTableColumn, IEnhancedTableRow } from '../../_core/_ui/table.components';
import { Spacer } from '../../_core/_ui/structure.components';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { getLastUpdated } from '../PlayerRankingReport/player-ranking-report.component';

const REPORT_OPTION_MAP: { [key: string]: IFormOption } = {
  PLAYER_RANKING: { value: 'PLAYER_RANKING', label: 'Player Ranking Report' },
  SKILL_REPORT: { value: 'SKILL_REPORT', label: 'Skill Report' }
};

const REPORT_OPTIONS = _.values(REPORT_OPTION_MAP);

interface ISkillComparisonReport {
  columns: IEnhancedTableColumn[];
  reportRows: IEnhancedTableRow[],
  loading: boolean;
  fetchError: boolean;
  exportReports: ClickHandler;
}

const SkillComparisonReport: React.FC<ISkillComparisonReport> = ({
  columns,
  reportRows,
  fetchError,
  loading,
  exportReports
}) => {
  const currLastUpdated = getLastUpdated();

  return (
    <>
      <Box mb={2} display="flex" alignItems="center">
        <Typography>Reports are automatically updated every 10 minutes (last updated at {currLastUpdated.format('h:mm A')})</Typography>
        <Spacer />
        <PrimaryButton onClick={exportReports}>Export Report</PrimaryButton>
      </Box>
      <EnhancedTable
        numCols={5}
        rows={reportRows}
        columns={columns}
        defaultOrder="rank"
        entityName="players"
        showError={fetchError}
        showLoading={loading && reportRows.length === 0}
        title="Skill Comparison"
      />
    </>
  );
};

export default SkillComparisonReport;
