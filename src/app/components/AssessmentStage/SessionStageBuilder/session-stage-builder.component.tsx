import React from 'react';
import dayjs from 'dayjs';
import { Form, Field, FormikProps } from 'formik';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import DateFnsUtils from '@date-io/date-fns';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';

// Data
import { SESSION_TERM, SESSIONS_TERM } from '../../../lib/constants';
import { mainColor } from '../../../lib/theme';

// Components
import { TextFieldComponent } from '../../_forms/Formik/formik-datepicker.component';
import { StageItemPre, StageItemWrapper } from '../assessment-stage.shared-components';
import { IFormOption } from '../../_core/_ui/forms.component';
import { ISessionStageBuilderFormValues } from './session-stage-builder.interface';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import { Link } from 'react-router-dom';
import FormikCheckbox from '../../_forms/Formik/formik-checkbox.component';
import { NOTIFICATION_OPTIONS } from '../assessment-stage.constants';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import FormControl from '@material-ui/core/FormControl/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

interface ISessionStageBuilder {
  form: FormikProps<ISessionStageBuilderFormValues>;
  stage: IAssessmentStage;
  drillOptions: IFormOption[];
  practicePlanOptions: IFormOption[];
}

const SessionStageBuilder: React.FC<ISessionStageBuilder> = ({
  form,
  stage,
  drillOptions,
  practicePlanOptions,
}) => {
  const { dirty, values } = form;
  if (!drillOptions.length) return (
    <Box p={2}>
      <Typography>Drills are required to configure an {SESSION_TERM.toLowerCase()}. <Link to="/drills">Create one here</Link></Typography>
    </Box>
  );

  return (
    <Form>
      <StageItemWrapper>
        <Box display="flex" flexDirection="column">
          {practicePlanOptions.length > 0 && <>
            <Box display="flex" alignItems="center">
              <Typography gutterBottom>Evaluate the following practice plans:</Typography>
              <Box mr={2}>
                <Tooltip title="Practice plans can be assigned when groups are approved, or manually by editing an ice time after scheduling">
                  <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
                </Tooltip>
              </Box>
            </Box>
            <Field
              fid={`${stage._id}_${stage.order}`}
              name="practicePlans"
              options={practicePlanOptions}
              component={FormikSelect}
              isMulti
            />
          </>}
          <Box mt={1}>
            <Box display="flex" alignItems="center">
              <Typography gutterBottom>{practicePlanOptions.length > 0 ? 'and ' : 'Evaluate '}the following drills:</Typography>
              <Box mr={2}>
                <Tooltip title="Drill can be assigned when groups are approved, or manually by editing an ice time after scheduling">
                  <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
                </Tooltip>
              </Box>
            </Box>

            <Field
              fid={`${stage._id}_${stage.order}`}
              name="drills"
              options={drillOptions}
              component={FormikSelect}
              isMulti
            />
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
                  options={NOTIFICATION_OPTIONS}
                  component={FormikSelect}
                  isMulti
                />
              </Box>
              <Box mr={2}>
                <Tooltip title="Notifications after the first will be sent as reminders">
                  <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
                </Tooltip>
              </Box>
              <Typography>or after groupings are finalized, whichever occurs later</Typography>
            </>)}
          </Box>
        </Box>
        {dirty && <Box mt={2}>
          <PrimaryButton type="submit" startIcon={<SaveIcon />}>
            Save Changes
          </PrimaryButton>
        </Box>}
      </StageItemWrapper>
    </Form>
  );
};

export default SessionStageBuilder;
