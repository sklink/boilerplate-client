import React, { useState } from 'react';

// Material UI
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// Components
import { Spacer } from '../_ui/structure.components';
import { Button } from '../_ui/buttons.component';
import Table from '@mui/material/Table';
import { Stack, TableHead } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import theme, { color } from '../../../lib/_theme';
import TableBody from '@mui/material/TableBody';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { CheckCircleOutline } from '@mui/icons-material';

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
            <Stack direction="row" spacing={1}>
              <Button color="primary" onClick={() => confirmSelection()}>Yes</Button>
              <Button onClick={() => setIsSelectingRow(true)}>Select Another Row</Button>
              <Button onClick={() => {
                setHeaderRowIndex(null);
                confirmSelection();
              }}>No Header Row</Button>
            </Stack>
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
                  <TableCell style={{ background: color.section.main }} colSpan={2} />
                  <TableCell style={{ background: color.section.main }}>A</TableCell>
                  <TableCell style={{ background: color.section.main }}>B</TableCell>
                  <TableCell style={{ background: color.section.main }}>C</TableCell>
                  <TableCell style={{ background: color.section.main }}>D</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(0, 3).map((row, index) => (
                  <TableRow key={index} style={{ height: '63px' }}>
                    <TableCell style={{ background: color.section.main }}>
                      {index === headerRowIndex && (
                        <IconButton size="small" disabled>
                          <CheckIcon style={{ color: theme.palette.success.main }} />
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
                    <TableCell style={{ background: color.section.main }}>{index + 1}</TableCell>
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
