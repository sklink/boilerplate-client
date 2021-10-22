import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Data
import { IAssessmentInfoContainer, IAssessmentInfoFields } from './assessment-info.interface';

// Components
import AssessmentInfo from './assessment-info.component';

const AssessmentInfoContainer: React.FC<IAssessmentInfoContainer> = ({
  updateAssessment,
  assessment,
  loading,
  fetchError
}) => {
  const [showSaved, setShowSaved] = useState(false);
  const INITIAL_FORM_VALUES: IAssessmentInfoFields = {
    covidLink: assessment?.covidLink || '',
    infoLink: assessment?.infoLink || ''
  };

  async function handleSubmit(values: IAssessmentInfoFields, { setSubmitting }: any) {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);
    setSubmitting(false);
    updateAssessment(values);
  }

  return (
    <Formik
      enableReinitialize
      initialValues={INITIAL_FORM_VALUES}
      onSubmit={handleSubmit}
    >
      {form => <AssessmentInfo form={form} showSaved={showSaved} />}
    </Formik>
  );
};

export default AssessmentInfoContainer;
