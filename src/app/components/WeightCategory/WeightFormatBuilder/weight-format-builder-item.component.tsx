import React, { useState } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon  from '@material-ui/icons/Delete';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

// Components
import { Spacer } from '../../_core/_ui/structure.components';
import { StageItemPre, StageItemTitle } from '../../AssessmentStage/assessment-stage.shared-components';
import { AddBox } from '@material-ui/icons';

interface IWeightFormatBuilderItem {
  weightCategory: IWeightCategory;
  removeWeightCategory: Function;
}

const WeightFormatBuilderItem: React.FC<IWeightFormatBuilderItem> = ({
  weightCategory,
  removeWeightCategory
}) => {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <Box style={{ padding: '8px', background: '#fff', borderRadius: '8px', marginTop: '16px' }}>
      <StageItemPre>
        <IconButton onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? <AddBox /> : <IndeterminateCheckBoxIcon />}
        </IconButton>
        <StageItemTitle>{weightCategory.name}</StageItemTitle>
        <Spacer />
        <Tooltip title="Remove Weight Category">
          <IconButton onClick={() => removeWeightCategory(weightCategory._id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </StageItemPre>
      {!isCollapsed && (
        <Box>

        </Box>
      )}
    </Box>
  );
};

export default WeightFormatBuilderItem;
