import _ from 'lodash';
import React from 'react';
import Select, { OptionTypeBase } from 'react-select';
import { ValueType } from 'react-select/src/types';

// Material UI
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import AddCircleIcon from '@material-ui/icons/AddCircle';

// Components
import { EnhancedTable, IEnhancedTableRow } from '../../_core/_ui/table.components';
import { FormHelperText, FormInput, FormLabel, IFormOption } from '../../_core/_ui/forms.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import FormControl from '@material-ui/core/FormControl';

interface ICompanyPlayerList {
  players: IPlayer[];
  search: Function;
  loading: boolean;
  fetchError: boolean;
  selected: IPlayer[];
  setSelected: Function;
  positionOptions: IFormOption[];
  ageGroupOptions: IFormOption[];
  activeAgeGroup?: IAgeGroup;
  setActiveAgeGroup: Function;
  setActivePosition: Function;
  submitError: boolean;
  addPlayersToAssessment: Function;
}

const CompanyPlayerList: React.FC<ICompanyPlayerList> = ({
  players,
  search,
  loading,
  fetchError,
  selected,
  setSelected,
  positionOptions,
  ageGroupOptions,
  activeAgeGroup,
  setActiveAgeGroup,
  setActivePosition,
  submitError,
  addPlayersToAssessment
}) => {
  const rows: IEnhancedTableRow[] = [];

  _.each(players, (player: IPlayer) => {
    rows.push({
      _id: player._id,
      data: player,
      cells: [
        <TableCell key="name">{player.lastName}, {player.firstName}</TableCell>,
        <TableCell key="dob">{player.dateOfBirth}</TableCell>,
      ]
    });
  });

  const columns = [
    { key: 'name', label: 'Name', path: 'player.lastName' },
    { key: 'dob', label: 'Date of Birth', path: 'player.dateOfBirth' },
  ];

  return (
    <>
      <Box display="flex" my={2} alignItems="center">
        <Box mr={2} width="220px">
          <FormControl>
            <FormLabel>{activeAgeGroup ? 'Assign to' : 'Select'} Age Group</FormLabel>
            <Box width="220px">
              <Select
                options={ageGroupOptions}
                onChange={(option: ValueType<OptionTypeBase, false>) => setActiveAgeGroup(option?.value)}
              />
            </Box>
          </FormControl>
        </Box>
        {activeAgeGroup && <Box mr={2} width="220px">
          <FormControl>
            <FormLabel>Assign to Position</FormLabel>
            <Box width="220px">
              <Select
                options={positionOptions}
                onChange={(option: ValueType<OptionTypeBase, false>) => setActivePosition(option?.value)}
              />
            </Box>
          </FormControl>
        </Box>}
        {submitError && (
          <Box><FormHelperText error>Please select an age group and a position</FormHelperText></Box>
        )}
      </Box>
      {activeAgeGroup && <>
        <EnhancedTable
          numCols={3}
          rows={rows}
          columns={columns}
          defaultOrder="player.lastName"
          entityName="players"
          showError={fetchError}
          showLoading={loading && rows.length === 0}
          title="Players (Not In Assessment)"
          selected={selected}
          setSelected={setSelected}
          selectedAction={(
            <PrimaryButton
              style={{ minWidth: '200px' }}
              onClick={() => addPlayersToAssessment(selected.map(item => item._id))}
              startIcon={<AddCircleIcon />}
            >Add to Assessment</PrimaryButton>
          )}
          filterComponent={(
            <FormInput
              placeholder="Search players.."
              onKeyUp={(e: any) => search(e.currentTarget.value)} />
          )}
        />
      </>}
    </>
  );
};

export default CompanyPlayerList;
