import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

import SkillComparisonReport from './skill-comparison-report.component';
import { IEnhancedTableColumn, IEnhancedTableRow, StickyTableCell } from '../../_core/_ui/table.components';
import { numToTimeResult, toScore, toWeighted } from '../../../lib/helpers/conversion.helpers';
import TableCell from '@material-ui/core/TableCell';

interface ISkillComparisonReportContainer {
  skills: ISkill[];
  skillSummaries: IScoreSummary[];
  playerAssessments: IPlayerAssessment[];
  ageGroup?: IAgeGroup;
  fetchError: boolean;
  loading: boolean;
}

const REPORT_NAMES = {
  PLAYER_RANKING: 'PLAYER_RANKING',
  SKILL_REPORT: 'SKILL_REPORT'
};

const SkillComparisonReportContainer: React.FC<ISkillComparisonReportContainer> = ({
  skills,
  skillSummaries,
  playerAssessments,
  ageGroup,
  loading,
  fetchError
}) => {
  const [reportRows, setReportRows] = useState<IEnhancedTableRow[]>([]);
  const [reportColumns, setReportColumns] = useState<IEnhancedTableColumn[]>([]);

  useEffect(() => {
    const rankedPlayers = _.orderBy(playerAssessments, playerAssessment => playerAssessment.weightedScore, ['desc']);
    const nextReportRows: any[] = [];
    const skillsById = _.keyBy(skills, '_id');
    const skillSummariesByPlayer: { [key: string]: { [key: string]: IScoreSummary }} = _.reduce(skillSummaries, (result, skillSummary) => {
      _.set(result, [skillSummary.playerAssessmentId, skillSummary.skillId], skillSummary);

      return result;
    }, {});
    let activeSkillIds = _.map(skillSummaries, 'skillId');
    activeSkillIds = _.uniq(activeSkillIds);

    const nextColumns = [
      { key: 'name', label: '', sticky: true },
      { key: 'level', label: 'Level' },
      { key: 'team', label: 'Team' },
      { key: 'rank', label: 'Rank' },
      { key: 'weighted', label: 'Overall Score (Weighted)' },
    ];

    _.each(_.uniq(activeSkillIds), (skillId) => {
      nextColumns.push({ key: skillId, label: skillsById[skillId].name });
    });

    _.each(rankedPlayers, (playerAssessment, index) => {
      let weightedScore = '-';

      if (playerAssessment.weightedScore && playerAssessment.weightedScore !== '-') {
        weightedScore = toScore(playerAssessment.weightedScore || '-');
      }

      const data: { [key: string]: string | number } = {
        name: `${playerAssessment.player.lastName} ${playerAssessment.player.firstName}`,
        team: playerAssessment.team,
        level: playerAssessment.level,
        rank: index + 1,
        weightedScore,
      };

      _.each(activeSkillIds, (skillId) => {
        data[skillId] = Number(_.get(skillSummariesByPlayer, [playerAssessment._id, skillId, 'mean'], 0));
      });

      const eleSkills = _.map(activeSkillIds, (skillId) => {
        const currSummary = _.get(skillSummariesByPlayer, [playerAssessment._id, skillId]);
        const best =  _.round(Number(_.get(currSummary, 'best', 0)), 2);

        return (
          <TableCell key={skillId}>
            {currSummary && (<>
              <div>{_.round(Number(currSummary.mean), 2)}{currSummary.meanTime && `, ${numToTimeResult(currSummary.meanTime)}`}</div>
              <div>(Best: {best}{currSummary.bestTime && `, ${numToTimeResult(currSummary.bestTime)}`})</div>
            </>)}
            {!currSummary && '-'}
          </TableCell>
        );
      });

      nextReportRows.push({
        _id: playerAssessment._id,
        data: data,
        cells: [
          <StickyTableCell key="name">{playerAssessment.player?.lastName}, {playerAssessment.player?.firstName}</StickyTableCell>,
          <TableCell key="position">{playerAssessment.position.name}</TableCell>,
          <TableCell key="level">{playerAssessment.level}</TableCell>,
          <TableCell key="team">{playerAssessment.team}</TableCell>,
          <TableCell key="rank">{index + 1}</TableCell>,
          <TableCell key="weightedScore">{weightedScore}</TableCell>,
          ...eleSkills
        ]
      });
    });

    setReportRows(nextReportRows);
    setReportColumns(nextColumns);
  }, [playerAssessments.length]);

  const handleExportReport = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    exportReports({ ageGroupName: ageGroup?.name || '', reportRows, reportColumns, skillSummaries });
  }

  return <SkillComparisonReport
    exportReports={handleExportReport}
    columns={reportColumns}
    reportRows={reportRows}
    fetchError={fetchError}
    loading={loading}
  />;
};

interface IExportReports {
  ageGroupName: string;
  reportRows: IEnhancedTableRow[];
  reportColumns: IEnhancedTableColumn[];
  skillSummaries: IScoreSummary[];
}

function exportReports({ ageGroupName, reportColumns, reportRows, skillSummaries }: IExportReports) {
  let activeSkillIds = _.map(skillSummaries, 'skillId');
  activeSkillIds = _.uniq(activeSkillIds);

  let csvContent: string = 'data:text/csv;charset=utf-8,';
  let encodedURI;

  _.each(reportColumns, (reportColumn, index) => {
    if (reportColumn.key === 'name') {
      csvContent += 'Name';
    } else {
      csvContent += reportColumn.label;
    }

    if (index < reportColumns.length - 1) {
      csvContent += ',';
    }
  })
  csvContent += '\n';

  _.each(reportRows, ({ data }, index) => {
    let row = '';

    row = `"${data.name}",${data.level || ''},${data.team || ''},${data.rank},${toWeighted(data.weightedScore)}`;
    _.each(activeSkillIds, (skillId) => {
      row += `,"${data[skillId] === 0 ? '-' : _.round(data[skillId], 4)}"`;
    });

    csvContent += index < reportRows.length ? row + '\n' : row;
  });

  encodedURI = encodeURI(csvContent);

  let exportLink = document.createElement("a");
  exportLink.setAttribute("href", encodedURI);
  exportLink.setAttribute("download", `skill-comparison-${ageGroupName}.csv`);
  exportLink.setAttribute("target", "_blank");
  document.body.appendChild(exportLink); // Required for FF

  exportLink.click();

  return false;
}

export default SkillComparisonReportContainer;
