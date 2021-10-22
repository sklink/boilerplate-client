import _ from 'lodash';
import React from 'react';
import { Formik } from 'formik';

// Components
import GroupStageBuilder from './group-stage-builder.component';
import { IGroupStageBuilderFormValues } from './group-stage-builder.interface';
import {
  buildOrderByOption,
  buildPlayerLimitOptions,
  STAGE_ORDER_BY_LABELS,
  STAGE_ORDER_BY_OPTIONS
} from '../assessment-stage.constants';
import { IFormOption } from '../../_core/_ui/forms.component';

interface GroupStageBuilderContainerProps {
  stage: IAssessmentStage;
  updateStage: Function;
  positionOptions: IFormOption[];
}

const GroupStageBuilderBuilderContainer: React.FC<GroupStageBuilderContainerProps> = ({
  stage,
  updateStage,
  positionOptions
}) => {
  const INITIAL_FORM_VALUES: IGroupStageBuilderFormValues = {
    orderBy: buildOrderByOption(stage.config.orderBy),
    playerLimits: buildPlayerLimitOptions(positionOptions, stage.config.playerLimits || []),
    manualApproval: _.isBoolean(stage.config.manualApproval) ? stage.config.manualApproval : true
  };

  async function handleSubmit(values: IGroupStageBuilderFormValues, { setSubmitting }: any) {
    setSubmitting(false);

    const config = {
      orderBy: values.orderBy.value,
      playerLimits: values.playerLimits.map(playerLimit => ({ positions: playerLimit.positions.map(position => position.value), limit: playerLimit.limit })),
      manualApproval: values.manualApproval
    }

    updateStage(stage._id, { config });
  }

  return (
    <Formik enableReinitialize initialValues={INITIAL_FORM_VALUES} onSubmit={handleSubmit}>
      {form => <GroupStageBuilder
        form={form}
        stage={stage}
        positionOptions={[...positionOptions]}
      />}
    </Formik>
  );
};

export default GroupStageBuilderBuilderContainer;
