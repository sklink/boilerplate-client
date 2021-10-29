import React from 'react';
import Select from 'react-select';

// Material UI
import Typography from '@mui/material/Typography';

// Data
import { ICompanySelector } from './company-selector.interface';

const CompanySelector: React.FC<ICompanySelector> = ({
  fetchError,
  loading,
  companyOptions,
  activeCompanyOption,
  onChangeCompany,
}) => {
  if (fetchError) if (fetchError) return <Typography>Unable to load companies at this time</Typography>;

  return (
    <Select
      menuPlacement="top"
      isloading={loading || !activeCompanyOption}
      options={companyOptions}
      onChange={option => option && onChangeCompany(option.value)}
      value={activeCompanyOption}
    />
  );
}

export default CompanySelector;
