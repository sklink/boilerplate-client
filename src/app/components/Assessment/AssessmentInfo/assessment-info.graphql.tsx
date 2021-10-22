import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Data
import { buildUpdateAssessment } from '../../../lib/services/assessment.service';

// Components
import AssessmentInfoContainer from './assessment-info.container';
import { getAuthUser } from '../../../lib/services/auth.service';

const GET_ASSESSMENT_INFO = gql`
  query GetAssessmentInfo($assessmentId: ID!) {
    assessment(_id: $assessmentId) {
      covidLink
      infoLink
    }
  }
`;

const AssessmentInfoGraphQL = () => {
  const user = getAuthUser();
  const { updateAssessment } = buildUpdateAssessment();
  const { data, loading, error } = useQuery(GET_ASSESSMENT_INFO, {
    skip: !user,
    variables: {
      assessmentId: user?.settings.activeAssessmentId
    },
    fetchPolicy: 'cache-and-network'
  });

  const assessment = data && data.assessment;

  return <AssessmentInfoContainer
    assessment={assessment}
    updateAssessment={updateAssessment}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default AssessmentInfoGraphQL;
