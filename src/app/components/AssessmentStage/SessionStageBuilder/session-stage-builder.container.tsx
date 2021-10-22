import React from 'react';
import { Formik } from 'formik';
import _ from 'lodash';

// Components
import SessionStageBuilder from './session-stage-builder.component';
import { ISessionStageBuilderFormValues } from './session-stage-builder.interface';
import { IFormOption } from '../../_core/_ui/forms.component';
import { buildOptions, NOTIFICATION_OPTIONS } from '../assessment-stage.constants';

interface SessionStageBuilderContainerProps {
  stage: IAssessmentStage;
  updateStage: Function;
  drillOptions: IFormOption[];
  practicePlanOptions: IFormOption[];
}

const SessionStageBuilderBuilderContainer: React.FC<SessionStageBuilderContainerProps> = ({
  stage,
  updateStage,
  drillOptions,
  practicePlanOptions
}) => {
  const INITIAL_FORM_VALUES: ISessionStageBuilderFormValues = {
    drills: buildOptions(drillOptions, stage.config.drills || []),
    practicePlans: buildOptions(practicePlanOptions, stage.config.practicePlans || []),
    notifications: buildOptions(NOTIFICATION_OPTIONS, stage.config.notifications || []),
    enableNotifications: _.isBoolean(stage.config.enableNotifications) ? stage.config.enableNotifications : true,
  };

  async function handleSubmit(values: ISessionStageBuilderFormValues, { setSubmitting }: any) {
    setSubmitting(false);

    const config = {
      drills: values.drills.map(drill => drill.value),
      practicePlans: values.practicePlans.map(practicePlan => practicePlan.value),
      notifications: values.notifications.map(notification => notification.value),
      enableNotifications: values.enableNotifications
    }

    updateStage(stage._id, { config });
  }

  return (
    <Formik enableReinitialize initialValues={INITIAL_FORM_VALUES} onSubmit={handleSubmit}>
      {form => <SessionStageBuilder
        form={form}
        stage={stage}
        drillOptions={drillOptions}
        practicePlanOptions={practicePlanOptions}
      />}
    </Formik>
  );
};

export default SessionStageBuilderBuilderContainer;
