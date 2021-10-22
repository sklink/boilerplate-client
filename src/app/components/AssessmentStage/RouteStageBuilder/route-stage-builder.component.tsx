import React from 'react';
import _ from 'lodash';
import { Field, Form, FormikProps } from 'formik';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import SaveIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';

// Data
import { SESSIONS_TERM } from '../../../lib/constants';
import { IRouteStageBuilderFormValues } from './route-stage-builder.interface';

// Components
import { StageItemWrapper } from '../assessment-stage.shared-components';
import FormikCheckbox from '../../_forms/Formik/formik-checkbox.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import FormikInput from '../../_forms/Formik/formik-input.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import {
  NOTIFICATION_OPTIONS, ROUTE_NOTIFICATION_OPTIONS,
  STAGE_ROUTE_BY_DESTINATIONS,
  STAGE_ROUTE_BY_ORIGINS
} from '../assessment-stage.constants';
import Chip from '@material-ui/core/Chip';
import { IFormOption } from '../../_core/_ui/forms.component';
import { Link } from 'react-router-dom';

interface IRouteStageBuilder {
  stage: IAssessmentStage;
  form: FormikProps<IRouteStageBuilderFormValues>;
  positionOptions: IFormOption[];
}

// notifications: [{ type: String }],

const RouteStageBuilder: React.FC<IRouteStageBuilder> = ({
  form,
  stage,
  positionOptions
}) => {
  const { dirty, values, setFieldValue } = form;

  if (positionOptions.length === 0) return <Typography>No positions available. Please create some using the <Link to="/players">Create Player form</Link></Typography>;

  return (
    <StageItemWrapper>
      <Form>
        <Box display="flex" mt={1} flexGrow={1} flexDirection="column">
          {values.routes.map((route, index) => {
            const sendType = _.get(values, ['routes', index, 'sendType', 'value']);

            return (
              <Box display="flex" alignItems="center" key={index}>
                <Typography>Take</Typography>
                <Box mx={1}>
                  <Field
                    fid={`${stage._id}_${stage.order}`}
                    name={`routes[${index}].amount`}
                    component={FormikInput}
                    defaultValue={0}
                    margin="none"
                    width="60px"
                  />
                </Box>
                <Typography>players with</Typography>
                <Box width="220px" mx={1}>
                  <Field
                    margin="none"
                    fid={`${stage._id}_${stage.order}`}
                    name={`routes[${index}].position`}
                    component={FormikSelect}
                    options={[{ label: 'any', value: 'ALL' }, ...positionOptions]}
                  />
                </Box>
                <Typography>position from</Typography>
                <Box width="220px" mx={1}>
                  <Field
                    margin="none"
                    fid={`${stage._id}_${stage.order}`}
                    name={`routes[${index}].takeFrom`}
                    component={FormikSelect}
                    options={STAGE_ROUTE_BY_ORIGINS}
                    placeholder="Select origin..."
                  />
                </Box>
                <Typography>and</Typography>

                <Box width="220px" mx={1}>
                  <Field
                    margin="none"
                    fid={`${stage._id}_${stage.order}`}
                    name={`routes[${index}].sendType`}
                    component={FormikSelect}
                    options={STAGE_ROUTE_BY_DESTINATIONS}
                    placeholder="Select destination..."
                  />
                </Box>
                {_.includes(['HOLD'], sendType) && (
                  <Typography>from next grouping</Typography>
                )}
                <Tooltip title="Remove Position Limit">
                  <IconButton onClick={() => {
                    const nextRoutes = [...values.routes];
                    _.pullAt(nextRoutes, index);

                    setFieldValue('routes', nextRoutes)
                  }}>
                    <RemoveCircle/>
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })}
          <Box mt={1}>
            <Tooltip title="Route Players">
              <Chip
                icon={<AddCircle />}
                label="Add Route"
                onClick={() => setFieldValue('routes', [...values.routes, { amount: 0 }])}
              />
            </Tooltip>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <Box width="154px">
            <Field
              autoWidth
              margin="none"
              name="enableNotifications"
              fid={`${stage._id}_${stage.order}`}
              component={FormikCheckbox}
              label="Notify players"
            />
          </Box>
          {values.enableNotifications && (<>
            <Box width="400px" mr={1}>
              <Field
                fid={`${stage._id}_${stage.order}`}
                name="notifications"
                options={ROUTE_NOTIFICATION_OPTIONS}
                component={FormikSelect}
              />
            </Box>
          </>)}
        </Box>
        <Box display="flex" alignItems="center">
          <Field
            autoWidth
            margin="none"
            fid={`${stage._id}_${stage.order}`}
            name="manualApproval"
            component={FormikCheckbox}
            disabled
            label={`Manually approve groupings before scheduling any following ${SESSIONS_TERM.toLowerCase()}`}
          />
          <Tooltip title={`You will be required to review the ${SESSIONS_TERM.toLowerCase()} to confirm or modify the arrangement of players. Full automation available spring 2022`}>
            <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
          </Tooltip>
        </Box>
        {dirty && <Box mt={1}>
          <PrimaryButton type="submit" startIcon={<SaveIcon />}>
            Save Changes
          </PrimaryButton>
        </Box>}
      </Form>
    </StageItemWrapper>
  );
};

export default RouteStageBuilder;
