import _ from 'lodash';
import { MutationResult } from '@apollo/client';
import React, { useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

// Data
import { GENDER_OPTIONS } from '../../../lib/constants';

// Components
import { IEditPlayerFields } from './edit-player.interface';
import EditPlayer from './edit-player.component';

export interface IEditPlayerContainer {
  player?: IPlayer;
  updatePlayerMutation: Function;
  fetchError: boolean;
  loading: boolean;
}

const EditPlayerContainer: React.FC<IEditPlayerContainer> = ({
  player,
  updatePlayerMutation,
  fetchError,
  loading,
}) => {
  const [submitError, setSubmitError] = useState();
  const [showSaved, setShowSaved] = useState(false);

  const INITIAL_FORM_VALUES = {
    firstName: player?.firstName,
    lastName: player?.lastName,
    date: player?.dateOfBirth,
    gender: player?.gender ? { value: player?.gender, label: player?.gender } : GENDER_OPTIONS[1],
  };

  async function handleSubmit(values: IEditPlayerFields, { setSubmitting }: FormikHelpers<IEditPlayerFields>) {
    setSubmitError(null);

    updatePlayerMutation({
      ..._.omit(values, ['gender', 'date']),
      dateOfBirth: values.date,
      gender: values.gender.value,
    })
      .then((result: MutationResult) => {
        setSubmitting(false);

        if (result.error) {
          setSubmitError(result.error.message);
        } else {
          setShowSaved(true);
          setTimeout(() => {
            setShowSaved(false);
          }, 2000);
        }
      })
  }

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(`Enter the player's first name`),
    lastName: Yup.string().required(`Enter the player's last name`),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <EditPlayer
        form={form}
        submitError={submitError}
        showSaved={showSaved}
        fetchError={fetchError}
        loading={loading}
      />}
    </Formik>
  );
};

export default EditPlayerContainer;
