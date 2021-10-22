import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// Components
import { PrimaryButton, SecondaryButton } from '../../_core/_ui/buttons.component';
import { FormHelperText, FormInput, IFormOption } from '../../_core/_ui/forms.component';
import { Bold } from '../../_core/_ui/typography.component';
import { ColorPaletteItem, validateColor } from './check-in.helpers';
import { ITeam } from './check-in.interface';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Spacer } from '../../_core/_ui/structure.components';

interface IJerseyAssignment {
  teams: ITeam[];
  teamIndex: number;
  playerAssessment: IPlayerAssessment | null;
  checkedInPlayersHash: { [key: string]: IPlayerAssessment };
  onCancel: ClickHandler;
  positionOptions: IFormOption[];
  changePosition: Function;
  selectLoading: boolean;
  jersey?: IJersey;
  validateJersey: Function;
  assignJersey: Function;
  changeTeam: Function;
}

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'black', 'white', 'grey'];

const JerseyAssignment: React.FC<IJerseyAssignment> = ({
  teams,
  teamIndex,
  playerAssessment,
  checkedInPlayersHash,
  onCancel,
  positionOptions,
  changePosition,
  selectLoading,
  jersey,
  validateJersey,
  assignJersey,
  changeTeam
}) => {
  const [currTeamOptions, setCurrTeamOptions] = useState<IFormOption[]>([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextTeamOptions: IFormOption[] = [];

    for (let i = 0; i < teams.length; i += 1) {
      nextTeamOptions.push({ value: `${i}`, label: `Team ${i + 1}` })
    }

    setCurrTeamOptions(nextTeamOptions);
  }, [teams.length]);
  const position = playerAssessment?.position?.name;

  const [status, setStatus] = useState('WAITING');
  const [selectedColor, setSelectedColor] = useState(jersey?.color || _.get(teams, [teamIndex, 'colors', position || '', 0]));
  const [selectedNum, setSelectedNum] = useState(jersey?.number);
  const [duplicateConfirmed, setDuplicateConfirmed] = useState(false);
  const [changingJerseyColor, setChangingJerseyColor] = useState(false);
  const [colorInUse, setColorInUse] = useState<{ team: number, position: string } | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Validate current color select
    const isColorUsedResult = playerAssessment && selectedColor
      ? validateColor({ playerAssessment, teamIndex, color: selectedColor, teams })
      : null;
    setColorInUse(isColorUsedResult);

    setStatus(validateJersey({ playerAssessment, color: selectedColor, number: selectedNum, colorInUse, duplicateConfirmed, checkedInPlayersHash }));
  }, [playerAssessment?.position._id, selectedColor, selectedNum, duplicateConfirmed]);

  if (!playerAssessment) return <Typography>No player selected</Typography>;

  const { firstName, lastName } = playerAssessment.player;
  const currColors: string[] = teams[teamIndex].colors[position || ''] || [];

  return (
    <Box>
      <Box p={2}>
        <Typography>{firstName} {lastName}</Typography>
        <Box display="flex" my={2}>
          <Box flexGrow={1}><Select
            options={currTeamOptions}
            isOptionDisabled={option => teamIndex === Number(option.value)}
            value={{ value: `${teamIndex}`, label: `Team ${teamIndex + 1}`}}
            onChange={option => option && changeTeam(playerAssessment, teamIndex, option.value)}
          /></Box>
          <Box width="16px" />
          <Box flexGrow={1}><Select
            loading={selectLoading}
            options={positionOptions}
            isOptionDisabled={option => option.value === playerAssessment.position._id}
            value={{ value: playerAssessment?.position._id, label: playerAssessment.position.name }}
            onChange={option => option && changePosition(playerAssessment, teamIndex, option.value)}
          /></Box>
        </Box>
      </Box>
      <Divider />
      <Box p={2} display="flex" flexDirection="column">
        <Typography variant="h6" gutterBottom>Assign a jersey</Typography>
        {(currColors.length === 0 || changingJerseyColor) && <>
          <Typography>Find a jersey for <Bold>{firstName} {lastName}</Bold> and select the matching colour:</Typography>
          <Box pt={2}>
            {COLORS.map(color => (
              <ColorPaletteItem onClick={() => setSelectedColor(color)} color={color} active={selectedColor === color} />
            ))}
          </Box>
          {colorInUse && <>
            <Typography gutterBottom>This colour is used by <strong>Team {colorInUse.team}'s {colorInUse.position}s</strong>.</Typography>
            <Typography>
              <FormControlLabel
                control={<Checkbox checked={duplicateConfirmed} onChange={() => setDuplicateConfirmed(!duplicateConfirmed)} />}
                label={<>I want to reuse this colour for <strong>Team {teamIndex + 1}'s {position}s</strong></>}
              />
            </Typography>
          </>}
        </>}
        {currColors.length > 0 && <>
          <Typography>Other <Bold>{position}s</Bold> on <Bold>Team {teamIndex + 1}</Bold> are assigned:</Typography>
          <Box pt={2}>
            {currColors.map((color: string) => (
              <ColorPaletteItem onClick={() => setSelectedColor(color)} color={color} active={selectedColor === color} />
            ))}
          </Box>
          {!changingJerseyColor && <Typography>If you've run out of jerseys in that colour, select a new colour.<br /><a onClick={() => setChangingJerseyColor(true)}>Change colour</a></Typography>}
        </>}
        <Box p={2}><Divider /></Box>
        <Typography gutterBottom>Enter the jersey # you've given <Bold>{firstName}</Bold></Typography>
        <FormInput defaultValue={jersey?.number} type="number" onKeyUp={(e: any) => setSelectedNum(Number(e.currentTarget.value))} />
      </Box>
      <Divider />
      <Box p={2} display="flex" alignItems="center">
        <Box mr={2}>{!_.includes(['VALID', 'WAITING'], status) && <FormHelperText error>{status}</FormHelperText>}</Box>
        <Spacer />
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
        <PrimaryButton
          disabled={status !== 'VALID'}
          onClick={() => { assignJersey(playerAssessment._id, { color: selectedColor, number: selectedNum }); onCancel(); }}
        >Assign Jersey</PrimaryButton>
      </Box>
    </Box>
  );
};

export default JerseyAssignment;
