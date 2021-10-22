import _ from 'lodash';
import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { nanoid } from 'nanoid';

// Components
import ManageEvaluationsContainer from './manage-evaluations.container';
import { IRecordScoreInput } from './manage-evaluations.interface';
import { createCacheModifier, removeCacheModifier } from '../../../lib/cache/basic.cache';
import { CREATE_SCORE_FIELDS } from '../../../lib/queries/score.queries';
import { getCurrMember } from '../../../lib/services/member.service';
import { DRILL_FIELDS } from '../../../lib/queries/drill.queries';

// Data
const GET_MANAGE_EVALUATIONS = gql`
  query GetManageEvaluations($assessmentSessionId: ID!) {
    assessmentSession(_id: $assessmentSessionId) {
      _id
      location
      area
      address
      date
      start
      assessmentId
      ageGroup {
        _id
        name
      }
      practicePlans {
        drills {
          _id
          name
          skillSets {
            positionIds
            skills {
              _id
              name
              type
              options
            }
          }
        }
      }
      drills {
        _id
        name
        skillSets {
          positionIds
          skills {
            _id
            name
            type
            options
          }
        }
      }
      checkedInPlayers {
        _id
        position {
          _id
          name
        }
        ageGroup {
          _id
        }
      }
      jerseys
    }
    evaluationScores(assessmentSessionId: $assessmentSessionId) {
      _id
      raw
      type
      playerAssessmentId
      drillId
      skillId
      round
    }
  }
`;

const RECORD_SCORE = gql`
  mutation RecordScore($data: RecordScoreInput!) {
    recordScore(data: $data) {
      ...CreateScoreFields
    }
  }

  ${CREATE_SCORE_FIELDS}
`;

const REMOVE_SCORE = gql`
  mutation RemoveScore($_id: ID!) {
    removeScore(_id: $_id) {
      _id
    }
  }
`;

interface IManageEvaluationsGraphQL {
  assessmentSessionId: string;
}

const ManageEvaluationsGraphQL: React.FC<IManageEvaluationsGraphQL> = ({ assessmentSessionId }) => {
  const { member } = getCurrMember();
  const { data, loading, error, ...rest } = useQuery(GET_MANAGE_EVALUATIONS, {
    variables: { assessmentSessionId },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const session = data && data.assessmentSession;
  const players = (data && data.assessmentSession.checkedInPlayers) || [];
  const jerseys = (data && data.assessmentSession.jerseys) || {};
  const scores = (data && data.evaluationScores) || [];
  let drills = (data && data.assessmentSession.drills) || [];
  let practicePlans = (data && data.assessmentSession.practicePlans) || [];

  practicePlans.forEach((plan: IPracticePlan) => {
    drills = drills.concat(plan.drills || []);
  });
  drills = _.uniqBy(drills, '_id');

  const [removeScoreMutation] = useMutation(REMOVE_SCORE, {
    context: {
      serializationKey: 'MUTATION',
      tracked: true,
    },
  });

  const handleRemoveScore = (_id: string) => {
    return removeScoreMutation({
      variables: { _id },
      update: cache => {
        cache.modify({
          fields: {
            evaluationScores: removeCacheModifier(cache, _id)
          }
        });
      },
      optimisticResponse: {
        removeScore: {
          __typename: 'DeleteResponse',
          _id
        }
      }
    });
  };

  const [recordScoreMutation] = useMutation(RECORD_SCORE, {
    context: {
      serializationKey: 'MUTATION',
      tracked: true,
    },
  });
  const handleRecordScore = (data: IRecordScoreInput) => {
    return recordScoreMutation({
      variables: { data },
      update: (cache, { data: resultData }) => {
        if (resultData) {
          const currDoc = resultData.recordScore;

          if (data._id) {
            cache.writeFragment({
              id: `Score:${data._id}`,
              fragment: gql`
                fragment ScoreRaw on Score {
                  raw
                }
              `,
              data: {
                raw: data.raw
              }
            })
          } else {

            cache.modify({
              fields: {
                evaluationScores: createCacheModifier({
                  cache,
                  createdDoc: currDoc,
                  fragment: CREATE_SCORE_FIELDS,
                  fragmentName: 'CreateScoreFields',
                  modelName: 'Score'
                })
              }
            });
          }
        }
      },
      optimisticResponse: {
        recordScore: {
          __typename: 'Score',
          _id: data._id || nanoid(),
          ...data
        }
      }
    })
  };

  return <ManageEvaluationsContainer
    session={session}
    drills={drills}
    players={players}
    jerseys={jerseys}
    scores={scores}
    member={member}
    recordScore={handleRecordScore}
    removeScore={handleRemoveScore}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default ManageEvaluationsGraphQL;
