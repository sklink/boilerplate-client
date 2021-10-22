import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { FetchResult } from '@apollo/client';

// Data
import { ICreateDrillContainer, ICreateDrillFields, ISkillSetFields } from './create-drill.interface';

// Components
import CreateDrill from './create-drill.component';
import { ICreatePlayerFields } from '../../Player/CreatePlayer/create-player.interface';
import { Simulate } from 'react-dom/test-utils';

const CreateDrillContainer: React.FC<ICreateDrillContainer> = ({
  drill,
  user,
  createDrill,
  skills,
  positions,
  createPosition,
  loading,
  fetchError
}) => {
  const [submitError, setSubmitError] = useState();
  const [showSaved, setShowSaved] = useState(false);
  const [skillSets, setSkillSets] = useState<ISkillSetFields[]>([{ positionIds: [], skillIds: [] }]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (drill) {
      const nextSkillSets: ISkillSetFields[] = [];

      _.each(drill.skillSets, skillSet => {
        const currPositions: IPosition[] = [];
        const currSkills: ISkill[] = [];

        _.each(skillSet.positionIds, _id => {
          const foundPosition = _.find(positions, position => position._id === _id);
          if (foundPosition) currPositions.push(foundPosition);
        });

        _.each(skillSet.skillIds, _id => {
          const foundSkill = _.find(skills, skill => skill._id === _id);
          if (foundSkill) currSkills.push(foundSkill);
        });

        nextSkillSets.push({
          skillIds: _.map(currSkills, currSkill => ({ value: currSkill._id, label: currSkill.name })),
          positionIds: _.map(currPositions, currPosition => ({ value: currPosition._id, label: currPosition.name })),
        });
      });

      nextSkillSets.push({ positionIds: [], skillIds: [] })
      setSkillSets(nextSkillSets);
    }
  }, [drill, positions.length, skills.length]);

  const INITIAL_FORM_VALUES: ICreateDrillFields = {
    drillName: drill ? drill.name : '',
    skillSets,
    isGlobal: false
  };

  async function handleSubmit(values: ICreateDrillFields, {setSubmitting, resetForm}: FormikHelpers<ICreateDrillFields>) {
    setSubmitError(null);
    const skillSets: ISkillSet[] = [];

    values.skillSets.map(skillSet => {
      if (skillSet.positionIds.length && skillSet.skillIds.length) {
        skillSets.push({
          positionIds: skillSet.positionIds.map(positionId => positionId.value),
          skillIds: skillSet.skillIds.map(skillId => skillId.value)
        });
      }
    });

    createDrill({
      name: values.drillName,
      skillSets,
      companyId: values.isGlobal ? null : user?.settings.activeCompanyId
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
              ..._.pick(values, ['skillIds'])
            }
          })
        }
      })
      .catch(err => setSubmitError(err.message))
  }

  const validationSchema = Yup.object().shape({
    drillName: Yup.string().required(`Enter a drill name`),
  });

  const skillOptions = skills.map(skill => ({ value: skill._id, label: skill.name }));
  const positionOptions = positions.map(position => ({ value: position._id, label: position.name }))
  const handleCreatePosition = (form: FormikProps<ICreatePlayerFields>, name: string, fieldName: string) => {
    createPosition(name).then((result: FetchResult) => {
      if (result.data && result.data.createPosition) {
        // @ts-ignore
        form.setFieldValue(fieldName, [...form.values[fieldName], { value: result.data.createPosition._id, label: result.data.createPosition.name }]);
        form.setFieldTouched(fieldName);
      }
    });
  }

  return (
    <Formik
      enableReinitialize
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => <CreateDrill
        form={form}
        submitError={submitError}
        showSaved={showSaved}
        skillOptions={skillOptions}
        positionOptions={positionOptions}
        createPosition={handleCreatePosition}
        loading={loading}
        fetchError={fetchError}
        isEditing={Boolean(drill)}
        isAdmin={user?.isAdmin || false}
      />}
    </Formik>
  );
}

export default CreateDrillContainer;
