import _ from 'lodash';
import React from 'react';
import { Form, Field, FormikProps } from 'formik';
import { Link } from 'react-router-dom';

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
import { pluralTerm } from '../../../lib/helpers/term.helper';
import { SESSION_TERM, SESSIONS_TERM } from '../../../lib/constants';
import { STAGE_ORDER_BY_OPTIONS } from '../assessment-stage.constants';

// Components
import { StageItemPre, StageItemWrapper } from '../assessment-stage.shared-components';
import { IFormOption } from '../../_core/_ui/forms.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import { IGroupStageBuilderFormValues } from './group-stage-builder.interface';
import { mainColor } from '../../../lib/theme';
import FormikCheckbox from '../../_forms/Formik/formik-checkbox.component';
import FormikInput from '../../_forms/Formik/formik-input.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';

interface IGroupStageBuilder {
  form: FormikProps<IGroupStageBuilderFormValues>;
  stage: IAssessmentStage;
  positionOptions: IFormOption[];
}

const GroupStageBuilder: React.FC<IGroupStageBuilder> = ({
  stage,
  form,
  positionOptions
}) => {
  const { dirty, values, setFieldValue } = form;

  if (positionOptions.length === 0) return <Typography>No positions available. Please create some using the <Link to="/players">Create Player form</Link></Typography>;

  return (
    <Form>
      <StageItemWrapper>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Typography>Sort players</Typography>
            <Box width="400px" mx={2}>
              <Field
                margin="none"
                fid={`${stage._id}_${stage.order}`}
                name="orderBy"
                component={FormikSelect}
                options={STAGE_ORDER_BY_OPTIONS}
                defaultValue={STAGE_ORDER_BY_OPTIONS[0]}
              />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mt={1} flexGrow={1} flexWrap="wrap">
            <Typography>Limit {pluralTerm(SESSION_TERM).toLowerCase()} to</Typography>

            {values.playerLimits.map((playerLimit, index) => (
              <Box display="flex" alignItems="center" key={index}>
                {index > 0 && <Box>and</Box>}
                <Box mx={1}>
                  <Field
                    fid={`${stage._id}_${stage.order}`}
                    name={`playerLimits[${index}].limit`}
                    component={FormikInput}
                    margin="none"
                    width="60px"
                  />
                </Box>
                <Box width="200px" mx={1}>
                  <Field
                    margin="none"
                    fid={`${stage._id}_${stage.order}`}
                    name={`playerLimits[${index}].positions`}
                    component={FormikSelect}
                    options={positionOptions}
                    isMulti
                  />
                </Box>
                <Tooltip title="Remove Position Limit">
                  <IconButton onClick={() => {
                    const nextPlayerLimits = [...values.playerLimits];
                    _.pullAt(nextPlayerLimits, index);

                    setFieldValue('playerLimits', nextPlayerLimits)
                  }}>
                    <RemoveCircle />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}

            <Tooltip title="Add Position Limit">
              <IconButton onClick={() => setFieldValue('playerLimits', [...values.playerLimits, {}])}>
                <AddCircle />
              </IconButton>
            </Tooltip>
          </Box>
          <Box display="flex" alignItems="center">
            <Field
              autoWidth
              margin="none"
              fid={`${stage._id}_${stage.order}`}
              name="manualApproval"
              component={FormikCheckbox}
              label={`Manually approve groupings before scheduling any following ${SESSIONS_TERM.toLowerCase()}`}
              disabled
            />
            <Tooltip title={`You will be required to review the ${SESSIONS_TERM.toLowerCase()} to confirm or modify the arrangement of players. Full automation available spring 2022`}>
              <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
            </Tooltip>
          </Box>
        </Box>
        {dirty && <Box mt={1}>
          <PrimaryButton type="submit" startIcon={<SaveIcon />}>
            Save Changes
          </PrimaryButton>
        </Box>}
      </StageItemWrapper>
    </Form>
  );
};

export default GroupStageBuilder;
