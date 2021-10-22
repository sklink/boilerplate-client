import React from 'react';
import { Formik } from 'formik';

// Components
import RouteStageBuilder from './route-stage-builder.component';
import { IRouteStageBuilderFormValues } from './route-stage-builder.interface';
import { IFormOption } from '../../_core/_ui/forms.component';
import _ from 'lodash';
import {
  buildOptions,
  buildRouteOptions,
  NOTIFICATION_OPTIONS,
  ROUTE_NOTIFICATION_OPTIONS
} from '../assessment-stage.constants';

interface RouteStageBuilderContainerProps {
  stage: IAssessmentStage;
  updateStage: Function;
  positionOptions: IFormOption[];
}

const RouteStageBuilderBuilderContainer: React.FC<RouteStageBuilderContainerProps> = ({
  stage,
  updateStage,
  positionOptions
}) => {
  const INITIAL_FORM_VALUES: IRouteStageBuilderFormValues = {
    routes: buildRouteOptions(stage.config.routes || [], positionOptions),
    notifications: _.find(ROUTE_NOTIFICATION_OPTIONS, option => option.value === stage.config.notifications) || ROUTE_NOTIFICATION_OPTIONS[0],
    enableNotifications: _.isBoolean(stage.config.enableNotifications) ? stage.config.enableNotifications : true,
    manualApproval: _.isBoolean(stage.config.manualApproval) ? stage.config.manualApproval : true,
  };

  async function handleSubmit(values: IRouteStageBuilderFormValues, { setSubmitting }: any) {
    setSubmitting(false);

    console.log(values);
    const config = {
      manualApproval: values.manualApproval,
      routes: values.routes.map(route => ({
        ...route,
        position: route.position?.value,
        takeFrom: route.takeFrom?.value,
        sendType: route.sendType?.value
      })),
      notifications: values.notifications?.value,
      enableNotifications: values.enableNotifications
    }

    updateStage(stage._id, { config });
  }

  return (
    <Formik enableReinitialize initialValues={INITIAL_FORM_VALUES} onSubmit={handleSubmit}>
      {form => <RouteStageBuilder
        form={form}
        stage={stage}
        positionOptions={positionOptions}
      />}
    </Formik>
  );
};

export default RouteStageBuilderBuilderContainer;
