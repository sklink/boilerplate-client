import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Material UI
import DeleteIcon from '@mui/icons-material/Delete';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Box from '@mui/material/Box';
import ArchiveIcon from '@mui/icons-material/Archive';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// Data
import theme from '../../../../lib/_theme';

// Components
import { EnhancedTable, IEnhancedTableRow } from '../../../_core/_ui/table.components';
import { FormInput } from '../../../_core/_ui/forms.component';
import { Spacer } from '../../../_core/_ui/structure.components';
import { ROLES } from '../../../../../_configuration';
import { Button } from '../../../_core/_ui/buttons.component';

dayjs.extend(relativeTime);

interface IMemberList {
  revokeAccess: Function;
  restoreAccess: Function;
  currUser: IUser;
  members: IMember[];
  countArchivedMembers: number;
  loading: boolean;
  fetchError: boolean;
  search: Function;
  selected: IMember[];
  setSelected: Function;
  viewingArchived: boolean;
  setViewingArchived: Function;
  updateMemberRoles: Function;
  toggleRole: Function;
  currMember?: IMember;
}

const MemberList: React.FC<IMemberList> = ({
  revokeAccess,
  restoreAccess,
  currUser,
  members,
  countArchivedMembers,
  loading,
  fetchError,
  search,
  selected,
  setSelected,
  viewingArchived,
  setViewingArchived,
  updateMemberRoles,
  toggleRole,
  currMember
}) => {
  const rows: IEnhancedTableRow[] = [];
  const numRoles = Object.keys(ROLES).length;

  _.each(members, (member: IMember) => {
    const isCurrMember = currMember && member._id === currMember._id;

    rows.push({
      _id: member._id,
      data: member,
      disableSelect: isCurrMember,
      cells: [
        <TableCell key="name">{member.user.name}<br />{member.user.email}</TableCell>,
        <TableCell align="center" key="all">
          <Checkbox
            checked={member.roles.length === numRoles}
            onClick={() => {
              const roles =  member.roles.length === numRoles ? [] : Object.keys(ROLES);
              if (member.roles.length === numRoles && currMember?._id === member._id) {
                roles.push('USER_MANAGEMENT');
              }

              updateMemberRoles(member, roles);
            }}
          />
        </TableCell>,
        <TableCell align="center" key="users">
          <Checkbox
            disabled={isCurrMember}
            checked={_.includes(member.roles, 'USER_MANAGEMENT')}
            onClick={() => toggleRole(member, 'USER_MANAGEMENT')}
          />
        </TableCell>
      ]
    });
  });

  const columns = [
    { key: 'name', label: 'Name', path: 'member.user.name' },
    { key: 'all', label: 'All Roles', disableSort: true },
    { key: 'users', label: 'User Management', disableSort: true, helper: 'Allows access to invite and manage users' },
  ];

  return <>
    <EnhancedTable
      numCols={columns.length}
      rows={rows}
      columns={columns}
      defaultOrder="player.lastName"
      entityName="players"
      showError={fetchError}
      showLoading={loading && rows.length === 0}
      title="Users"
      selected={selected}
      setSelected={setSelected}
      selectedAction={(
        <Tooltip title={viewingArchived ? 'Restore Access' : 'Revoke Access'}>
          <IconButton
            onClick={() => {
              const _ids = selected.map(item => item._id);
              viewingArchived ? restoreAccess(_ids) : revokeAccess(_ids);
              setSelected([]);
            }}
            size="large">
            {viewingArchived ? <UnarchiveIcon /> : <DeleteIcon />}
          </IconButton>
        </Tooltip>
      )}
      filterComponent={(
        <FormInput
          placeholder={viewingArchived ? `Search archived users...` : `Search users...`}
          onKeyUp={(e: any) => search(e.currentTarget.value)} />
      )}
    />

    {countArchivedMembers > 0 && !viewingArchived && (
      <Box display="flex">
        <Spacer />
        <Button bg="white" startIcon={<ArchiveIcon />} onClick={() => setViewingArchived(true)}>View Archived Users</Button>
      </Box>
    )}
    {viewingArchived && (
      <Box display="flex">
        <Spacer />
        <Button bg={theme.palette.primary.main} startIcon={<ArrowBackIosIcon />} onClick={() => setViewingArchived(false)}>Back to Users</Button>
      </Box>
    )}
  </>;
}

export default MemberList;
