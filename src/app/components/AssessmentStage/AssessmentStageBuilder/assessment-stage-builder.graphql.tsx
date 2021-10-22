import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// Queries
import { ASSESSMENT_STAGE_FIELDS } from '../../../lib/queries/assessment-stage.queries';
import { getAuthUser } from '../../../lib/services/auth.service';

// Components
import AssessmentStageBuilderContainer from './assessment-stage-builder.container';
import { getAgeGroups } from '../../../lib/services/age-group.service';
import {
  buildCreateAssessmentStage,
  buildRemoveAssessmentStage,
  buildUpdateAssessmentStage
} from '../../../lib/services/assessment-stage.service';

const GET_ASSESSMENT_STAGE_BUILDER = gql`
  query GetAssessmentStageBuilder($assessmentId: ID!, $companyId: ID!, $ageGroupId: ID!, $includeGlobal: Boolean) {
    assessmentStages(assessmentId: $assessmentId, ageGroupId: $ageGroupId) {
      ...AssessmentStageFields
    }
    practicePlans(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
    drills(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
    ageGroups(assessmentId: $assessmentId) {
      _id
      name
    }
    positions(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
    }
  }

  ${ASSESSMENT_STAGE_FIELDS}
`;

const AssessmentStageBuilderGraphQL = () => {
  const [ageGroupId, setAgeGroupId] = useState();
  const user = getAuthUser();
  const { ageGroups } = getAgeGroups();
  const { createAssessmentStage } = buildCreateAssessmentStage();
  const { updateAssessmentStage } = buildUpdateAssessmentStage();
  const { removeAssessmentStage } = buildRemoveAssessmentStage();

  const { data, loading, error } = useQuery(GET_ASSESSMENT_STAGE_BUILDER, {
    skip: !user || !ageGroupId,
    variables: {
      companyId: user?.settings.activeCompanyId,
      assessmentId: user?.settings.activeAssessmentId,
      ageGroupId,
      includeGlobal: user?.settings.includeGlobal
    },
    fetchPolicy: 'cache-and-network'
  });

  const stages = (data && data.assessmentStages) || [];
  const drills = (data && data.drills) || [];
  const practicePlans = (data && data.practicePlans) || [];
  const positions = (data && data.positions) || [];

  return <AssessmentStageBuilderContainer
    loading={loading}
    fetchError={Boolean(error)}
    setAgeGroupId={setAgeGroupId}
    stages={stages}
    drills={drills}
    practicePlans={practicePlans}
    ageGroups={ageGroups}
    ageGroupId={ageGroupId}
    positions={positions}
    createStage={createAssessmentStage}
    updateStage={updateAssessmentStage}
    removeStage={removeAssessmentStage}
  />;
};

export default AssessmentStageBuilderGraphQL;
