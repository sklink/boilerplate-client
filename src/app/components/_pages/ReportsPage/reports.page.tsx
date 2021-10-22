import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';

// Material UI
import Box from '@material-ui/core/Box';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { SectionHeading } from '../../_core/_ui/typography.component';
import { getAgeGroups } from '../../../lib/services/age-group.service';
import { Spacer } from '../../_core/_ui/structure.components';
import { IFormOption } from '../../_core/_ui/forms.component';
import Typography from '@material-ui/core/Typography';
import Reports from '../../Score/Reports/reports.component';

interface IReportsPage {
  match: any;
}

const ReportsPage: React.FC<IReportsPage> = ({ match }) => {
  const history = useHistory();
  const { ageGroupId } = match.params;
  const { ageGroups } = getAgeGroups();

  const [ageGroupOptions, setAgeGroupOptions] = useState<IFormOption[]>([]);
  const [currAgeGroupOption, setCurrAgeGroupOption] = useState<IFormOption>();
  const [currAgeGroup, setCurrAgeGroup] = useState<IAgeGroup>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setAgeGroupOptions(
      ageGroups.map((ageGroup: IAgeGroup) => ({ value: ageGroup._id, label: ageGroup.name }))
    );

    const foundAgeGroup = _.find(ageGroups, ageGroup => ageGroup._id === ageGroupId);
    console.log(ageGroups, ageGroupId);
    if (foundAgeGroup) {
      setCurrAgeGroupOption({value: foundAgeGroup._id, label: foundAgeGroup.name});
      setCurrAgeGroup(foundAgeGroup);
    }
  }, [ageGroups.length]);

  return (
    <DashboardLayout hideSidebar>
      <Box display="flex" alignItems="center" mt={4}>
        <Typography variant="h6">Reports</Typography>
        {currAgeGroupOption && (
          <Box width="200px" ml={2}>
            <Select
              options={ageGroupOptions}
              defaultValue={currAgeGroupOption}
              onChange={option => option && history.push(`/reports/${option.value}`)}
            />
          </Box>
        )}
      </Box>
      <Box my={2}>
        <Reports ageGroupId={ageGroupId} ageGroup={currAgeGroup} />
      </Box>
    </DashboardLayout>
  );
};

export default ReportsPage;
