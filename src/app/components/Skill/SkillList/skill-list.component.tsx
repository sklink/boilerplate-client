import _ from 'lodash';
import React from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// Data
import { SKILL_TYPE_MAP } from '../../../lib/constants';

// Components
import { FormInput } from '../../_core/_ui/forms.component';
import { EnhancedTable, IEnhancedTableRow } from '../../_core/_ui/table.components';
import { PrimaryButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import { Spacer } from '../../_core/_ui/structure.components';
import ArchiveIcon from '@material-ui/icons/Archive';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Tooltip from '@material-ui/core/Tooltip';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import ToggleGlobal from '../../User/ToggleGlobal/toggle-global.component';

interface ISkillList {
  skills: Array<any>;
  countArchivedSkills: number;
  searchSkills: Function;
  loading: boolean;
  fetchError: boolean;
  selected: ISkill[];
  setSelected: Function;
  viewingArchived: boolean;
  setViewingArchived: Function;
  removeSkills: Function;
  restoreSkills: Function;
}

const SkillList: React.FC<ISkillList> = ({
  skills,
  searchSkills,
  loading,
  fetchError,
  selected,
  setSelected,
  countArchivedSkills,
  viewingArchived,
  setViewingArchived,
  removeSkills,
  restoreSkills
}) => {
  const rows: IEnhancedTableRow[] = [];

  _.each(skills, skill => {
    const row: IEnhancedTableRow = {
      _id: skill._id,
      data: skill,
      cells: [
        <TableCell key="name">{skill.name}</TableCell>,
        <TableCell key="type">{SKILL_TYPE_MAP[skill.type] || 'Unknown'}</TableCell>,
      ]
    };

    if (!skill.companyId) row.disableSelect = true;
    console.log('skill', skill, row.disableSelect)
    rows.push(row);
  });

  const columns = [
    { key: 'name', label: 'Name', path: 'name' },
    { key: 'type', label: 'Type' },
  ];

  return (
    <>
      <EnhancedTable
        numCols={3}
        columns={columns}
        rows={rows}
        defaultOrder="name"
        entityName="skills"
        showError={fetchError}
        showLoading={loading}
        title={viewingArchived ? 'Archived Skills' : 'Skills'}
        selected={selected}
        setSelected={setSelected}
        selectedAction={(
          <Tooltip title={viewingArchived ? 'Restore' : 'Delete'}>
            <IconButton aria-label="delete" onClick={() => {
              const _ids = selected.map(item => item._id);
              viewingArchived ? restoreSkills(_ids) : removeSkills(_ids);
              setSelected([]);
            }}>
              {viewingArchived ? <UnarchiveIcon /> : <DeleteIcon />}
            </IconButton>
          </Tooltip>
        )}
        filterComponent={(<>
          <Box mr={2} flexShrink={0}><ToggleGlobal label="Show Max Analytics Marketplace Skills" /></Box>
          <FormInput
            placeholder={viewingArchived ? 'Search archived skills...' : 'Search skills...'}
            onKeyUp={(e: any) => searchSkills(e.currentTarget.value)} />
        </>)}
      />
      {countArchivedSkills > 0 && !viewingArchived && (
        <Box display="flex">
          <Spacer />
          <SecondaryButton startIcon={<ArchiveIcon />} onClick={() => setViewingArchived(true)}>View Archived Skills</SecondaryButton>
        </Box>
      )}
      {viewingArchived && (
        <Box display="flex">
          <Spacer />
          <PrimaryButton startIcon={<ArrowBackIosIcon />} onClick={() => setViewingArchived(false)}>Back to Skills</PrimaryButton>
        </Box>
      )}
    </>
  );
};

export default SkillList;
