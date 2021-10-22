import _ from 'lodash';
import { FetchResult, MutationResult } from '@apollo/client';
import React, { useState } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

// Material UI
import Typography from '@material-ui/core/Typography';

// Data
import { IEditAssessmentSessionContainer, IEditAssessmentSessionFields } from './edit-assessment-session.interface'
import { SESSION_TERM } from '../../../lib/constants';
import { ICreateSkillFields } from '../../Skill/CreateSkill/create-skill.interface';

// Components
import EditAssessmentSession from './edit-assessment-session.component';

const EditAssessmentSessionContainer: React.FC<IEditAssessmentSessionContainer> = ({
  assessmentSession,
  updateAssessmentSession,
  createAgeGroup,
  ageGroups,
  ageGroupsLoading,
  ageGroupsError
}) => {
  const [sendNotification, setSendNotification] = useState(true);
  const [submitError, setSubmitError] = useState();
  const [showSaved, setShowSaved] = useState(false);

  const INITIAL_FORM_VALUES: IEditAssessmentSessionFields = {
    location: assessmentSession?.location,
    area: assessmentSession?.area,
    address: assessmentSession?.address || '',
    date: assessmentSession?.date || dayjs().add(1, 'day').format('YYYY/MM/DD'),
    start: assessmentSession?.start || 60 * 12,
    duration: assessmentSession?.duration || 60,
    notify: true
  };

  if (assessmentSession && assessmentSession.gender) {
    INITIAL_FORM_VALUES.gender = { value: assessmentSession.gender, label: assessmentSession.gender };
  }

  if (assessmentSession) {
    INITIAL_FORM_VALUES.ageGroupId = { value: assessmentSession.ageGroup._id, label: assessmentSession.ageGroup.name };
  }

  async function handleSubmit(values: IEditAssessmentSessionFields, { setSubmitting, resetForm }: FormikHelpers<IEditAssessmentSessionFields>) {
    setSubmitError(null);

    updateAssessmentSession({
      ..._.omit(values, ['ageGroupId', 'gender', 'duration', 'notify']),
      duration: Number(values.duration),
      gender: values.gender?.value,
      ageGroupId: values.ageGroupId?.value
    }, values.notify)
      .then((result: MutationResult) => {
        setSubmitting(false);

        if (result.error) {
          setSubmitError(result.error.message);
        } else {
          setShowSaved(true);
          setTimeout(() => {
            setShowSaved(false);
          }, 2000);

          resetForm({ values });
        }
      });
  }

  const validationSchema = Yup.object().shape({
    address: Yup.string().required(`Enter the address of the ${SESSION_TERM}`),
    date: Yup.string().required(`Start date is required`),
    start: Yup.string().required('Start time is required'),
    duration: Yup.string().required('Duration is required'),
    ageGroupId: Yup.string().required('Select or create an age group'),
  });

  const ageGroupOptions = ageGroups.map((group: IAgeGroup) => ({ value: group._id, label: group.name }));
  const handleCreateAgeGroup = (form: FormikProps<ICreateSkillFields>, name: string) => {
    createAgeGroup(name).then((result: FetchResult) => {
      if (result.data && result.data.createAgeGroup) {
        form.setFieldValue('ageGroupId', { value: result.data.createAgeGroup._id, label: name });
        form.setFieldTouched('ageGroupId');
      }
    });
  }

  if (!ageGroups.length && !ageGroupsLoading && ageGroupsError) return (
    <Typography>Something went wrong. Please try again later</Typography>
  );

  return (
    <Formik
      enableReinitialize
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <EditAssessmentSession
        form={form}
        submitError={submitError}
        showSaved={showSaved}
        createAgeGroup={handleCreateAgeGroup}
        ageGroupOptions={ageGroupOptions}
        ageGroupsLoading={ageGroupsLoading}
        sendNotification={sendNotification}
        setSendNotification={setSendNotification}
      />}
    </Formik>
  );
};

export default EditAssessmentSessionContainer;
