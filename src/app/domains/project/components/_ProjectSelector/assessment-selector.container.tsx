import _ from 'lodash';
import React, { useEffect, useState } from 'react';

// Components
import AssessmentSelector from './assessment-selector.component';
import { IFormOption } from '../../../_core/_ui/forms.component';

interface IAssessmentSelectorContainer {
  fetchError: boolean;
  loading: boolean;
  assessments: IAssessment[];
  user?: IUser | null;
  switchAssessmentMutation: Function;
}

const AssessmentSelectorContainer: React.FC<IAssessmentSelectorContainer> = ({
  fetchError,
  loading,
  assessments,
  user,
  switchAssessmentMutation,
}) => {
  const [activeAssessmentOption, setActiveAssessmentOption] = useState<IFormOption>();
  const [assessmentOptions, setAssessmentOptions] = useState<IFormOption[]>([]);

  useEffect(() => {
    const options: IFormOption[] = assessments.map(assessment => ({ value: assessment._id, label: assessment.name }));
    setAssessmentOptions(options);

    let nextActiveAssessmentOption = _.find(options, option => option.value === user?.settings.activeAssessmentId);
    if (!nextActiveAssessmentOption && assessments.length) nextActiveAssessmentOption = options[0];
    setActiveAssessmentOption(nextActiveAssessmentOption);
  }, [user?.settings.activeAssessmentId, assessments]);

  return <AssessmentSelector
    fetchError={fetchError}
    loading={loading}
    assessmentOptions={assessmentOptions}
    activeAssessmentOption={activeAssessmentOption}
    onChangeAssessment={switchAssessmentMutation}
  />
};

export default AssessmentSelectorContainer;
