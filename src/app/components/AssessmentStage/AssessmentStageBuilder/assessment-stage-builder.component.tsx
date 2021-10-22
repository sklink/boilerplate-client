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
import AssessmentStageBuilderItem from './assessment-stage-builder-item.component';

interface IAssessmentStageBuilder {
  stages: IAssessmentStage[];
  drillOptions: IFormOption[];
  practicePlanOptions: IFormOption[];
  ageGroupOptions: IFormOption[];
  positionOptions: IFormOption[];
  setAgeGroupId: Function;
  ageGroupId?: string;
  createStage: Function;
  updateStage: Function;
  removeStage: Function;
  loading: boolean;
  fetchError: boolean;
}

const AssessmentStageBuilder: React.FC<IAssessmentStageBuilder> = ({
  stages,
  setAgeGroupId,
  ageGroupOptions,
  ageGroupId,
  createStage,
  updateStage,
  removeStage,
  loading,
  fetchError,
  ...rest
}) => {
  if (fetchError && !ageGroupOptions.length && !stages.length) return <Typography>Something went wrong. Please try again later</Typography>;
  if (loading && !ageGroupOptions.length) return <Typography>Loading...</Typography>;
  let sessionNum = 0;

  return (
    <div>
      <Box display="flex" alignItems="center">
        <Typography>Select age group</Typography>
        <Box width="220px" ml={2}>
          <Select options={ageGroupOptions} onChange={option => option && setAgeGroupId(option.value)} />
        </Box>
      </Box>
      {stages.map((stage, index) => {
        if (stage.type == 'SESSION') sessionNum += 1;

        return <AssessmentStageBuilderItem
          sessionNum={sessionNum}
          key={stage._id}
          stage={stage}
          stages={stages}
          index={index}
          setAgeGroupId={setAgeGroupId}
          createStage={createStage}
          updateStage={updateStage}
          removeStage={removeStage}
          ageGroupOptions={ageGroupOptions}
          {...rest}
        />
      })}
      {ageGroupId && <>
        <Box my={2}><Divider/></Box>
        <Box my={2}><Typography variant="h6">Schedule Builder</Typography></Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CardButton onClick={() => createStage('GROUP')}>
              <CardButtonIcon><GroupIcon color="primary" /></CardButtonIcon>
              <SectionHeading>Sort and Group Players</SectionHeading>
              <Text>(Player Organization)</Text>
            </CardButton>
          </Grid>
          <Grid item xs={12} md={4}>
            <CardButton onClick={() => createStage('SESSION')}>
              <CardButtonIcon><EventIcon color="primary" /></CardButtonIcon>
              <SectionHeading>Configure an Ice Time</SectionHeading>
              <Text>(Evaluation Setup)</Text>
            </CardButton>
          </Grid>
          <Grid item xs={12} md={4}>
            <CardButton onClick={() => createStage('ROUTE')}>
              <CardButtonIcon><RouteIcon color="primary" /></CardButtonIcon>
              <SectionHeading>Route Players</SectionHeading>
              <Text>(Hold or Conclude Player Evaluations)</Text>
            </CardButton>
          </Grid>
        </Grid>
      </>}
    </div>
  );
};

export default AssessmentStageBuilder;
