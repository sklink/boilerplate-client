import React from 'react';
import Select from 'react-select';

// Material UI
import Box from '@material-ui/core/Box';

// Components
import { EnhancedTable, IEnhancedTableColumn, IEnhancedTableRow } from '../../_core/_ui/table.components';
import { IFormOption } from '../../_core/_ui/forms.component';

interface IPlayerScores {
  rows: IEnhancedTableRow[];
  columns: IEnhancedTableColumn[];
  activeOption?: IFormOption;
  options: IFormOption[];
  setOption: Function;
}
const PlayerScores: React.FC<IPlayerScores> = ({
  rows,
  columns,
  options,
  activeOption,
  setOption
}) => {
  return (
    <>
      <Box my={2}>
        <Select
          options={options}
          value={activeOption}
          onChange={option => option && setOption(option)}
        />
      </Box>
      <EnhancedTable
        numCols={columns.length + 1}
        columns={columns}
        rows={rows}
        defaultOrder="jerseyNum"
        disableSelect
      />
    </>
  );
};

export default PlayerScores;
