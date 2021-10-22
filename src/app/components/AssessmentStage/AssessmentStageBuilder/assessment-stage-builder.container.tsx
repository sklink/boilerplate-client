import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import AssessmentStageBuilder from './assessment-stage-builder.component';
import { IFormOption } from '../../_core/_ui/forms.component';
import { buildOrderByOption, buildPlayerLimitOptions, DEFAULT_CONFIGS } from '../assessment-stage.constants';

interface IAssessmentStageBuilderContainer {
  stages: IAssessmentStage[];
  drills: IDrill[];
  practicePlans: IPracticePlan[];
  ageGroups: IAgeGroup[];
  positions: IPosition[];
  setAgeGroupId: Function;
  ageGroupId?: string;
  createStage: Function;
  updateStage: Function;
  removeStage: Function;
  fetchError: boolean;
  loading: boolean
}

const AssessmentStageBuilderContainer: React.FC<IAssessmentStageBuilderContainer> = ({
  stages,
  drills,
  practicePlans,
  ageGroups,
  positions,
  setAgeGroupId,
  ageGroupId,
  createStage,
  updateStage,
  removeStage,
  fetchError,
  loading
}) => {
  const [drillOptions, setDrillOptions] = useState<IFormOption[]>([]);
  const [practicePlanOptions, setPracticePlanOptions] = useState<IFormOption[]>([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState<IFormOption[]>([]);
  const [positionOptions, setPositionOptions] = useState<IFormOption[]>([]);

  useEffect(() => {
    setDrillOptions(drills.map(drill => ({ value: drill._id, label: drill.name })));
  }, [drills]);

  useEffect(() => {
    setPracticePlanOptions(practicePlans.map(plan => ({ value: plan._id, label: plan.name })));
  }, [practicePlans]);

  useEffect(() => {
    setAgeGroupOptions(ageGroups.map(ageGroup => ({ value: ageGroup._id, label: ageGroup.name })));
  }, [ageGroups]);

  useEffect(() => {
    setPositionOptions(positions.map(position => ({ value: position._id, label: position.name })));
  }, [positions]);

  const handleCreateStage = (type: string) => {
    createStage({ type, order: stages.length + 1, config: DEFAULT_CONFIGS[type], ageGroupId });
  };

  const orderedStages = _.orderBy(stages, 'order', 'asc');

  return <AssessmentStageBuilder
    stages={orderedStages}
    drillOptions={drillOptions}
    practicePlanOptions={practicePlanOptions}
    ageGroupOptions={ageGroupOptions}
    positionOptions={positionOptions}
    setAgeGroupId={setAgeGroupId}
    ageGroupId={ageGroupId}
    createStage={handleCreateStage}
    removeStage={removeStage}
    updateStage={updateStage}
    fetchError={fetchError}
    loading={loading}
  />;
};

export default AssessmentStageBuilderContainer;
