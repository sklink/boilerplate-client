import React from 'react';
import Select from 'react-select';

// Material UI
import Typography from '@mui/material/Typography';

// Data
import { IAssessmentSelector } from './assessment-selector.interface';

const AssessmentSelector: React.FC<IAssessmentSelector> = ({
  fetchError,
  loading,
  assessmentOptions,
  activeAssessmentOption,
  onChangeAssessment,
}) => {
  if (fetchError) return <Typography variant="body2">Unable to load assessments at this time</Typography>;

  return (
    <Select
      isloading={loading || !activeAssessmentOption}
      options={assessmentOptions}
      onChange={option => option && onChangeAssessment(option.value)}
      value={activeAssessmentOption}
    />
  );
}

export default AssessmentSelector;
