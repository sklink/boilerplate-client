import _ from 'lodash';
import React from 'react';
import { Field, Form } from 'formik';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

// Data
import { ICreatePlayer } from './create-player.interface';
import messages from './create-player.messages';
import { GENDER_OPTIONS } from '../../../lib/constants';

// Components
import FormikInput from '../../_forms/Formik/formik-input.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { FormHelperText } from '../../_core/_ui/forms.component';
import { OutlineButton, PrimaryButton } from '../../_core/_ui/buttons.component';
import FormikDatePicker from '../../_forms/Formik/formik-datepicker.component';
import FormikSelect from '../../_forms/Formik/formik-select.component';
import { SectionHeading } from '../../_core/_ui/typography.component';
import { SectionWrapper } from '../../_core/_ui/structure.components';
import FormikCheckbox from '../../_forms/Formik/formik-checkbox.component';

const CreatePlayer: React.FC<ICreatePlayer> = ({
  form,
  submitError,
  showSaved,
  ageGroupOptions,
  createAgeGroup,
  positionOptions,
  createPosition,
  fetchError,
  loading,
}) => {
  const { isSubmitting, isValid, values, setFieldValue } = form;
  const genderOptions = [..._.filter(GENDER_OPTIONS, option => option.value !== 'Any'), { value: 'Other', label: 'Other' }];

  if (fetchError) return <Box mt={2}><Typography>Unable to create players at this time. Please try again later</Typography></Box>;

  const removeContact = (index: number) => {
    let nextContacts: IPlayerContact[] = [];

    if (index === 0) {
      nextContacts = values.contacts.slice(1);
    } else if (index === values.contacts.length - 1) {
      nextContacts = values.contacts.slice(0, values.contacts.length - 2);
    } else {
      nextContacts = [...values.contacts.slice(0, index), ...values.contacts.slice(index + 1)];
    }

    setFieldValue('contacts', nextContacts);
  };

  return (
    <Form>
      <Box mt={2}><Typography variant="h5">Player Information</Typography></Box>
      <Box display="flex">
        <Box mr={1} flexGrow={1}>
          <Field fid="cpf" name="firstName" component={FormikInput} label={messages.lblFirstName} />
        </Box>
        <Box flexGrow={1}>
          <Field fid="cpf" name="lastName" component={FormikInput} label={messages.lblLastName} />
        </Box>
      </Box>
      <Box display="flex">
        <Box mr={1} flexGrow={1}>
          <Field fid="csf" name="date" component={FormikDatePicker} label={messages.lblDate} dateFormat="YYYY/MM/DD" />
        </Box>
        <Box flexGrow={1}>
          <Field fid="csf" name="gender" component={FormikSelect} label={messages.lblGender} options={genderOptions} />
        </Box>
      </Box>
      <Field fid="cpf" name="externalId" component={FormikInput} label={messages.lblExternalId} />

      <Field
        fid="cpf"
        name="positionId"
        component={FormikSelect}
        label={messages.lblPosition}
        options={positionOptions}
        isLoading={loading}
        createMethod={createPosition}
        canCreate
      />

      <Field
        fid="cpf"
        name="ageGroupId"
        component={FormikSelect}
        label={messages.lblAgeGroup}
        options={ageGroupOptions}
        isLoading={loading}
        createMethod={createAgeGroup}
        canCreate
      />

      <Box my={2}>
        <Typography variant="h5" gutterBottom>Parent / Guardian Information</Typography>
        <SectionWrapper dark padding="8px 24px">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SectionHeading>Contacts</SectionHeading>
              <List>
                {values.contacts.map((contact: IPlayerContact, index: number) => {
                  if (index === values.contacts.length - 1) return <></>;

                  return (
                    <ListItem key={contact._id}>
                      <ListItemText primary={contact.name} secondary={`${contact.email} | ${contact.phone}`} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => removeContact(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
                {values.contacts.length <= 1 && <ListItem><ListItemText primary="None" /></ListItem>}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                margin="dense"
                fid="cpf"
                name={`contacts[${values.contacts.length - 1}].name`}
                component={FormikInput}
                label={messages.lblContactName}
              />
              <Field
                margin="dense"
                fid="cpf"
                name={`contacts[${values.contacts.length - 1}].email`}
                component={FormikInput}
                label={messages.lblContactEmail}
              />
              <Field
                fid="cpcf"
                id="cpcf_sendEmail"
                name={`contacts[${values.contacts.length - 1}].sendEmail`}
                component={FormikCheckbox}
                label={messages.lblSendEmail}
                margin="dense"
              />
              <Field
                margin="dense"
                fid="cpf"
                name={`contacts[${values.contacts.length - 1}].phone`}
                component={FormikInput}
                label={messages.lblContactPhone}
              />
              <Field
                fid="cpcf"
                id="cpcf_sendSMS"
                name={`contacts[${values.contacts.length - 1}].sendSMS`}
                component={FormikCheckbox}
                label={messages.lblSendSMS}
                margin="dense"
              />

              <FormControl margin="dense">
                <OutlineButton
                  onClick={() => setFieldValue('contacts', [...values.contacts, { name: '', phone: '', email: '', sendEmail: true, sendSMS: false }])}
                >Add Contact</OutlineButton>
              </FormControl>
            </Grid>
          </Grid>
        </SectionWrapper>
      </Box>

      <FormControl margin="dense">
        <Box display="flex" flexDirection="row" alignItems="center">
          <PrimaryButton disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting ? <IntlMsg {...messages.btnSubmitting} /> : <IntlMsg {...messages.btnSubmit} />}
          </PrimaryButton>
          {submitError && <Box ml={2}><FormHelperText error>{submitError}</FormHelperText></Box>}
          {showSaved && <Box ml={2}><FormHelperText className="success">Successfully created</FormHelperText></Box>}
        </Box>
      </FormControl>
    </Form>
  );
};

export default CreatePlayer;
