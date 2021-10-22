import _ from 'lodash';
import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import ApproveGroupingsContainer from './approve-groupings.container';
import { getAuthUser } from '../../../lib/services/auth.service';
import { IFinalizeSessionFields, IFinalizeSessionProps } from './approve-groupings.interface';

const GET_APPROVE_GROUPINGS = gql`
  query GetApproveGroupings($assessmentId: ID!, $companyId: ID!, $ageGroupId: ID!, $includeGlobal: Boolean) {
    playerAssessments(assessmentId: $assessmentId, ageGroupIds: [$ageGroupId]) {
      _id
      isHeld
      isConcluded
      player {
        firstName
        lastName
      }
      position {
        name
      }
      weightedScore
    }
    drills(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
    practicePlans(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
    ageGroup(_id: $ageGroupId) {
      _id
      name
      currentStage {
        generateGroupPlan {
          sessionStage {
            _id
            config
          }
          sessionSets {
            session {
              _id
              location
              area
              address
              date
              start
            }
            group {
              _id
              position {
                name
              }
              player {
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  }
`;

const FINALIZE_GROUPINGS = gql`
  mutation FinalizeGroupStage($_id: ID!, $sessionSets: [IFinalizeSessionInput!]!) {
    finalizeGroupStage(_id: $_id, sessionSets: $sessionSets) {
      currentStage {
        type
        config
        endsAt
      }
      nextStage {
        type
        config
        isReady
      }
    }
  }
`;

interface IAgeGroupingsGraphQL {
  ageGroupId: string;
  stage: IAssessmentStage;
}

const ApproveGroupingsGraphQL: React.FC<IAgeGroupingsGraphQL> = ({ ageGroupId, stage }) => {
  const user = getAuthUser();
  const [finalizeGroupStage] = useMutation(FINALIZE_GROUPINGS);
  const { data, loading, error } = useQuery(GET_APPROVE_GROUPINGS, {
    skip: !user,
    variables: {
      assessmentId: user?.settings.activeAssessmentId,
      ageGroupId,
      companyId: user?.settings.activeCompanyId,
      includeGlobal: user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });

  let plans = _.get(data, 'ageGroup.currentStage.generateGroupPlan', []);
  plans = plans || [];

  const playerAssessments = (data && data.playerAssessments) || [];
  const drills = (data && data.drills) || [];
  const practicePlans = (data && data.practicePlans) || [];

  const handleFinalizeGruopStage = (sessionSets: IFinalizeSessionFields[]) => {
    const sessions: IFinalizeSessionProps[] = sessionSets.map(sessionSet => ({
      _id: sessionSet._id,
      stageId: sessionSet.stageId,
      playerAssessmentIds: _.map(sessionSet.playerAssessments, '_id'),
      drillIds: _.map(sessionSet.drills, '_id'),
      practicePlanIds: _.map(sessionSet.practicePlans, '_id')
    }));

    return finalizeGroupStage({
      variables: { _id: stage._id, sessionSets: sessions },
      update: (cache, { data }) => {
        cache.modify({
          id: `AgeGroup:${ageGroupId}`,
          fields: {
            currentStage: () => data.finalizeGroupStage.currentStage,
            nextStage: () => data.finalizeGroupStage.nextStage
          }
        });

        sessions.map(session => {
          cache.modify({
            id: `AssessmentSession:${session._id}`,
            fields: {
              playerCount: () => session.playerAssessmentIds.length
            }
          })
        });
      }
    });
  }

  return <ApproveGroupingsContainer
    plans={plans}
    playerAssessments={playerAssessments}
    drills={drills}
    practicePlans={practicePlans}
    finalize={handleFinalizeGruopStage}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default ApproveGroupingsGraphQL;
