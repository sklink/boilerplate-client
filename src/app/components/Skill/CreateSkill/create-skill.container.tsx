import _ from 'lodash';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { FetchResult } from '@apollo/client';

// Data
import { ICreateSkillContainer, ICreateSkillFields } from './create-skill.interface';
import { SKILL_TYPE_OPTIONS } from '../../../lib/constants';

// Components
import CreateSkill from './create-skill.component';
import { getAuthUser } from '../../../lib/services/auth.service';

const CreateSkillContainer: React.FC<ICreateSkillContainer> = ({ createSkill }) => {
  const user = getAuthUser();
  const [submitError, setSubmitError] = useState();
  const [showSaved, setShowSaved] = useState(false);

  const INITIAL_FORM_VALUES: ICreateSkillFields = {
    name: '',
    type: SKILL_TYPE_OPTIONS[0],
    options: {},
    isGlobal: false
  };

  async function handleSubmit(values: ICreateSkillFields, {setSubmitting, resetForm}: FormikHelpers<ICreateSkillFields>) {
    setSubmitError(null);

    createSkill({
      ..._.omit(values, ['type', 'isGlobal']),
      type: values.type.value,
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
              isGlobal: values.isGlobal
            }
          })
        }
      })
      .catch(err => setSubmitError(err.message))
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(`Enter a skill`),
    type: Yup.string().required('Select a type'),
  });

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <CreateSkill
        form={form}
        submitError={submitError}
        showSaved={showSaved}
        isAdmin={user?.isAdmin || false}
      />}
    </Formik>
  );
}

export default CreateSkillContainer;
