import React from 'react';

// Material UI
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

// Data
import { IImportColumnSet, IImporterInstructions } from './importer.interface';
import AddFileIcon from '../../../assets/undraw/undraw_Add_files_re_v09g.svg';

// Components
import { IndentedList } from '../_ui/list.components';
import { Quote } from '../_ui/typography.component';
import DropFile from '../DropFile/drop-file.component';
import { LargeIcon } from '../_ui/icons.component';
import { FormHelperText } from '../_ui/forms.component';
import { IImportColumn } from './importer.interface';

const ImporterInstructions: React.FC<IImporterInstructions> = ({
  handleReceivedFiles,
  parseError,
  header,
  footer,
  extensions,
  requiredColumns,
  optionalColumns,
  repeatedColumnSets,
  showFileStructure,
}) => {
  return (
    <Box pt={2}>
      {header}

      <Box my={4}>
        <DropFile useWrapper onReceivedFiles={handleReceivedFiles}>
          <Box mb={2}><LargeIcon src={AddFileIcon} /></Box>
          <Typography>Drag a file in here to import, or click to select a file</Typography>
          <Typography variant="body2">{extensions.join(',')}</Typography>
        </DropFile>
      </Box>

      {parseError && <FormHelperText error>{parseError}</FormHelperText>}

      {showFileStructure && (
        <>
          <Typography variant="h6">File Structure</Typography>

          <Box my={4}>
            <Quote>
              {requiredColumns && (
                <IndentedList dense>
                  <ListSubheader>Required Columns</ListSubheader>
                  {requiredColumns.map((column: IImportColumn) => (
                    <ListItem key={column.key}>
                      <ListItemText primary={column.label} />
                    </ListItem>
                  ))}
                </IndentedList>
              )}

              {optionalColumns && (
                <IndentedList dense>
                  <ListSubheader>Optional Columns</ListSubheader>
                  {optionalColumns.map((column: IImportColumn) => (
                    <ListItem key={column.key}>
                      <ListItemText primary={column.label} secondary={column.description} />
                    </ListItem>
                  ))}
                </IndentedList>
              )}

              {repeatedColumnSets && repeatedColumnSets.length > 0 && (
                <IndentedList dense>
                  <ListSubheader>Your import file may repeat these columns</ListSubheader>
                  {repeatedColumnSets.map((set: IImportColumnSet) => (
                    <React.Fragment key={set.name}>
                      <ListSubheader>{set.name}</ListSubheader>
                      {set.columns.map((column: IImportColumn) => (
                        <ListItem key={column.key}>
                          <ListItemText primary={column.label} secondary={column.description} />
                        </ListItem>
                      ))}
                    </React.Fragment>
                  ))}
                </IndentedList>
              )}
            </Quote>
          </Box>
        </>
      )}

      {footer}
    </Box>
  );
};

export default ImporterInstructions;
