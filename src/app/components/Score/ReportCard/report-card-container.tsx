import _ from 'lodash';
import React, { useEffect, useState } from 'react';

// Components
import ReportCard from './report-card.component';

interface IReportCardContainer {
  player?: IPlayer;
  playerAssessment?: IPlayerAssessment;
  loading: boolean;
  loadingCategories: boolean;
  categories: IWeightCategory[];
  code: string;
}


const ReportCardContainer: React.FC<IReportCardContainer> = ({
  player,
  playerAssessment,
  loading,
  loadingCategories,
  categories,
  code
}) => {
  const [summaryBySkillId, setSummaryBySkillId] = useState<{ [key: string]: IScoreSummary }>({});
  const [bestSummaryBySkillId, setBestSummaryBySkillId] = useState<{ [key: string]: IScoreSummary }>({});
  const [summaryByCategoryId, setSummaryByCategoryId] = useState<{ [key: string]: IScoreSummary }>({});
  const [groupSummaryBySkillId, setGroupSummaryBySkillId] = useState<{ [key: string]: IScoreSummary }>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (playerAssessment) {
      setSummaryBySkillId(_.keyBy(playerAssessment.skillSummaries, 'skillId'));
      setBestSummaryBySkillId(_.keyBy(playerAssessment.bestSkillSummaries, 'skillId'));
      setSummaryByCategoryId(_.keyBy(playerAssessment.categorySummaries, 'weightCategoryId'));
      setGroupSummaryBySkillId(_.keyBy(playerAssessment.ageGroup.skillSummaries, 'skillId'));
    }
  }, [categories.length]);

  console.log(bestSummaryBySkillId);

  return <ReportCard
    player={player}
    playerAssessment={playerAssessment}
    loading={loading}
    loadingCategories={loadingCategories}
    summaryBySkillId={summaryBySkillId}
    bestSummaryBySkillId={bestSummaryBySkillId}
    summaryByCategoryId={summaryByCategoryId}
    groupSummaryBySkillId={groupSummaryBySkillId}
    categories={categories}
    code={code}
  />;
};

export default ReportCardContainer;
