import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

import PlayerRankingReport from './player-ranking-report.component';
import { toWeighted } from '../../../lib/helpers/conversion.helpers';

interface IPlayerRankingReportContainer {
  playerAssessments: IPlayerAssessment[];
  ageGroup?: IAgeGroup;
  fetchError: boolean;
  loading: boolean;
  assignLevel: Function;
  assignTeam: Function;
}

const REPORT_NAMES = {
  PLAYER_RANKING: 'PLAYER_RANKING',
  SKILL_REPORT: 'SKILL_REPORT'
};

const PlayerRankingReportContainer: React.FC<IPlayerRankingReportContainer> = ({
  playerAssessments,
  ageGroup,
  loading,
  fetchError,
  assignLevel,
  assignTeam
}) => {
  const [selected, setSelected] = useState<IPlayerAssessment[]>([]);
  const [level, setLevel] = useState<string>('');
  const [team, setTeam] = useState<string>('');
  const [rankedPlayerAssessments, setRankedPlayerAssessments] = useState<IPlayerAssessment[]>([]);

  useEffect(() => {
    setRankedPlayerAssessments(_.orderBy(playerAssessments, playerAssessment => playerAssessment.weightedScore, ['desc']));
  }, [playerAssessments]);

  const handleExportReports = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    exportReports({ ageGroupName: ageGroup?.name || '', playerAssessments: rankedPlayerAssessments });
  }

  const handleAssignLevel = () => {
    assignLevel(_.map(selected, '_id'), level);
    setLevel('');
    setSelected([]);
  };

  const handleAssignTeam = () => {
    assignTeam(_.map(selected, '_id'), team);
    setTeam('');
    setSelected([]);
  };

  return <PlayerRankingReport
    ageGroup={ageGroup}
    level={level}
    setLevel={setLevel}
    assignLevel={handleAssignLevel}
    team={team}
    setTeam={setTeam}
    assignTeam={handleAssignTeam}
    selected={selected}
    setSelected={setSelected}
    exportReports={handleExportReports}
    playerAssessments={rankedPlayerAssessments}
    fetchError={fetchError}
    loading={loading}
  />;
};

interface IExportReports {
  ageGroupName: string;
  playerAssessments: IPlayerAssessment[];
}

function exportReports({ ageGroupName, playerAssessments }: IExportReports) {
  let csvContent: string = 'data:text/csv;charset=utf-8,';
  let encodedURI;
  csvContent += 'Rank,Level,Team,Overall Score,Player Last Name,Player First Name,Position,Contact Name,Contact Email,Contact Phone\n';

  _.each(playerAssessments, (playerAssessment, index) => {
    let row = '';

    row = `${index + 1},${playerAssessment.level || ''},${playerAssessment.team || ''},${toWeighted(playerAssessment.weightedScore)},${playerAssessment.player.lastName},${playerAssessment.player.firstName},${playerAssessment.position.name}`;
    _.each(playerAssessment.contacts, (contact) => {
      row += `,${contact.name},${contact.email},${contact.phone}`;
    });

    csvContent += index < playerAssessments.length ? row + '\n' : row;
  });

  encodedURI = encodeURI(csvContent);

  let exportLink = document.createElement("a");
  exportLink.setAttribute("href", encodedURI);
  exportLink.setAttribute("download", `player-rankings-${ageGroupName}.csv`);
  exportLink.setAttribute("target", "_blank");
  document.body.appendChild(exportLink); // Required for FF

  exportLink.click();

  return false;
}

export default PlayerRankingReportContainer;
