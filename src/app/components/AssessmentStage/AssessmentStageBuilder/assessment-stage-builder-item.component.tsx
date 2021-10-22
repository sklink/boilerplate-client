import React, { useState } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon  from '@material-ui/icons/Delete';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

// Components
import { IFormOption } from '../../_core/_ui/forms.component';
import { Spacer } from '../../_core/_ui/structure.components';
import { Tooltip } from '@material-ui/core';
import GroupStageBuilderContainer from '../GroupStageBuilder/group-stage-builder.container';
import SessionStageBuilderContainer from '../SessionStageBuilder/session-stage-builder.container';
import { StageItemPre, StageItemTitle } from '../assessment-stage.shared-components';
import { AddBox } from '@material-ui/icons';
import { SESSION_TERM } from '../../../lib/constants';
import RouteStageBuilderContainer from '../RouteStageBuilder/route-stage-builder.container';

interface IAssessmentStageBuilderItem {
  sessionNum: number;
  stage: IAssessmentStage;
  stages: IAssessmentStage[];
  index: number;
  drillOptions: IFormOption[];
  practicePlanOptions: IFormOption[];
  ageGroupOptions: IFormOption[];
  positionOptions: IFormOption[];
  setAgeGroupId: Function;
  ageGroupId?: string;
  createStage: Function;
  updateStage: Function;
  removeStage: Function;
}

const STAGE_COMPONENTS: { [key: string]: React.FC<any> } = {
  GROUP: GroupStageBuilderContainer,
  ROUTE: RouteStageBuilderContainer,
  SESSION: SessionStageBuilderContainer
}

const STAGE_TITLES: { [key: string]: string } = {
  GROUP: 'Group Players',
  ROUTE: 'Route Players',
  SESSION: SESSION_TERM
}

const AssessmentStageBuilderItem: React.FC<IAssessmentStageBuilderItem> = ({
  sessionNum,
  stage,
  stages,
  index,
  setAgeGroupId,
  ageGroupId,
  createStage,
  updateStage,
  removeStage,
  ...rest
}) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const StageComponent = STAGE_COMPONENTS[stage.type];

  return (
    <Box style={{ padding: '8px', background: '#fff', borderRadius: '8px', marginTop: '16px' }}>
      <StageItemPre dark={stage.type === 'SESSION'}>
        <IconButton onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? <AddBox /> : <IndeterminateCheckBoxIcon />}
        </IconButton>
        <StageItemTitle>{STAGE_TITLES[stage.type]}{stage.type === 'SESSION' && ` #${sessionNum}`}</StageItemTitle>
        <Spacer />
        <Tooltip title="Move Up" disableHoverListener={stage.order <= 1}>
          <IconButton
            disabled={stage.order <= 1}
            onClick={() => {
              updateStage(stage._id, { order: stage.order - 1 });
              updateStage(stages[index - 1]._id, { order: stage.order });
            }}
          ><ArrowUpIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Move Down" disableHoverListener={stage.order >= stages.length}>
          <IconButton
            disabled={stage.order >= stages.length}
            onClick={() => {
              updateStage(stage._id, { order: stage.order + 1 });
              updateStage(stages[index + 1]._id, { order: stage.order });
            }}
          ><ArrowDownIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Remove Stage">
          <IconButton onClick={() => {
            removeStage(stage._id);

            for (let i = index + 1; i < stages.length; i += 1) {
              updateStage(stages[i]._id, { order: stages[i].order - 1 });
            }
          }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </StageItemPre>
      {!isCollapsed && <StageComponent
        stage={stage}
        updateStage={updateStage}
        {...rest}
      />}
    </Box>
  );
};

export default AssessmentStageBuilderItem;
