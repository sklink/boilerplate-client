import _ from 'lodash';
import { FetchResult, MutationResult } from '@apollo/client';
import React, { useState } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

// Data
import { ICreatePlayerContainer, ICreatePlayerFields } from './create-player.interface';
import { GENDER_OPTIONS } from '../../../lib/constants';
import { authUser } from '../../../lib/services/auth.service';

// Components
import CreatePlayer from './create-player.component';

const CreatePlayerContainer: React.FC<ICreatePlayerContainer> = ({
  createPlayerMutation,
  ageGroups,
  createAgeGroup,
  positions,
  createPosition,
  fetchError,
  loading,
  createPlayerContact
}) => {
  const [submitError, setSubmitError] = useState();
  const [showSaved, setShowSaved] = useState(false);

  const INITIAL_FORM_VALUES = {
    firstName: '',
    lastName: '',
    date: dayjs().subtract(8, 'year').format('YYYY/MM/DD'),
    gender: GENDER_OPTIONS[1],
    contacts: [{ name: '', email: '', sendEmail: true, phone: '', sendSMS: false }]
  };

  async function handleSubmit(values: ICreatePlayerFields, { setSubmitting, resetForm }: FormikHelpers<ICreatePlayerFields>) {
    setSubmitError(null);

    function complete(result: MutationResult) {
      setSubmitting(false);

      if (result.error) {
        setSubmitError(result.error.message);
      } else {
        setShowSaved(true);
        setTimeout(() => {
          setShowSaved(false);
        }, 2000);

        resetForm({
          values: {
            ...INITIAL_FORM_VALUES,
            positionId: values.positionId,
            ageGroupId: values.ageGroupId
          }
        });
      }
    }

    console.log('values', values);
    createPlayerMutation({
      player: {
        ..._.omit(values, ['positionId', 'ageGroupId', 'gender', 'contacts', 'date']),
        dateOfBirth: values.date,
        gender: values.gender.value,
      },
      assessmentId: authUser()?.settings.activeAssessmentId,
      ageGroupId: values.ageGroupId?.value,
      positionId: values.positionId?.value
    })
      .then((result: MutationResult) => {
        if (result.error || !values.contacts.length) {
          complete(result);
        } else {
          const createContacts = values.contacts.map(contact => {
            if (contact.name) {
              console.log('conrent', contact);
              return createPlayerContact({...contact, playerId: result.data.createPlayerAssessment.player._id})
            }

            return false;
          });

          Promise.all(createContacts)
            .then(() => complete(result));
        }
      });
  }

  const ageGroupOptions = ageGroups.map(ageGroup => ({ value: ageGroup._id, label: ageGroup.name }));
  const handleCreateAgeGroup = (form: FormikProps<ICreatePlayerFields>, name: string) => {
    createAgeGroup(name).then((result: FetchResult) => {
      if (result.data && result.data.createAgeGroup) {
        form.setFieldValue('ageGroupId', ({ value: result.data.createAgeGroup._id, label: name }));
        form.setFieldTouched('ageGroupId');
      }
    });
  }

  const positionOptions = positions.map(position => ({ value: position._id, label: position.name }));
  const handleCreatePosition = (form: FormikProps<ICreatePlayerFields>, name: string) => {
    createPosition(name).then((result: FetchResult) => {
      if (result.data && result.data.createPosition) {
        form.setFieldValue('positionId', ({ value: result.data.createPosition._id, label: name }));
        form.setFieldTouched('positionId');
      }
    });
  }

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(`Enter the player's first name`),
    lastName: Yup.string().required(`Enter the player's last name`),
  });

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <CreatePlayer
        form={form}
        submitError={submitError}
        showSaved={showSaved}
        ageGroupOptions={ageGroupOptions}
        createAgeGroup={handleCreateAgeGroup}
        positionOptions={positionOptions}
        createPosition={handleCreatePosition}
        fetchError={fetchError}
        loading={loading}
      />}
    </Formik>
  );
};

export default CreatePlayerContainer;
