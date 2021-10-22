import _ from 'lodash';
import React from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';

// Components
import { FormInput } from '../../_core/_ui/forms.component';
import { EnhancedTable, IEnhancedTableRow } from '../../_core/_ui/table.components';
import Tooltip from '@material-ui/core/Tooltip';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import DeleteIcon from '@material-ui/icons/Delete';
import { Spacer } from '../../_core/_ui/structure.components';
import { PrimaryButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import ArchiveIcon from '@material-ui/icons/Archive';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ToggleGlobal from '../../User/ToggleGlobal/toggle-global.component';

interface IPracticePlanList {
  practicePlans: Array<any>;
  searchPracticePlans: Function;
  loading: boolean;
  fetchError: boolean;
  selected: IPracticePlan[];
  setSelected: Function;
  countArchivedPlans: number;
  removePlans: Function;
  restorePlans: Function;
  viewingArchived: boolean;
  setViewingArchived: Function;
}

const PracticePlanList: React.FC<IPracticePlanList> = ({
  practicePlans,
  countArchivedPlans,
  searchPracticePlans,
  loading,
  fetchError,
  selected,
  setSelected,
  removePlans,
  restorePlans,
  viewingArchived,
  setViewingArchived,
}) => {
  const rows: IEnhancedTableRow[] = [];

  _.each(practicePlans, practicePlan => {
    const row: IEnhancedTableRow = {
      _id: practicePlan._id,
      data: practicePlan,
      cells: [
        <TableCell key="name">{practicePlan.name}</TableCell>,
        <TableCell key="drills">{practicePlan.drills.map((drill: IDrill) => drill.name).join(', ')}</TableCell>
      ]
    };

    if (!practicePlan.companyId) row.disableSelect = true;
    rows.push(row);
  });

  const columns = [
    { key: 'name', disablePadding: true, label: 'Name', path: 'name' },
    { key: 'skills', disablePadding: true, disableSort: true, label: 'Skills' },
  ]

  return (
    <>
      <EnhancedTable
        numCols={3}
        columns={columns}
        rows={rows}
        defaultOrder="name"
        entityName="practice plans"
        showError={fetchError}
        showLoading={loading}
        title={viewingArchived ? 'Archived Practice Plans' : 'Practice Plans'}
        selected={selected}
        setSelected={setSelected}
        selectedAction={(
          <Tooltip title={viewingArchived ? 'Restore' : 'Delete'}>
            <IconButton aria-label="delete" onClick={() => {
              const _ids = selected.map(item => item._id);
              viewingArchived ? restorePlans(_ids) : removePlans(_ids);
              setSelected([]);
            }}>
              {viewingArchived ? <UnarchiveIcon /> : <DeleteIcon />}
            </IconButton>
          </Tooltip>
        )}
        filterComponent={(<>
          <Box mr={2} flexShrink={0}><ToggleGlobal label="Show Max Analytics Marketplace Plans" /></Box>
          <FormInput
            placeholder={viewingArchived ? 'Search archived plans...' : 'Search plans...'}
            onKeyUp={(e: any) => searchPracticePlans(e.currentTarget.value)} />
        </>)}
      />
      {countArchivedPlans > 0 && !viewingArchived && (
        <Box display="flex">
          <Spacer />
          <SecondaryButton startIcon={<ArchiveIcon />} onClick={() => setViewingArchived(true)}>View Archived Practice Plans</SecondaryButton>
        </Box>
      )}
      {viewingArchived && (
        <Box display="flex">
          <Spacer />
          <PrimaryButton startIcon={<ArrowBackIosIcon />} onClick={() => setViewingArchived(false)}>Back to Practice Plans</PrimaryButton>
        </Box>
      )}
    </>
  );
};

export default PracticePlanList;
