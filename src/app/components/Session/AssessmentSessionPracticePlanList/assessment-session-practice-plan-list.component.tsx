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

const GET_ASSESSMENT_SESSION_PRACTICE_PLAN_LIST = gql`
  query GetAssessmentSessionPracticePlanList($_id: ID!, $companyId: ID!, $includeGlobal: Boolean) {
    assessmentSession(_id: $_id) {
      _id
      practicePlans {
        _id
        name
      }
    }
    practicePlans(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
  }
`;

export const UPDATE_ASSESSMENT_SESSION_PRACTICE_PLANS = gql`
  mutation UpdateAssessmentSessionPracticePlans($_id: ID!, $data: UpdateAssessmentSessionInput!) {
    updateAssessmentSession(_id: $_id, data: $data) {
      _id
      practicePlans {
        _id
        name
      }
    }
  }
`;

interface IAssessmentSessionPracticePlanList {
  assessmentSessionId: string;
}

const AssessmentSessionPracticePlanList: React.FC<IAssessmentSessionPracticePlanList> = ({ assessmentSessionId }) => {
  const user = getAuthUser();
  const { data, loading, error } = useQuery(GET_ASSESSMENT_SESSION_PRACTICE_PLAN_LIST, {
    skip: !user,
    variables: {
      _id: assessmentSessionId,
      companyId: user?.settings.activeCompanyId,
      includeGlobal: user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });

  const practicePlans: IPracticePlan[] = (data && data.practicePlans) || [];
  const selectedPracticePlans = _.get(data, 'assessmentSession.practicePlans', []);

  const [updateAssessmentSession] = useMutation(UPDATE_ASSESSMENT_SESSION_PRACTICE_PLANS);
  const handleAddPracticePlan = (practicePlan: IPracticePlan) => {
    const nextPracticePlanIds = [..._.map(selectedPracticePlans, '_id'), practicePlan._id];

    return updateAssessmentSession({
      variables: {
        _id: assessmentSessionId,
        data: { practicePlanIds: nextPracticePlanIds }
      },
      update: (cache, { data }) => {
        cache.modify({
          id: `AssessmentSession:${assessmentSessionId}`,
          fields: {
            practicePlans: () => [...selectedPracticePlans, practicePlan]
          }
        });
      }
    })
  };

  const handleRemovePracticePlan = (practicePlan: IPracticePlan) => {
    const nextPracticePlans = [...selectedPracticePlans];
    _.remove(nextPracticePlans, currPracticePlan => currPracticePlan._id === practicePlan._id);
    const nextPracticePlanIds = _.map(nextPracticePlans, '_id');

    return updateAssessmentSession({
      variables: {
        _id: assessmentSessionId,
        data: { practicePlanIds: nextPracticePlanIds }
      },
      update: (cache, { data }) => {
        cache.modify({
          id: `AssessmentSession:${assessmentSessionId}`,
          fields: {
            practicePlans: () => nextPracticePlans
          }
        });
      }
    })
  };

  return (
    <div>
      <ManageItemsListContainer
        entity="practice plan"
        options={practicePlans}
        selectedItems={selectedPracticePlans}
        addItem={handleAddPracticePlan}
      >
        {(practicePlan: IPracticePlan) => (
          <ListItem key={practicePlan._id}>
            <ListItemText primary={`${practicePlan.name}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemovePracticePlan(practicePlan)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </ManageItemsListContainer>
    </div>
  );
};

export default AssessmentSessionPracticePlanList;
