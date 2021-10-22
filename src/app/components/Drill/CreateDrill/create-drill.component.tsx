import React from 'react';
import { Field, Form } from 'formik';
import styled from 'styled-components';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';

// Data
import messages from './create-drill.messages';
import { mainColor, sectionDarkColor } from '../../../lib/theme';
import { ICreateDrill, ISkillSetFields } from './create-drill.interface';

// Components
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import FormikSelect from '../../_core/Formik/formik-select.component';
import FormikInput from '../../_core/Formik/formik-input.component';
import { FormHelperText } from '../../_core/_ui/forms.component';
import { OutlineButton, PrimaryButton } from '../../_core/_ui/buttons.component';
import FormikCheckbox from '../../_core/Formik/formik-checkbox.component';
import { SectionWrapper } from '../../_core/_ui/structure.components';
import { Bold, SectionHeading } from '../../_core/_ui/typography.component';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const SkillSetWrapper = styled.div`
  background: ${sectionDarkColor};
  padding: 8px 16px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin: 8px 0;
`;

const CreateDrill: React.FC<ICreateDrill> = ({
  isEditing,
  form,
  submitError,
  showSaved,
  skillOptions,
  positionOptions,
  createPosition,
  loading,
  fetchError,
  isAdmin
}) => {
  const { values, isSubmitting, isValid, setFieldValue } = form;

  if (fetchError) return <Box mt={2}><Typography>Unable to create drills at this time. Please try again later</Typography></Box>;

  const removeSkillSet = (index: number) => {
    let nextSkillSets: ISkillSetFields[] = [];

    if (index === 0) {
      nextSkillSets = values.skillSets.slice(1);
    } else if (index === values.skillSets.length - 1) {
      nextSkillSets = values.skillSets.slice(0, values.skillSets.length - 2);
    } else {
      nextSkillSets = [...values.skillSets.slice(0, index), ...values.skillSets.slice(index + 1)];
    }

    setFieldValue('skillSets', nextSkillSets);
  };

  return (
    <Form>
      <Field fid="cdf" name="drillName" component={FormikInput} label={messages.lblName} />
     <Box>
        <SectionWrapper dark padding="8px 24px">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SectionHeading>Skill Sets</SectionHeading>
              <List>
                {values.skillSets.map((skillSet: ISkillSetFields, index: number) => {
                  if (index === values.skillSets.length - 1) return <></>;

                  const positionNames = skillSet?.positionIds?.map(position => position.label).join(', ');
                  const skillNames = skillSet?.skillIds?.map(skill => skill.label).join(', ');

                  return (
                    <ListItem key={index}>
                      <ListItemText primary={skillNames} secondary={positionNames} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => removeSkillSet(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
                {values.skillSets.length <= 1 && <ListItem><ListItemText primary="None" /></ListItem>}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                fid="cpf"
                name={`skillSets.${values.skillSets.length - 1}.positionIds`}
                component={FormikSelect}
                label={messages.lblPosition}
                options={positionOptions}
                isLoading={loading}
                createMethod={createPosition}
                canCreate
                isMulti
              />
              <Field
                fid="cdf"
                name={`skillSets.${values.skillSets.length - 1}.skillIds`}
                component={FormikSelect}
                label={messages.lblSkills}
                options={skillOptions}
                isLoading={loading}
                isMulti
              />
              <FormControl margin="dense">
                <OutlineButton
                  onClick={() => setFieldValue('skillSets', [...values.skillSets, { positionIds: [], skillIds: [] }])}
                >Add Skill Set</OutlineButton>
              </FormControl>
            </Grid>
          </Grid>
        </SectionWrapper>
      </Box>
      {isAdmin && !isEditing && (
        <Field fid="cdf" name="isGlobal" component={FormikCheckbox} label={messages.lblGlobal} />
      )}

      <FormControl margin="dense">
        <Box>
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...isEditing ? messages.btnEdit : messages.btnSubmit} />}
          </PrimaryButton>
        </Box>
        {submitError && <FormHelperText error>{submitError}</FormHelperText>}
        {showSaved && <FormHelperText className="success">{isEditing ? 'Successfully saved' : 'Successfully created'}</FormHelperText>}
      </FormControl>
    </Form>
  );
}

export default CreateDrill;
