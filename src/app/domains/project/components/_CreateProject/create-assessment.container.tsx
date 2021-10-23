import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { MutationResult } from '@apollo/client';
import { useHistory } from 'react-router-dom';

// Data
import { ICreateAssessmentContainer, ICreateAssessmentFields } from './create-assessment.interface';
import { getAuthUser } from '../../../_auth/auth.service';

// Components
import CreateAssessment from './create-assessment.components';

const CreateAssessmentContainer: React.FC<ICreateAssessmentContainer> = ({ createAssessmentMutation }) => {
  const history = useHistory();
  const user = getAuthUser();
  const [submitError, setSubmitError] = useState();

  const INITIAL_FORM_VALUES = { name: '' };

  async function handleSubmit(values: ICreateAssessmentFields, { setSubmitting }: FormikHelpers<ICreateAssessmentFields>) {
    setSubmitError(null);

    createAssessmentMutation({ ...values, companyId: user?.settings.activeCompanyId })
      .then((result: MutationResult) => {
        setSubmitting(false);

        if (result.error) {
          setSubmitError(result.error.message);
        } else {
          history.push('/');
        }
      })
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Enter a name for your assessment')
  });

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <CreateAssessment form={form} submitError={submitError} />}
    </Formik>
  );
};

export default CreateAssessmentContainer;
