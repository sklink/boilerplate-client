import _ from 'lodash';import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';

// Data
import { getAuthUser } from '../../../_auth/auth.service';

// Components
import AssessmentSelectorContainer from './assessment-selector.container';
import { buildUpdateUserSettings } from '../../../user/user.service';

const GET_ASSESSMENT_SELECTOR_QUERY = gql`
  query GetAssessmentSelector($companyId: ID!) {
    assessments(companyId: $companyId) {
      _id
      name
    }
  }
`;

const AssessmentSelectorGraphQL = () => {
  const history = useHistory();
  const user = getAuthUser();
  const { data, error, loading } = useQuery(GET_ASSESSMENT_SELECTOR_QUERY, {
    fetchPolicy: 'cache-and-network',
    skip: !user,
    variables: { companyId: user && user.settings.activeCompanyId }
  });

  const { updateUserSettings } = buildUpdateUserSettings();
  const assessments = (data && data.assessments) || [];
  const assessmentIds = _.map(assessments, '_id');

  if (assessmentIds.length && !_.includes(assessmentIds, user?.settings.activeAssessmentId)) {
    updateUserSettings({
      activeAssessmentId: assessmentIds[0],
      activeCompanyId: user?.settings.activeCompanyId
    });
  }

  if (!loading && assessments.length === 0 && history.location.pathname !== '/assessments/create') {
    return <Redirect to="/assessments/create" />;
  }

  const switchAssessmentMutation = (assessmentId: string) =>
    updateUserSettings({ activeAssessmentId: assessmentId });

  return <AssessmentSelectorContainer
    switchAssessmentMutation={switchAssessmentMutation}
    fetchError={Boolean(error)}
    loading={loading}
    user={user}
    assessments={assessments}
  />;
};

export default AssessmentSelectorGraphQL;
