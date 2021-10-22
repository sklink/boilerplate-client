import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';
import { IFormOption } from '../../_core/_ui/forms.component';

// Components
import ManageItemsListContainer from '../../_core/ManageItemsList/manage-items-list.container';
import { Spacer } from '../../_core/_ui/structure.components';
import { SESSION_TERM } from '../../../lib/constants';

const GET_ASSESSMENT_SESSION_PLAYER_ASSESSMENT_LIST = gql`
  query GetAssessmentSessionPlayerAssessmentList($_id: ID!, $assessmentId: ID!, $ageGroupIds: [ID!]!) {
    assessmentSession(_id: $_id) {
      _id
      playerAssessments {
        _id
        player {
          firstName
          lastName
        }
        position {
          name
        }
        ageGroup {
          name
        }
      }
    }
    playerAssessments(assessmentId: $assessmentId, ageGroupIds: $ageGroupIds) {
      _id
      player {
        firstName
        lastName
      }
      position {
        name
      }
      ageGroup {
        name
      }
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

interface IAssessmentSessionPlayerAssessmentList {
  assessmentSessionId: string;
}

const AssessmentSessionPlayerAssessmentList: React.FC<IAssessmentSessionPlayerAssessmentList> = ({ assessmentSessionId }) => {
  const [sendNotification, setSendNotification] = useState(true);

  const user = getAuthUser();
  const { data, loading, error } = useQuery(GET_ASSESSMENT_SESSION_PLAYER_ASSESSMENT_LIST, {
    skip: !user,
    variables: {
      _id: assessmentSessionId,
      assessmentId: user?.settings.activeAssessmentId,
      ageGroupIds: user?.settings.activeAgeGroupIds
    },
    fetchPolicy: 'cache-and-network'
  });

  const playerAssessments: IPlayerAssessment[] = (data && data.playerAssessments) || [];
  const selectedPlayerAssessments = _.get(data, 'assessmentSession.playerAssessments', []);

  const [updateAssessmentSession] = useMutation(UPDATE_ASSESSMENT_SESSION_PLAYER_ASSESSMENTS);
  const handleAddPlayerAssessment = (playerAssessment: IPlayerAssessment) => {
    const nextPlayerAssessmentIds = [..._.map(selectedPlayerAssessments, '_id'), playerAssessment._id];

    return updateAssessmentSession({
      variables: {
        _id: assessmentSessionId,
        data: { playerAssessmentIds: nextPlayerAssessmentIds },
        notify: sendNotification
      },
      update: (cache, { data }) => {
        cache.modify({
          id: `AssessmentSession:${assessmentSessionId}`,
          fields: {
            playerAssessments: () => [...selectedPlayerAssessments, playerAssessment]
          }
        });
      }
    })
  };

  const handleRemovePlayerAssessment = (playerAssessment: IPlayerAssessment) => {
    if (window.confirm(`Are you sure you want to remove ${playerAssessment.player.firstName} ${playerAssessment.player.lastName} from this ${SESSION_TERM.toLowerCase()}?`)) {
      const nextPlayerAssessments = [...selectedPlayerAssessments];
      _.remove(nextPlayerAssessments, currPlayerAssessment => currPlayerAssessment._id === playerAssessment._id);
      const nextPlayerAssessmentIds = _.map(nextPlayerAssessments, '_id');

      return updateAssessmentSession({
        variables: {
          _id: assessmentSessionId,
          data: {playerAssessmentIds: nextPlayerAssessmentIds},
          notify: sendNotification
        },
        update: (cache, {data}) => {
          cache.modify({
            id: `AssessmentSession:${assessmentSessionId}`,
            fields: {
              playerAssessments: () => nextPlayerAssessments
            }
          });
        }
      });
    }
  };

  return (
    <div>
      <Box display="flex" alignItems="center" mb={2}>
        <FormControlLabel
          control={<Checkbox checked={sendNotification} onChange={() => setSendNotification(!sendNotification)} />}
          label="Send Ice Time Notification"
        />
        <Box mr={2}>
          <Tooltip title="Every player added or removed will receive a notification about the assignment">
            <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
          </Tooltip>
        </Box>
      </Box>
      <ManageItemsListContainer
        entity="player"
        options={playerAssessments}
        selectedItems={selectedPlayerAssessments}
        itemLabel={(item: IPlayerAssessment) => `${item.player.lastName}, ${item.player.firstName} - ${item.ageGroup.name} - ${item.position.name}`}
        addItem={handleAddPlayerAssessment}
      >
        {(playerAssessment: IPlayerAssessment) => (
          <ListItem key={playerAssessment._id}>
            <ListItemText
              primary={`${playerAssessment.player.lastName}, ${playerAssessment.player.firstName}`}
              secondary={`${playerAssessment.ageGroup.name}, ${playerAssessment.position.name}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemovePlayerAssessment(playerAssessment)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </ManageItemsListContainer>
    </div>
  );
};

export default AssessmentSessionPlayerAssessmentList;
