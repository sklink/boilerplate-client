import React from 'react';
import { gql, useQuery } from '@apollo/client';
import ReportCardContainer from './report-card-container';

const GET_REPORT_CARD = gql`
  query GetReportCard($code: String!, $playerAssessmentId: ID!) {
    player(code: $code) {
      firstName
      lastName
    }
    playerAssessment(code: $code, _id: $playerAssessmentId) {
      _id
      paymentRef
      hasReportCard
      assessment {
        name
        company {
          name
        }
      }
      position {
        _id
        name
      }
      contacts {
        email
      }
      ageGroup {
        _id
        name
        showReportPayment
        reportPrice
        skillSummaries {
          mean
          best
          skillId
        }
      }
      weightedScore
      skillSummaries {
        mean
        best
        skillId
      }
      categorySummaries {
        mean
        best
        weightCategoryId
      }
      bestSkillSummaries {
        mean
        best
        skillId
      }
    }
  }
`;

const GET_REPORT_CATEGORIES = gql`
    query GetReportCategories($ageGroupId: ID!, $positionId: ID!) {
      reportWeightCategories(ageGroupId: $ageGroupId, positionId: $positionId) {
        _id
        name
        skills {
          _id
          name
        }
      }
    }
`;

interface IReportCardGraphQL {
  code: string;
  playerAssessmentId: string;
}

const ReportCardGraphQL: React.FC<IReportCardGraphQL> = ({ code, playerAssessmentId }) => {
  const { data, loading, error } = useQuery(GET_REPORT_CARD, {
    variables: { code, playerAssessmentId },
    fetchPolicy: 'cache-and-network'
  });

  const playerAssessment = data && data.playerAssessment;
  const player = data && data.player;

  const { data: categoriesResult, loading: loadingCategories } = useQuery(GET_REPORT_CATEGORIES, {
    skip: !playerAssessment,
    variables: {
      ageGroupId: playerAssessment?.ageGroup._id,
      positionId: playerAssessment?.position._id
    },
    fetchPolicy: 'cache-and-network'
  });

  const categories = (categoriesResult && categoriesResult.reportWeightCategories) || [];

  return <ReportCardContainer
    player={player}
    playerAssessment={playerAssessment}
    code={code}
    loading={loading}
    loadingCategories={loadingCategories}
    categories={categories}
  />;
};

export default ReportCardGraphQL;
