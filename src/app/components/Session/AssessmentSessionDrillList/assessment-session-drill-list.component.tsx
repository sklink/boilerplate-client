import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';
import { IFormOption } from '../../_core/_ui/forms.component';

// Components
import ManageItemsListContainer from '../../_core/ManageItemsList/manage-items-list.container';
import { Simulate } from 'react-dom/test-utils';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const GET_ASSESSMENT_SESSION_DRILL_LIST = gql`
  query GetAssessmentSessionDrillList($_id: ID!, $companyId: ID!, $includeGlobal: Boolean) {
    assessmentSession(_id: $_id) {
      _id
      drills {
        _id
        name
      }
    }
    drills(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
  }
`;

export const UPDATE_ASSESSMENT_SESSION_DRILLS = gql`
  mutation UpdateAssessmentSessionDrills($_id: ID!, $data: UpdateAssessmentSessionInput!) {
    updateAssessmentSession(_id: $_id, data: $data) {
      _id
      drills {
        _id
        name
      }
    }
  }
`;

interface IAssessmentSessionDrillList {
  assessmentSessionId: string;
}

const AssessmentSessionDrillList: React.FC<IAssessmentSessionDrillList> = ({ assessmentSessionId }) => {
  const user = getAuthUser();
  const { data, loading, error } = useQuery(GET_ASSESSMENT_SESSION_DRILL_LIST, {
    skip: !user,
    variables: {
      _id: assessmentSessionId,
      companyId: user?.settings.activeCompanyId,
      includeGlobal: user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });

  const drills: IDrill[] = (data && data.drills) || [];
  const selectedDrills = _.get(data, 'assessmentSession.drills', []);

  const [updateAssessmentSession] = useMutation(UPDATE_ASSESSMENT_SESSION_DRILLS);
  const handleAddDrill = (drill: IDrill) => {
    const nextDrillIds = [..._.map(selectedDrills, '_id'), drill._id];

    return updateAssessmentSession({
      variables: {
        _id: assessmentSessionId,
        data: { drillIds: nextDrillIds }
      },
      update: (cache, { data }) => {
        cache.modify({
          id: `AssessmentSession:${assessmentSessionId}`,
          fields: {
            drills: () => [...selectedDrills, drill]
          }
        });
      }
    })
  };

  const handleRemoveDrill = (drill: IDrill) => {
    const nextDrills = [...selectedDrills];
    _.remove(nextDrills, currDrill => currDrill._id === drill._id);
    const nextDrillIds = _.map(nextDrills, '_id');

    return updateAssessmentSession({
      variables: {
        _id: assessmentSessionId,
        data: { drillIds: nextDrillIds }
      },
      update: (cache, { data }) => {
        cache.modify({
          id: `AssessmentSession:${assessmentSessionId}`,
          fields: {
            drills: () => nextDrills
          }
        });
      }
    })
  };

  return (
    <div>
      <ManageItemsListContainer
        entity="drill"
        options={drills}
        selectedItems={selectedDrills}
        addItem={handleAddDrill}
      >
        {(drill: IDrill) => (
          <ListItem key={drill._id}>
            <ListItemText primary={`${drill.name}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveDrill(drill)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </ManageItemsListContainer>
    </div>
  );
};

export default AssessmentSessionDrillList;
