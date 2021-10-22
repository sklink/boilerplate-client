import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Material UI
import CheckInContainer from './check-in.container';
import { getAuthUser } from '../../../lib/services/auth.service';
import {
  buildAssignJersey, buildRemoveCheckedInPlayer,
} from '../../../lib/services/assessment-session.service';
import { getCurrMember } from '../../../lib/services/member.service';
import _ from 'lodash';
import { buildUpdatePlayerAssessment } from '../../../lib/services/player-assessment.service';
import Typography from '@material-ui/core/Typography';

const GET_CHECK_IN = gql`
  query GetCheckIn($assessmentSessionId: ID!) {
    assessmentSession(_id: $assessmentSessionId) {
      _id
      location
      area
      address
      date
      start
      assessmentId
      ageGroupId
      ageGroup {
        name
      }
      playerAssessments {
        _id
        player {
          firstName
          lastName
        }
        position {
          _id
          name
        }
        ageGroup {
          _id
        }
      }
      jerseys
      teams
      checkedInPlayerIds
    }
  }
`;

const GET_CHECK_IN_SELECTS = gql`
  query GetCheckInSelects($companyId: ID!, $assessmentId: ID!, $ageGroupId: ID!) {
    playerAssessments(assessmentId: $assessmentId, ageGroupIds: [$ageGroupId]) {
      _id
      player {
        firstName
        lastName
      }
      position {
        name
      }
    }
    positions(companyId: $companyId, includeGlobal: true) {
      _id
      name
    }
  }
`;

export const UPDATE_ASSESSMENT_SESSION_PLAYER_ASSESSMENTS = gql`
  mutation UpdateAssessmentSessionPlayerAssessments($_id: ID!, $data: UpdateAssessmentSessionInput!, $notify: Boolean) {
    updateAssessmentSession(_id: $_id, data: $data, notify: $notify) {
      _id
      playerAssessments {
        _id
        player {
          firstName
          lastName
        }
      }
    }
  }
`;

interface ICheckInGraphQL {
  assessmentSessionId: string;
}

const CheckInGraphQL: React.FC<ICheckInGraphQL> = ({ assessmentSessionId }) => {
  const user = getAuthUser();

  const { member } = getCurrMember();
  const { assignJersey } = buildAssignJersey();
  const { removeCheckedInPlayer } = buildRemoveCheckedInPlayer();
  const { updatePlayerAssessment } = buildUpdatePlayerAssessment();

  const { data, loading, error } = useQuery(GET_CHECK_IN, {
    variables: { assessmentSessionId },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const session = data && data.assessmentSession;

  const { data: selectData, loading: selectLoading, error: selectError } = useQuery(GET_CHECK_IN_SELECTS, {
    skip: !session,
    variables: {
      companyId: user?.settings.activeCompanyId,
      assessmentId: session?.assessmentId,
      ageGroupId: session?.ageGroupId
    },
    fetchPolicy: 'cache-and-network'
  });

  const positions = (selectData && selectData.positions) || [];
  const playerAssessments = (selectData && selectData.playerAssessments) || [];

  const [updateAssessmentSession] = useMutation(UPDATE_ASSESSMENT_SESSION_PLAYER_ASSESSMENTS, {
    context: {
      serializationKey: 'MUTATION',
      tracked: true,
    },
  });
  const handleAddPlayerAssessment = (playerAssessment: IPlayerAssessment) => {
    const nextPlayerAssessments = [...session?.playerAssessments || []];
    const nextPlayerAssessmentIds = [..._.map(nextPlayerAssessments, '_id'), playerAssessment._id];

    return updateAssessmentSession({
      variables: { _id: assessmentSessionId, data: { playerAssessmentIds: nextPlayerAssessmentIds }, notify: false },
      update: (cache, { data }) => {
        cache.modify({
          id: `AssessmentSession:${assessmentSessionId}`,
          fields: {
            playerAssessments: () => [...nextPlayerAssessments, playerAssessment]
          }
        });
      }
    });
  };

  const handleSaveTeams = (config: string[][]) => {
    return updateAssessmentSession({
      variables: { _id: assessmentSessionId, data: { teams: { config } } }
    });
  };

  const handleRemovePlayerAssessment = (playerAssessment: IPlayerAssessment) => {
    const nextPlayerAssessments = [...session?.playerAssessments || []];
    _.remove(nextPlayerAssessments, currPlayerAssessment => currPlayerAssessment._id === playerAssessment._id);
    const nextPlayerAssessmentIds = _.map(nextPlayerAssessments, '_id');

    return removeCheckedInPlayer(assessmentSessionId, playerAssessment._id)
      .then(() => updateAssessmentSession({
        variables: {_id: assessmentSessionId, data: {playerAssessmentIds: nextPlayerAssessmentIds}, notify: false},
        update: (cache, {data}) => {
          cache.modify({
            id: `AssessmentSession:${assessmentSessionId}`,
            fields: {
              playerAssessments: () => nextPlayerAssessments
            }
          });
        }
      }));
  };

  const handleUpdatePosition = (playerAssessment: IPlayerAssessment, positionId: string) =>
    updatePlayerAssessment(playerAssessment._id, { positionId });

  if (loading && !session) return <Typography>Loading...</Typography>;
  if (!session) return <Typography>Unable to check in players at this time. Please try again later</Typography>;

  return <CheckInContainer
    loading={loading}
    selectLoading={selectLoading}
    fetchError={Boolean(error) || Boolean(selectError)}
    session={session}
    positions={positions}
    playerAssessments={playerAssessments}
    assignJersey={assignJersey}
    removeCheckedInPlayer={removeCheckedInPlayer}
    member={member}
    removePlayer={handleRemovePlayerAssessment}
    addPlayer={handleAddPlayerAssessment}
    saveTeams={handleSaveTeams}
    updatePosition={handleUpdatePosition}
  />;
};

export default CheckInGraphQL;
