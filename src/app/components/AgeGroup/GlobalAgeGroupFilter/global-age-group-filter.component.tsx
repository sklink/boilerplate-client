import React from 'react';

// Material UI
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

// Components
import { SectionWrapper } from '../../_core/_ui/structure.components';

interface IGlobalAgeGroupFilter {
  toggleAgeGroup: Function;
  ageGroups: IAgeGroup[];
  loading: boolean;
  fetchError: boolean;
  activeAgeGroupHash: any;
}

const GlobalAgeGroupFilter: React.FC<IGlobalAgeGroupFilter> = ({
  toggleAgeGroup,
  ageGroups,
  activeAgeGroupHash,
  loading,
  fetchError
}) => {
  return (
    <>
      {ageGroups.map((ageGroup: IAgeGroup) => (
        <SectionWrapper key={ageGroup._id} style={{ padding: '4px 16px', marginBottom: '8px' }}>
          <Box display="flex" flexDirection="row">
            <Box>
              <FormControlLabel
                control={<Checkbox checked={Boolean(activeAgeGroupHash[ageGroup._id])} onChange={() => toggleAgeGroup(ageGroup._id)} />}
                label={ageGroup.name}
              />
            </Box>
          </Box>
        </SectionWrapper>
      ))}
      {ageGroups.length === 0 && loading && (
        <Typography>Loading...</Typography>
      )}
      {ageGroups.length === 0 && !loading && (
        <Typography>None</Typography>
      )}
    </>
  );
};

export default GlobalAgeGroupFilter;
