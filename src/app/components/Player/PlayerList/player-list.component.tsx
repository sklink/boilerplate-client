import _ from 'lodash';
import { useHistory } from 'react-router';
import React from 'react';

// Material UI
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ArchiveIcon from '@material-ui/icons/Archive';

// Components
import { EnhancedTable, IEnhancedTableRow } from '../../_core/_ui/table.components';
import { FormInput } from '../../_core/_ui/forms.component';
import Tooltip from "@material-ui/core/Tooltip";
import { getAuthUser } from '../../../lib/services/auth.service';
import { toListSentence } from '../../../lib/helpers/conversion.helpers';

interface IPlayerList {
  playerAssessments: Array<IPlayerAssessment>;
  search: Function;
  loading: boolean;
  fetchError: boolean;
  selected: IPlayerAssessment[];
  setSelected: Function;
  removePlayerAssessments: Function;
}

const PlayerList: React.FC<IPlayerList> = ({
  playerAssessments,
  search,
  loading,
  fetchError,
  selected,
  setSelected,
  removePlayerAssessments
}) => {
  const user = getAuthUser();
  const history = useHistory();
  const rows: IEnhancedTableRow[] = [];

  _.each(playerAssessments, (playerAssessment: IPlayerAssessment) => {
    rows.push({
      _id: playerAssessment._id,
      data: playerAssessment,
      cells: [
        <TableCell key="actions" padding="checkbox">
          <IconButton onClick={() => history.push(`/players/${playerAssessment.player?._id}/${playerAssessment._id}`)}>
            <EditIcon />
          </IconButton>
        </TableCell>,
        <TableCell key="session">{playerAssessment.assessmentSessionCount}</TableCell>,
        <TableCell key="name">{playerAssessment.player?.lastName}, {playerAssessment.player?.firstName}</TableCell>,
        <TableCell key="ageGroup">{playerAssessment.ageGroup?.name}</TableCell>,
        <TableCell key="position">{playerAssessment.position?.name}</TableCell>
      ]
    });
  });

  const columns = [
    { key: 'actions', width: '60px', disableSort: true },
    { key: 'assessmentSessionCount', width: '92px', label: 'Ice Times' },
    { key: 'name', label: 'Name', path: 'player.lastName' },
    { key: 'ageGroup', label: 'Age Group', path: 'ageGroup.name' },
    { key: 'position', label: 'Position', path: 'position.name' },
  ];

  return (
    <>
      <EnhancedTable
        numCols={5}
        rows={rows}
        columns={columns}
        defaultOrder="player.lastName"
        entityName="players"
        showError={fetchError}
        showLoading={loading && rows.length === 0}
        title="Players in Assessment"
        selected={selected}
        setSelected={setSelected}
        selectedAction={(
          <Tooltip title="Remove from Assessment">
            <IconButton aria-label="archive" onClick={() => {
                const playerNames = selected.map(item => `${item.player.firstName} ${item.player.lastName}`);

              if (window.confirm(`Are you sure you want to remove ${toListSentence(playerNames)} from the assessment?`)) {
                removePlayerAssessments(selected.map(item => item._id));
                setSelected([]);
              }
            }}>
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        )}
        filterComponent={(
          <FormInput
            placeholder="Search players.."
            onKeyUp={(e: any) => search(e.currentTarget.value)} />
        )}
        noResultsMessage={user?.settings.activeAgeGroupIds.length ? 'No Results Found' : 'No Age Groups Selected'}
      />
    </>
  );
};

export default PlayerList;
