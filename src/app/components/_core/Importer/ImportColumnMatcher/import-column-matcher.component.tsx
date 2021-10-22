import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Select, { OptionTypeBase } from 'react-select';

// Material UI
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import WarningIcon from '@material-ui/icons/Warning';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';

// Data
import { infoColor, sectionColor, successColor, warnColor } from '../../../../lib/theme';
import { numToAlpha, toPercent } from '../../../../lib/helpers/conversion.helpers';
import { IColumnMap, ISampleCell } from './import-matcher.interface';
import { FORMAT_OPTIONS } from '../importer.constants';

// Components
import { Spacer } from '../../_ui/structure.components';
import { Notice } from '../../_ui/icons.component';
import { IImportColumn } from '../importer.interface';
import { ActionMeta, ValueType } from 'react-select/src/types';
import { FieldName } from '../../_ui/typography.component';
import { ButtonRow, OutlineButton, PrimaryButton } from '../../_ui/buttons.component';
import { IFormOption } from '../../_ui/forms.component';

interface IImportColumnMatcher {
  index: number;
  headerRowIndex: number | null;
  header: string | false | null;
  sample: ISampleCell[];
  expectedColumns: IImportColumn[];
  currentMapping: IColumnMap;
  setColumnMapping: Function;
  rows: string[][];
}

const ImportColumnMatcher: React.FC<IImportColumnMatcher> = ({
  index,
  headerRowIndex,
  header,
  sample,
  expectedColumns,
  currentMapping,
  setColumnMapping,
  rows,
}) => {
  const [columnOptions, setColumnOptions] = useState();
  const [rowValueCount, setRowHasValue] = useState<number>(0);
  const [rowValidCount, setRowValidCount] = useState<number>(0);
  const [hasValidated, setHasValidated] = useState(false);
  const currentFormatOptions: IFormOption[] = FORMAT_OPTIONS[currentMapping.column?.formatType || 'DATE'];
  const rowCount = _.isNull(headerRowIndex) ? rows.length : rows.length - 1;

  useEffect(() => {
    setColumnOptions(expectedColumns.map(column => ({ value: column.key, label: column.label })));
  }, [expectedColumns]);
  const selectedOption = currentMapping.column && ({ value: currentMapping.column.key, label: currentMapping.column.label });

  const onChangeColumnMapping = (value: ValueType<OptionTypeBase, false>, action: ActionMeta<OptionTypeBase>) => {
    const nextMappedColumn = _.find(expectedColumns, column => value && column.key === value.value);

    setColumnMapping(index, { ...currentMapping, column: nextMappedColumn });
  };

  const onLockColumn = () =>
    setColumnMapping(index, { column: currentMapping.column, isIgnored: false, isLocked: true });

  const onIgnoreColumn = () =>
    setColumnMapping(index, { column: currentMapping.column, isIgnored: true, isLocked: true });

  const onEditColumn = () =>
    setColumnMapping(index, { column: currentMapping.column, isIgnored: false, isLocked: false });

  useEffect(() => {
    let countValid = 0;
    let countHasValue = 0;

    rows.forEach((row: string[], rowIndex: number) => {
      if (rowIndex !== headerRowIndex) {
        let isValid = true;

        if (row[index] && row[index].length > 0) {
          countHasValue += 1;
        }

        if (currentMapping.column && currentMapping.column.validators) {
          currentMapping.column.validators.forEach(validator => {
            if (isValid && !validator(row[index], currentMapping.column?.format)) {
              isValid = false;
            }
          });
        }

        if (isValid) {
          countValid += 1;
        }
      }
    });

    setHasValidated(true);
    setRowHasValue(countHasValue);
    setRowValidCount(countValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, rows, currentMapping.column]);

  return (
    <Box m={2}>
      <Paper>
        <Box display="flex" p={2}>
          <Box width="50%">
            <Table style={{ border: '1px solid #ddd' }}>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: '40px', background: sectionColor }}>{numToAlpha(index + 1)}</TableCell>
                  <TableCell style={{ padding: '0 16px', background: sectionColor }}>
                    <Box display="flex" alignItems="center">
                      {header}
                      <Spacer />
                      <Box width="188px">
                        <Select
                          value={selectedOption}
                          placeholder="Select mapping..."
                          options={columnOptions}
                          onChange={onChangeColumnMapping}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                {!currentMapping.isLocked && sample.map((item: ISampleCell) => (
                  <TableRow key={`${item.rowNum}_${item.cellData}`}>
                    <TableCell style={{ background: sectionColor }}>{item.rowNum}</TableCell>
                    <TableCell colSpan={header ? 2 : 1}>{item.cellData}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {currentMapping.isLocked && (
            <Box px={3} display="flex" justifyContent="center" flexGrow={1} alignItems="center">
              {currentMapping.column && !currentMapping.isIgnored
              && <Notice icon={<SyncAltIcon />}>Matched to the <FieldName>{currentMapping.column.label}</FieldName> field</Notice>
              }
              {currentMapping.isIgnored && <Notice icon={<InfoIcon style={{ color: infoColor }} />}>Ignoring this column</Notice>}
              <Spacer />
              <OutlineButton size="small" onClick={onEditColumn}>Edit</OutlineButton>
            </Box>
          )}

          {!currentMapping.isLocked && (
            <Box px={3} display="flex" flexDirection="column" justifyContent="center">
              {!hasValidated && <Typography>Validating...</Typography>}
              <Box mb={2}>
                <ButtonRow>
                  <PrimaryButton size="small" onClick={onLockColumn} disabled={!currentMapping.column}>Confirm Mapping</PrimaryButton>
                  <OutlineButton size="small" onClick={onIgnoreColumn}>Ignore Column</OutlineButton>
                </ButtonRow>
              </Box>
              {currentMapping.column && !currentMapping.isIgnored
              && <Notice icon={<SyncAltIcon />}>Matched to the <FieldName>{currentMapping.column.label}</FieldName> field</Notice>
              }
              {!currentMapping.column && <Notice icon={<WarningIcon style={{ color: warnColor }} />}>Unable to automatically match</Notice>}
              {hasValidated && (
                <>
                  <Notice icon={<InfoIcon style={{ color: infoColor }} />}>{toPercent(rowValueCount / rowCount)} of your rows have a value for this column</Notice>
                  {currentMapping.column && rowValidCount < rowValueCount
                  && <Notice icon={<WarningIcon style={{ color: warnColor }} />}>{toPercent((rowValueCount - rowValidCount) / rowValueCount)} of rows fail validation (repair on next step)</Notice>}
                  {currentMapping.column && currentMapping.column.formatType && (<>
                    <Typography gutterBottom>Validation format:</Typography>
                    <Select
                      options={currentFormatOptions}
                      defaultValue={{ value: currentMapping.column.format, label: currentMapping.column.format }}
                      onChange={option => setColumnMapping(index, { ...currentMapping, column: { ...currentMapping.column, format: option?.value || currentMapping.column?.format } })}
                    />
                  </>)}
                </>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ImportColumnMatcher;
// isDisabled={columnMap[i] && columnMap[i].isLocked}
// defaultValue={columnMap[i] ? { value: columnMap[i].column.key, label: columnMap[i].column.label } : null}
// options={columnOptions}
