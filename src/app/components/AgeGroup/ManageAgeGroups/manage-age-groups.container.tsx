import React from 'react';

// Material UI
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Components
import { SectionWrapper } from '../../_core/_ui/structure.components';
import ManageAgeGroupsItem from './manage-age-groups-item.component';
import { Link } from 'react-router-dom';
import { SESSIONS_TERM } from '../../../lib/constants';

interface IManageAGeGroupsContainer {
  ageGroups: IAgeGroup[];
  fetchError: boolean;
  loading: boolean;
  activateAgeGroup: Function;
}

const ManageAgeGroupsContainer: React.FC<IManageAGeGroupsContainer> = ({
  ageGroups,
  fetchError,
  loading,
  activateAgeGroup
}) => {
  if (loading && !ageGroups.length) return <Typography>Loading...</Typography>;
  if (fetchError) return <Typography>Unable to load age groups at this time. Please try again later</Typography>;

  return (
    <SectionWrapper>
      <Box display="flex" flexWrap="wrap">
        {ageGroups.map(ageGroup => (
          <Box key={ageGroup._id} mb={2} width="calc(50% - 16px)" mr={2}>
            <Paper>
              <Box p={2}>
                <ManageAgeGroupsItem activateAgeGroup={activateAgeGroup} key={ageGroup._id} ageGroup={ageGroup} />
              </Box>
            </Paper>
          </Box>
        ))}
        {ageGroups.length === 0 && !loading && (
          <Typography>Import <Link to="/players">players</Link> and <Link to="/sessions">{SESSIONS_TERM.toLowerCase()}</Link> to get started</Typography>
        )}
        {ageGroups.length === 0 && loading && (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </SectionWrapper>
  );
};

export default ManageAgeGroupsContainer;
