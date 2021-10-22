import React from 'react';
import Select from 'react-select';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import RouteIcon from '@material-ui/icons/CallSplit';
import GroupIcon from '@material-ui/icons/Group';
import EventIcon from '@material-ui/icons/Event';

// Components
import { IFormOption } from '../../_core/_ui/forms.component';
import { CardButton, CardButtonIcon } from '../../_core/_ui/buttons.component';
import { SectionHeading, Text } from '../../_core/_ui/typography.component';
import WeightFormatBuilderItem from './weight-format-builder-item.component';

interface IWeightFormatBuilder {
  weightCategories: IWeightCategory[];
  ageGroupOptions: IFormOption[];
  setAgeGroupId: Function;
  ageGroupId?: string;
  removeWeightCategory: Function;
  loading: boolean;
  fetchError: boolean;
}

const WeightFormatBuilder: React.FC<IWeightFormatBuilder> = ({
  weightCategories,
  setAgeGroupId,
  ageGroupOptions,
  ageGroupId,
  removeWeightCategory,
  loading,
  fetchError
}) => {
  if (fetchError && !ageGroupOptions.length && !weightCategories.length) return <Typography>Something went wrong. Please try again later</Typography>;
  if (loading && !ageGroupOptions.length) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Box display="flex" alignItems="center">
        <Typography>Select age group</Typography>
        <Box width="220px" ml={2}>
          <Select options={ageGroupOptions} onChange={option => option && setAgeGroupId(option.value)} />
        </Box>
      </Box>
      {weightCategories.map(weightCategory => {
        return <WeightFormatBuilderItem
          weightCategory={weightCategory}
          removeWeightCategory={removeWeightCategory}
        />
      })}
      {ageGroupId && <>
        <Box my={2}><Divider/></Box>
        <Box my={2}><Typography variant="h6">Create Weight Category</Typography></Box>

        <Grid container spacing={2}>
        </Grid>
      </>}
    </div>
  );
};

export default WeightFormatBuilder;
