import _ from 'lodash';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { FetchResult } from '@apollo/client';

// Data
import { ICreatePracticePlanContainer, ICreatePracticePlanFields } from './create-practice-plan.interface';

// Components
import CreatePracticePlan from './create-practice-plan.component';
import { getAuthUser } from '../../../lib/services/auth.service';

const CreatePracticePlanContainer: React.FC<ICreatePracticePlanContainer> = ({
  createPracticePlan,
  drills,
  drillsLoading,
  drillsError
}) => {
  const user = getAuthUser();
  const [submitError, setSubmitError] = useState();
  const [showSaved, setShowSaved] = useState(false);

  const INITIAL_FORM_VALUES: ICreatePracticePlanFields = {
    practicePlanName: '',
    drillIds: [],
    isGlobal: false
  };

  async function handleSubmit(values: ICreatePracticePlanFields, {setSubmitting, resetForm}: FormikHelpers<ICreatePracticePlanFields>) {
    setSubmitError(null);

    createPracticePlan({
      name: values.practicePlanName,
      drillIds: values.drillIds.map(drillId => drillId.value),
      companyId: values.isGlobal ? undefined : user?.settings.activeCompanyId
    })
      .then((result: FetchResult) => {
        setSubmitting(false);

        if (result.errors && result.errors.length) {
          setSubmitError(result.errors[0].message);
        } else {
          setShowSaved(true);
          setTimeout(() => {
            setShowSaved(false);
          }, 2000);

          resetForm({
            values: {
              ...INITIAL_FORM_VALUES,
              ..._.pick(values, ['drillIds'])
            }
          })
        }
      })
      .catch(err => setSubmitError(err.message))
  }

  const validationSchema = Yup.object().shape({
    practicePlanName: Yup.string().required(`Enter a practice plan name`),
    drillIds: Yup.array().test('len', 'Must apply to at least one drill', val => val.length > 0),
  });

  const drillOptions = drills.map(drill => ({ value: drill._id, label: drill.name }));

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <CreatePracticePlan
        form={form}
        submitError={submitError}
        showSaved={showSaved}
        drillOptions={drillOptions}
        drillsLoading={drillsLoading}
        drillsError={drillsError}
        isAdmin={user?.isAdmin || false}
      />}
    </Formik>
  );
}

export default CreatePracticePlanContainer;
