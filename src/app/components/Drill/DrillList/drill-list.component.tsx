import _ from 'lodash';
import React from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

// Components
import { FormInput } from '../../_core/_ui/forms.component';
import { EnhancedTable, IEnhancedTableRow } from '../../_core/_ui/table.components';
import { PrimaryButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import { Spacer } from '../../_core/_ui/structure.components';
import ToggleGlobal from '../../User/ToggleGlobal/toggle-global.component';
import { Bold } from '../../_core/_ui/typography.component';
import { mainColor } from '../../../lib/theme';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';
import { getAuthUser } from '../../../lib/services/auth.service';

interface IDrillList {
  drills: Array<any>;
  countArchivedDrills: number;
  searchDrills: Function;
  removeDrills: Function;
  restoreDrills: Function;
  loading: boolean;
  fetchError: boolean
  viewingArchived: boolean;
  setViewingArchived: Function;
  selectedDrills: IDrill[];
  setSelectedDrills: Function;
}

const DrillList: React.FC<IDrillList> = ({
  drills,
  countArchivedDrills,
  searchDrills,
  loading,
  fetchError,
  removeDrills,
  restoreDrills,
  viewingArchived,
  setViewingArchived,
  selectedDrills,
  setSelectedDrills
}) => {
  const user = getAuthUser();
  const history = useHistory();
  const rows: IEnhancedTableRow[] = [];

  console.log(user);
  _.each(drills, drill => {
    const row: IEnhancedTableRow = {
      _id: drill._id,
      data: drill,
      cells: [
        <TableCell key="actions" padding="checkbox">
          {(user?.isAdmin || drill.companyId) && (
            <IconButton onClick={() => history.push(`/drills/${drill._id}`)}>
              <EditIcon />
            </IconButton>
          )}
        </TableCell>,
        <TableCell key="name">{drill.name}</TableCell>,
        <TableCell key="skills">{
          drill.skillSets?.map((skillSet: ISkillSet, index: number) => {
            const positionNames = skillSet?.positions?.map(position => position.name).join(', ');
            const skillNames = skillSet?.skills?.map(skill => skill.name).join(', ');

            return <Typography key={index}><Bold style={{ color: mainColor }}>{positionNames}:</Bold> {skillNames}</Typography>;
          })
        }</TableCell>,
      ]
    };

    if (!drill.companyId) row.disableSelect = true;
    rows.push(row);
  });

  const columns = [
    { key: 'actions', width: '60px', disableSort: true },
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
        entityName="drills"
        showError={fetchError}
        showLoading={loading}
        title={viewingArchived ? 'Archived Drills' : 'Drills'}
        selected={selectedDrills}
        setSelected={setSelectedDrills}
        selectedAction={(
          <Tooltip title={viewingArchived ? 'Restore' : 'Delete'}>
            <IconButton aria-label="delete" onClick={() => {
              const _ids = selectedDrills.map(item => item._id);
              viewingArchived ? restoreDrills(_ids) : removeDrills(_ids);
              setSelectedDrills([]);
            }}>
              {viewingArchived ? <UnarchiveIcon /> : <DeleteIcon />}
            </IconButton>
          </Tooltip>
        )}
        filterComponent={(<>
          <Box mr={2} flexShrink={0}><ToggleGlobal label="Show Max Analytics Marketplace Drills" /></Box>
          <FormInput
            placeholder={viewingArchived ? 'Search archived drills...' : 'Search drills...'}
            onKeyUp={(e: any) => searchDrills(e.currentTarget.value)} />
        </>)}
      />
      {countArchivedDrills > 0 && !viewingArchived && (
        <Box display="flex">
          <Spacer />
          <SecondaryButton startIcon={<ArchiveIcon />} onClick={() => setViewingArchived(true)}>View Archived Drills</SecondaryButton>
        </Box>
      )}
      {viewingArchived && (
        <Box display="flex">
          <Spacer />
          <PrimaryButton startIcon={<ArrowBackIosIcon />} onClick={() => setViewingArchived(false)}>Back to Drills</PrimaryButton>
        </Box>
      )}
    </>
  );
};

export default DrillList;
