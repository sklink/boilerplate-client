import React, { useState } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

// Components
import { Spacer } from '../_ui/structure.components';
import { ButtonRow, OutlineButton, PrimaryButton } from '../_ui/buttons.component';
import Table from '@material-ui/core/Table';
import { TableHead } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import { sectionColor, successColor } from '../../../lib/theme';
import TableBody from '@material-ui/core/TableBody';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import { CheckCircleOutline } from '@material-ui/icons';

interface IImportHeaderSelection {
  fileName: string;
  rows: string[][];
  confirmSelection: Function;
  setHeaderRowIndex: Function;
  headerRowIndex: number;
}

const ImportHeaderSelection: React.FC<IImportHeaderSelection> = ({
  fileName,
  rows,
  confirmSelection,
  setHeaderRowIndex,
  headerRowIndex
}) => {
  const [isSelectingRow, setIsSelectingRow] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper>
          <Box p={2} pl={3} display="flex" alignItems="center">
            <Typography variant="h6">Does the selected row contain column headers?</Typography>
            <Spacer />
            <ButtonRow>
              <PrimaryButton onClick={() => confirmSelection()}>Yes</PrimaryButton>
              <OutlineButton onClick={() => setIsSelectingRow(true)}>Select Another Row</OutlineButton>
              <OutlineButton onClick={() => {
                setHeaderRowIndex(null);
                confirmSelection();
              }}>No Header Row</OutlineButton>
            </ButtonRow>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">{fileName}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box style={{ border: '16px solid #fff', borderRadius: '8px' }}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ background: sectionColor }} colSpan={2} />
                  <TableCell style={{ background: sectionColor }}>A</TableCell>
                  <TableCell style={{ background: sectionColor }}>B</TableCell>
                  <TableCell style={{ background: sectionColor }}>C</TableCell>
                  <TableCell style={{ background: sectionColor }}>D</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(0, 3).map((row, index) => (
                  <TableRow key={index} style={{ height: '63px' }}>
                    <TableCell style={{ background: sectionColor }}>
                      {index === headerRowIndex && (
                        <IconButton size="small" disabled>
                          <CheckIcon style={{ color: successColor }} />
                        </IconButton>
                      )}
                      {index !== headerRowIndex && isSelectingRow && (
                        <IconButton size="small" onClick={() => {
                          setHeaderRowIndex(index);
                          setIsSelectingRow(false);
                        }}>
                          <CheckCircleOutline />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell style={{ background: sectionColor }}>{index + 1}</TableCell>
                    {row.slice(0, 4).map((cell, cellIndex) => (
                      <TableCell key={cell}>{row[cellIndex]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ImportHeaderSelection;
