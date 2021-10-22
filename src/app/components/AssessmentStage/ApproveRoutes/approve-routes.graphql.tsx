import _ from 'lodash';
import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import ApproveRoutesContainer from './approve-routes.container';
import { getAuthUser } from '../../../lib/services/auth.service';
import {
  IFinalizeRouteProps,
  IFinalizeSessionFields,
  IFinalizeSessionProps
} from './approve-routes.interface';

const GET_APPROVE_GROUPINGS = gql`
  query GetApproveGroupings($assessmentId: ID!, $ageGroupId: ID!) {
    playerAssessments(assessmentId: $assessmentId, ageGroupIds: [$ageGroupId]) {
      _id
      player {
        firstName
        lastName
      }
      position {
        name
      }
      weightedScore
    }
    ageGroup(_id: $ageGroupId) {
      _id
      name
      currentStage {
        generateRoutePlan {
          action
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
`;

const FINALIZE_GROUPINGS = gql`
  mutation FinalizeRouteStage($_id: ID!, $routes: [IFinalizeRouteGroup!]!) {
    finalizeRouteStage(_id: $_id, routes: $routes) {
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

const ApproveRoutesGraphQL: React.FC<IAgeGroupingsGraphQL> = ({ ageGroupId, stage }) => {
  const user = getAuthUser();
  const [finalizeRouteStage] = useMutation(FINALIZE_GROUPINGS);
  const { data, loading, error } = useQuery(GET_APPROVE_GROUPINGS, {
    skip: !user,
    variables: {
      assessmentId: user?.settings.activeAssessmentId,
      ageGroupId,
    },
    fetchPolicy: 'cache-and-network'
  });

  let routes = _.get(data, 'ageGroup.currentStage.generateRoutePlan', []);
  routes = routes || [];

  const playerAssessments = (data && data.playerAssessments) || [];

  const handleFinalizeRouteStage = (routes: { [key: string]: IPlayerAssessment[] }) => {
    const routeResults: IFinalizeRouteProps[] = _.map(routes, (playerAssessments, action) => ({
      action,
      playerAssessmentIds: _.map(playerAssessments, '_id'),
    }));

    return finalizeRouteStage({
      variables: { _id: stage._id, routes: routeResults },
      update: (cache, { data }) => {
        cache.modify({
          id: `AgeGroup:${ageGroupId}`,
          fields: {
            currentStage: () => data.finalizeRouteStage.currentStage,
            nextStage: () => data.finalizeRouteStage.nextStage
          }
        });
      }
    });
  }

  return <ApproveRoutesContainer
    routes={routes}
    playerAssessments={playerAssessments}
    finalize={handleFinalizeRouteStage}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default ApproveRoutesGraphQL;
