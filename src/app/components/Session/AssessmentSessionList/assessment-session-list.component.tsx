import _ from 'lodash';
import React from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

// Data
import { SESSION_TERM, SESSIONS_TERM } from '../../../lib/constants';
import { numToTime } from '../../../lib/helpers/conversion.helpers';

// Components
import { EnhancedTable, IEnhancedTableRow, TableCell } from '../../_core/_ui/table.components';
import { FormInput } from '../../_core/_ui/forms.component';
import { Spacer } from '../../_core/_ui/structure.components';
import { pluralTerm } from '../../../lib/helpers/term.helper';
import Tooltip from '@material-ui/core/Tooltip';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import DeleteIcon from '@material-ui/icons/Delete';
import { PrimaryButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import ArchiveIcon from '@material-ui/icons/Archive';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from 'react-router';
import { getAuthUser } from '../../../lib/services/auth.service';

interface IAssessmentSessionList {
  assessmentSessions: Array<IAssessmentSession>;
  countArchivedSessions: number;
  search: Function;
  loading: boolean;
  fetchError: boolean;
  selected: IAssessmentSession[];
  setSelected: Function;
  viewingArchived: boolean;
  setViewingArchived: Function;
  removeSessions: Function;
  restoreSessions: Function;
}

const AssessmentSessionList: React.FC<IAssessmentSessionList> = ({
  assessmentSessions,
  search,
  loading,
  fetchError,
  selected,
  setSelected,
  countArchivedSessions,
  viewingArchived,
  setViewingArchived,
  removeSessions,
  restoreSessions
}) => {
  const user = getAuthUser();
  const history = useHistory();
  const rows: IEnhancedTableRow[] = [];

  _.each(assessmentSessions, (assessmentSession: IAssessmentSession) => {
    rows.push({
      _id: assessmentSession._id,
      data: assessmentSession,
      cells: [
      <TableCell key="actions" padding="checkbox">
        <IconButton onClick={() => history.push(`/sessions/${assessmentSession._id}`)}>
          <EditIcon/>
        </IconButton>
      </TableCell>,
      <TableCell key="ageGroup">{assessmentSession.ageGroup.name}</TableCell>,
      <TableCell key="playerCount">{assessmentSession.playerCount}</TableCell>,
      <TableCell key="date">{assessmentSession.date}</TableCell>,
      <TableCell key="start">{numToTime(assessmentSession.start)}</TableCell>,
      <TableCell key="duration">{assessmentSession.duration}</TableCell>,
      <TableCell key="location">{assessmentSession.location || '-'}</TableCell>,
      <TableCell key="address">{assessmentSession.address}</TableCell>,
      <TableCell key="gender">{assessmentSession.gender}</TableCell>
      ]
    });
  });

  const columns = [
    { key: 'actions', disableSort: true, disablePadding: true, width: '60px' },
    { key: 'ageGroup', disablePadding: true, label: 'Age' },
    { key: 'playerCount', disablePadding: true, label: 'Players' },
    { key: 'date', disablePadding: true, label: 'Date', width: '112px' },
    { key: 'time', disablePadding: true, label: 'Time', width: '92px' },
    { key: 'duration', disablePadding: true, label: 'Duration' },
    { key: 'location', disablePadding: true, label: 'Location' },
    { key: 'address', disablePadding: true, label: 'Address' },
    { key: 'gender', disablePadding: true, label: 'Gender' },
  ];

  return (
    <>
      <Box mb={2} display="flex">
        <FormInput placeholder={`Search ${pluralTerm(SESSION_TERM).toLowerCase()}...`} onKeyUp={(e: any) => search(e.currentTarget.value)} />
      </Box>
      <EnhancedTable
        numCols={8}
        columns={columns}
        rows={rows}
        defaultOrder="date"
        entityName={pluralTerm(SESSION_TERM).toLowerCase()}
        showError={fetchError}
        showLoading={loading}
        title={viewingArchived ? `Archived ${SESSIONS_TERM}` : SESSIONS_TERM}
        selected={selected}
        setSelected={setSelected}
        selectedAction={(
          <Tooltip title={viewingArchived ? 'Restore' : 'Delete'}>
            <IconButton aria-label="delete" onClick={() => {
              const _ids = selected.map(item => item._id);
              viewingArchived ? restoreSessions(_ids) : removeSessions(_ids);
              setSelected([]);
            }}>
              {viewingArchived ? <UnarchiveIcon /> : <DeleteIcon />}
            </IconButton>
          </Tooltip>
        )}
        filterComponent={(
          <FormInput
            placeholder={viewingArchived ? `Search archived ${SESSIONS_TERM}...` : `Search ${SESSIONS_TERM}...`}
            onKeyUp={(e: any) => search(e.currentTarget.value)} />
        )}
        noResultsMessage={user?.settings.activeAgeGroupIds.length ? 'No Results Found' : 'No Age Groups Selected'}
      />
      {countArchivedSessions > 0 && !viewingArchived && (
        <Box display="flex">
          <Spacer />
          <SecondaryButton startIcon={<ArchiveIcon />} onClick={() => setViewingArchived(true)}>View Archived {SESSIONS_TERM}</SecondaryButton>
        </Box>
      )}
      {viewingArchived && (
        <Box display="flex">
          <Spacer />
          <PrimaryButton startIcon={<ArrowBackIosIcon />} onClick={() => setViewingArchived(false)}>Back to {SESSIONS_TERM}</PrimaryButton>
        </Box>
      )}
    </>
  );
};

export default AssessmentSessionList;
